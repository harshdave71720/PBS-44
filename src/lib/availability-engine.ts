/**
 * Booking Availability Engine for PBS-44
 * Determines if a booking request can be accepted based on existing bookings.
 */

import {
  AvailabilityStatus,
  ConflictType,
  AvailabilityCheckResult,
  AvailabilityCheckRequest,
  BookingForAvailability,
  EventAvailabilityRule,
  ConflictDetail,
  BookingAvailabilityInput,
} from "@/types/availability"

// Re-export for convenience
export { AvailabilityStatus, ConflictType }

const EVENT_BASE_RULES: Record<string, EventAvailabilityRule> = {
  sooraj_pooja: {
    eventType: "sooraj_pooja",
    preferredAreas: ["SPH"],
    alternateAreas: ["GF", "FLW"],
    areaSelectionMode: "all_required",
    requiresKitchen: false,
    allowMultipleBookings: true,
    typicalTimeSlots: ["MORNING"],
    maxConcurrentBookings: 2,
  },
  shraddha_paksh: {
    eventType: "shraddha_paksh",
    preferredAreas: ["GF"],
    alternateAreas: ["FLW"],
    areaSelectionMode: "one_of",
    requiresKitchen: true,
    allowMultipleBookings: true,
    typicalTimeSlots: ["MORNING", "AFTERNOON"],
    maxConcurrentBookings: 2,
  },
  birthday_party: {
    eventType: "birthday_party",
    preferredAreas: ["FLW", "FRW", "RT"],
    alternateAreas: ["GF", "SPH"],
    areaSelectionMode: "one_of",
    requiresKitchen: false,
    allowMultipleBookings: true,
    typicalTimeSlots: ["EVENING"],
    maxConcurrentBookings: 2,
  },
  uttara_kary: {
    eventType: "uttara_kary",
    preferredAreas: ["GF"],
    alternateAreas: ["FLW", "FRW"],
    areaSelectionMode: "one_of",
    requiresKitchen: true,
    allowMultipleBookings: false,
    typicalTimeSlots: ["MORNING", "AFTERNOON"],
    maxConcurrentBookings: 1,
  },
  barsi: {
    eventType: "barsi",
    preferredAreas: ["GF"],
    alternateAreas: ["FLW"],
    areaSelectionMode: "one_of",
    requiresKitchen: true,
    allowMultipleBookings: true,
    typicalTimeSlots: ["MORNING", "AFTERNOON"],
    maxConcurrentBookings: 2,
  },
  marriage: {
    eventType: "marriage",
    preferredAreas: ["GF", "RT"],
    alternateAreas: ["FLW", "FRW"],
    areaSelectionMode: "one_of",
    requiresKitchen: true,
    allowMultipleBookings: false,
    typicalTimeSlots: ["AFTERNOON", "EVENING", "FULL_DAY"],
    maxConcurrentBookings: 1,
  },
  mahila_sangeet: {
    eventType: "mahila_sangeet",
    preferredAreas: ["GF", "FLW"],
    alternateAreas: ["FRW", "RT"],
    areaSelectionMode: "one_of",
    requiresKitchen: false,
    allowMultipleBookings: false,
    typicalTimeSlots: ["AFTERNOON", "EVENING"],
    maxConcurrentBookings: 1,
  },
  other: {
    eventType: "other",
    preferredAreas: ["GF"],
    alternateAreas: ["FLW", "FRW", "RT", "SPH"],
    areaSelectionMode: "one_of",
    requiresKitchen: false,
    allowMultipleBookings: true,
    typicalTimeSlots: ["MORNING", "AFTERNOON", "EVENING"],
    maxConcurrentBookings: 2,
  },
}

const DEFAULT_EVENT_RULE: EventAvailabilityRule = {
  eventType: "default",
  preferredAreas: ["GF"],
  alternateAreas: ["FLW", "FRW", "RT", "SPH"],
  areaSelectionMode: "one_of",
  requiresKitchen: false,
  allowMultipleBookings: true,
  typicalTimeSlots: ["AFTERNOON"],
  maxConcurrentBookings: 2,
}

const TIME_SLOT_CONFLICT_MAP: Record<string, string[]> = {
  FULL_DAY: ["MORNING", "AFTERNOON", "EVENING", "FULL_DAY"],
  MORNING: ["MORNING", "FULL_DAY"],
  AFTERNOON: ["AFTERNOON", "FULL_DAY"],
  EVENING: ["EVENING", "FULL_DAY"],
}

const ACTIVE_BOOKING_STATUSES = new Set(["approved", "confirmed"])

function normalizeEventType(eventType: string): string {
  return eventType.trim().toLowerCase()
}

function normalizeTimeSlot(timeSlot: string): string {
  return timeSlot.trim().toUpperCase()
}

function normalizeDate(date: Date | string): Date {
  const resolvedDate = date instanceof Date ? date : new Date(date)
  return new Date(
    resolvedDate.getFullYear(),
    resolvedDate.getMonth(),
    resolvedDate.getDate()
  )
}

function isSameDay(dateA: Date | string, dateB: Date | string): boolean {
  const left = normalizeDate(dateA)
  const right = normalizeDate(dateB)

  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate()
  )
}

function isTimeSlotConflict(slotA: string, slotB: string): boolean {
  const normalizedA = normalizeTimeSlot(slotA)
  const normalizedB = normalizeTimeSlot(slotB)

  return (
    TIME_SLOT_CONFLICT_MAP[normalizedA]?.includes(normalizedB) ||
    TIME_SLOT_CONFLICT_MAP[normalizedB]?.includes(normalizedA) ||
    false
  )
}

function getActiveBookingsForDateTime(
  bookings: BookingForAvailability[],
  date: Date | string,
  timeSlot: string
): BookingForAvailability[] {
  return bookings.filter((booking) => {
    if (!ACTIVE_BOOKING_STATUSES.has(booking.status)) {
      return false
    }

    if (!isSameDay(booking.date, date)) {
      return false
    }

    return isTimeSlotConflict(booking.timeSlot, timeSlot)
  })
}

function resolveEventRule(eventType: string, foodRequired: boolean): EventAvailabilityRule {
  const normalizedEventType = normalizeEventType(eventType)
  const baseRule = EVENT_BASE_RULES[normalizedEventType] ?? {
    ...DEFAULT_EVENT_RULE,
    eventType: normalizedEventType,
  }

  // Sooraj Pooja + Lunch => SPH + FLW and kitchen needed
  if (normalizedEventType === "sooraj_pooja" && foodRequired) {
    return {
      ...baseRule,
      preferredAreas: ["SPH", "FLW"],
      areaSelectionMode: "all_required",
      requiresKitchen: true,
    }
  }

  return {
    ...baseRule,
    requiresKitchen: baseRule.requiresKitchen || foodRequired,
  }
}

function collectOccupiedAreas(activeBookings: BookingForAvailability[]): Set<string> {
  const occupiedAreas = new Set<string>()

  for (const booking of activeBookings) {
    const areas = booking.allocatedArea ?? booking.requestedArea
    for (const area of areas) {
      occupiedAreas.add(area)
    }
  }

  return occupiedAreas
}

function checkKitchenAvailability(
  request: AvailabilityCheckRequest,
  activeBookings: BookingForAvailability[]
): { available: boolean; conflict: ConflictDetail | null } {
  if (!request.foodRequired) {
    return { available: true, conflict: null }
  }

  const kitchenConflicts = activeBookings.filter(
    (booking) => booking.status === "approved" && booking.kitchenRequired
  )

  if (kitchenConflicts.length > 0) {
    return {
      available: false,
      conflict: {
        type: ConflictType.KITCHEN_COORDINATION_NEEDED,
        message:
          "Kitchen is already reserved by another approved booking for this date and slot",
        affectedBookingIds: kitchenConflicts.map((booking) => booking.id),
        kitchenConflict: true,
        severity: "high",
      },
    }
  }

  return { available: true, conflict: null }
}

function evaluateAreaAvailability(
  rule: EventAvailabilityRule,
  occupiedAreas: Set<string>,
  activeBookings: BookingForAvailability[]
): {
  status: AvailabilityStatus
  available: boolean
  conflicts: ConflictDetail[]
  suggestedAreas?: string[]
  recommendations: string[]
} {
  const preferredAreas = rule.preferredAreas
  const alternateAreas = rule.alternateAreas ?? []
  const blockedPreferred = preferredAreas.filter((area) => occupiedAreas.has(area))

  if (rule.areaSelectionMode === "all_required") {
    if (blockedPreferred.length === 0) {
      return {
        status: AvailabilityStatus.AVAILABLE,
        available: true,
        conflicts: [],
        suggestedAreas: preferredAreas,
        recommendations: [`Preferred areas available: ${preferredAreas.join(", ")}`],
      }
    }

    return {
      status: AvailabilityStatus.CONFLICT_REVIEW_REQUIRED,
      available: false,
      conflicts: [
        {
          type: ConflictType.AREA_OCCUPIED,
          message: `Required area(s) occupied: ${blockedPreferred.join(", ")}`,
          affectedAreas: blockedPreferred,
          affectedBookingIds: activeBookings.map((booking) => booking.id),
          severity: "high",
        },
      ],
      recommendations: [
        `Required area set cannot be allocated (${preferredAreas.join(", ")})`,
      ],
    }
  }

  const availablePreferred = preferredAreas.filter((area) => !occupiedAreas.has(area))
  if (availablePreferred.length > 0) {
    return {
      status: AvailabilityStatus.AVAILABLE,
      available: true,
      conflicts: [],
      suggestedAreas: availablePreferred,
      recommendations: [`Preferred/primary area available: ${availablePreferred[0]}`],
    }
  }

  const availableAlternates = alternateAreas.filter((area) => !occupiedAreas.has(area))
  if (availableAlternates.length > 0) {
    return {
      status: AvailabilityStatus.PARTIALLY_AVAILABLE,
      available: false,
      conflicts: [
        {
          type: ConflictType.PARTIAL_AREA_CONFLICT,
          message: `Preferred area occupied: ${preferredAreas.join(", ")}`,
          affectedAreas: preferredAreas,
          affectedBookingIds: activeBookings.map((booking) => booking.id),
          severity: "medium",
        },
      ],
      suggestedAreas: availableAlternates,
      recommendations: [`Use alternate area(s): ${availableAlternates.join(", ")}`],
    }
  }

  return {
    status: AvailabilityStatus.FULLY_OCCUPIED,
    available: false,
    conflicts: [
      {
        type: ConflictType.AREA_OCCUPIED,
        message: "No suitable area available for this date and slot",
        affectedAreas: [...preferredAreas, ...alternateAreas],
        affectedBookingIds: activeBookings.map((booking) => booking.id),
        severity: "high",
      },
    ],
    recommendations: ["All eligible areas are occupied"],
  }
}

function findAlternativeTimeSlots(
  request: AvailabilityCheckRequest
): string[] {
  const allSlots = ["MORNING", "AFTERNOON", "EVENING", "FULL_DAY"]
  const requestedSlot = normalizeTimeSlot(request.timeSlot)

  return allSlots.filter((slot) => {
    if (slot === requestedSlot) {
      return false
    }

    const activeBookings = getActiveBookingsForDateTime(
      request.existingBookings,
      request.date,
      slot
    )

    if (request.foodRequired) {
      const kitchenConflict = activeBookings.some(
        (booking) => booking.status === "approved" && booking.kitchenRequired
      )
      if (kitchenConflict) {
        return false
      }
    }

    return activeBookings.length === 0
  })
}

/**
 * Main availability check function.
 */
export function checkAvailability(request: AvailabilityCheckRequest): AvailabilityCheckResult {
  const normalizedRequest: AvailabilityCheckRequest = {
    ...request,
    eventType: normalizeEventType(request.eventType),
    timeSlot: normalizeTimeSlot(request.timeSlot),
    date: normalizeDate(request.date),
  }

  const eventRule = resolveEventRule(
    normalizedRequest.eventType,
    normalizedRequest.foodRequired
  )
  const activeBookings = getActiveBookingsForDateTime(
    normalizedRequest.existingBookings,
    normalizedRequest.date,
    normalizedRequest.timeSlot
  )

  const kitchenCheck = checkKitchenAvailability(normalizedRequest, activeBookings)
  if (!kitchenCheck.available && kitchenCheck.conflict) {
    return {
      status: AvailabilityStatus.KITCHEN_COORDINATION_REQUIRED,
      available: false,
      requiresCoordination: true,
      requiresReview: true,
      conflicts: [kitchenCheck.conflict],
      suggestedAreas: undefined,
      alternativeTimeSlots: findAlternativeTimeSlots(normalizedRequest),
      recommendations: [
        "Kitchen coordination is required with the existing approved booking.",
        "Do not auto-approve; review manually.",
      ],
      details: {
        requestedDate: normalizeDate(normalizedRequest.date),
        requestedTimeSlot: normalizedRequest.timeSlot,
        requestedEvent: normalizedRequest.eventType,
        foodRequired: normalizedRequest.foodRequired,
        kitchenNeeded: normalizedRequest.foodRequired,
      },
    }
  }

  if (
    eventRule.maxConcurrentBookings &&
    activeBookings.length >= eventRule.maxConcurrentBookings
  ) {
    return {
      status: AvailabilityStatus.FULLY_OCCUPIED,
      available: false,
      requiresCoordination: false,
      requiresReview: false,
      conflicts: [
        {
          type: ConflictType.MULTIPLE_BOOKINGS_CONFLICT,
          message: `Maximum concurrent bookings reached (${eventRule.maxConcurrentBookings})`,
          affectedBookingIds: activeBookings.map((booking) => booking.id),
          severity: "high",
        },
      ],
      suggestedAreas: undefined,
      alternativeTimeSlots: findAlternativeTimeSlots(normalizedRequest),
      recommendations: ["Try another slot or date"],
      details: {
        requestedDate: normalizeDate(normalizedRequest.date),
        requestedTimeSlot: normalizedRequest.timeSlot,
        requestedEvent: normalizedRequest.eventType,
        foodRequired: normalizedRequest.foodRequired,
        kitchenNeeded: normalizedRequest.foodRequired,
      },
    }
  }

  if (!eventRule.allowMultipleBookings && activeBookings.length > 0) {
    return {
      status: AvailabilityStatus.CONFLICT_REVIEW_REQUIRED,
      available: false,
      requiresCoordination: false,
      requiresReview: true,
      conflicts: [
        {
          type: ConflictType.MULTIPLE_BOOKINGS_CONFLICT,
          message: `${normalizedRequest.eventType} does not allow concurrent bookings`,
          affectedBookingIds: activeBookings.map((booking) => booking.id),
          severity: "high",
        },
      ],
      suggestedAreas: undefined,
      alternativeTimeSlots: findAlternativeTimeSlots(normalizedRequest),
      recommendations: ["Manual review required for concurrent booking"],
      details: {
        requestedDate: normalizeDate(normalizedRequest.date),
        requestedTimeSlot: normalizedRequest.timeSlot,
        requestedEvent: normalizedRequest.eventType,
        foodRequired: normalizedRequest.foodRequired,
        kitchenNeeded: normalizedRequest.foodRequired,
      },
    }
  }

  const occupiedAreas = collectOccupiedAreas(activeBookings)
  const areaAssessment = evaluateAreaAvailability(eventRule, occupiedAreas, activeBookings)
  const recommendations = [...areaAssessment.recommendations]

  // Birthday parties are typically evening slots.
  if (
    normalizedRequest.eventType === "birthday_party" &&
    normalizedRequest.timeSlot !== "EVENING" &&
    areaAssessment.status === AvailabilityStatus.AVAILABLE
  ) {
    return {
      status: AvailabilityStatus.PARTIALLY_AVAILABLE,
      available: false,
      requiresCoordination: false,
      requiresReview: false,
      conflicts: [
        {
          type: ConflictType.TIMING_CONFLICT,
          message: "Birthday Party is typically scheduled in evening slot",
          severity: "low",
        },
      ],
      suggestedAreas: areaAssessment.suggestedAreas,
      alternativeTimeSlots: ["EVENING"],
      recommendations: [
        ...recommendations,
        "Evening slot is recommended for birthday parties.",
      ],
      details: {
        requestedDate: normalizeDate(normalizedRequest.date),
        requestedTimeSlot: normalizedRequest.timeSlot,
        requestedEvent: normalizedRequest.eventType,
        foodRequired: normalizedRequest.foodRequired,
        kitchenNeeded: normalizedRequest.foodRequired,
      },
    }
  }

  return {
    status: areaAssessment.status,
    available: areaAssessment.available,
    requiresCoordination: false,
    requiresReview: areaAssessment.status === AvailabilityStatus.CONFLICT_REVIEW_REQUIRED,
    conflicts: areaAssessment.conflicts,
    suggestedAreas: areaAssessment.suggestedAreas,
    alternativeTimeSlots: findAlternativeTimeSlots(normalizedRequest),
    recommendations,
    details: {
      requestedDate: normalizeDate(normalizedRequest.date),
      requestedTimeSlot: normalizedRequest.timeSlot,
      requestedEvent: normalizedRequest.eventType,
      foodRequired: normalizedRequest.foodRequired,
      kitchenNeeded: normalizedRequest.foodRequired,
    },
  }
}

/**
 * Status-only API requested for external callers.
 */
export function getBookingAvailabilityStatus(
  input: BookingAvailabilityInput,
  existingBookings: BookingForAvailability[]
): AvailabilityStatus {
  return checkAvailability({
    ...input,
    existingBookings,
  }).status
}

/**
 * Get summary of availability for multiple time slots.
 */
export function checkAvailabilityForMultipleSlots(
  eventType: string,
  date: Date | string,
  timeSlots: string[],
  foodRequired: boolean,
  existingBookings: BookingForAvailability[]
): Record<string, AvailabilityStatus> {
  const results: Record<string, AvailabilityStatus> = {}

  for (const slot of timeSlots) {
    const result = checkAvailability({
      eventType,
      date,
      timeSlot: slot,
      foodRequired,
      existingBookings,
    })
    results[normalizeTimeSlot(slot)] = result.status
  }

  return results
}

/**
 * Get recommended available slots for an event on a given date.
 */
export function getRecommendedSlots(
  eventType: string,
  date: Date | string,
  foodRequired: boolean,
  existingBookings: BookingForAvailability[]
): string[] {
  const eventRule = resolveEventRule(eventType, foodRequired)
  const typicalSlots = eventRule.typicalTimeSlots ?? ["MORNING", "AFTERNOON", "EVENING"]

  return typicalSlots.filter((slot) => {
    const result = checkAvailability({
      eventType,
      date,
      timeSlot: slot,
      foodRequired,
      existingBookings,
    })

    return (
      result.status === AvailabilityStatus.AVAILABLE ||
      result.status === AvailabilityStatus.PARTIALLY_AVAILABLE
    )
  })
}

/**
 * Check if a specific area can be used for an event type.
 */
export function canAreaBeUsedForEvent(eventType: string, area: string): boolean {
  const rule = resolveEventRule(eventType, false)
  const allowedAreas = [...rule.preferredAreas, ...(rule.alternateAreas ?? [])]
  return allowedAreas.includes(area)
}

/**
 * Get all possible areas for an event type.
 */
export function getUsableAreas(eventType: string): string[] {
  const rule = resolveEventRule(eventType, false)
  return [...rule.preferredAreas, ...(rule.alternateAreas ?? [])]
}
