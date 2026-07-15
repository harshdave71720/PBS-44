/**
 * Events Master Configuration Loader
 * Provides typed access to event definitions from events-master.json
 */

import eventsMasterData from "@/data/events-master.json"

export interface EventMasterConfig {
  id: string
  code: string
  nameHindi: string
  nameEnglish: string
  description: string
  memberCharge: number
  nonMemberCharge: number
  allowedAreas: string[]
  allowedTimeSlots: string[]
  defaultArea: string
  requiresApproval: boolean
  estimatedDuration: string
  notes: string
}

export interface EventsMasterData {
  events: EventMasterConfig[]
  metadata: {
    version: string
    lastUpdated: string
    description: string
    currency: string
    notes: string
  }
}

/**
 * Get all events from master configuration
 */
export function getAllEvents(): EventMasterConfig[] {
  return (eventsMasterData as EventsMasterData).events
}

/**
 * Get event by code
 * @param code - Event code (e.g., "sooraj_pooja")
 */
export function getEventByCode(code: string): EventMasterConfig | undefined {
  return getAllEvents().find((event) => event.code === code)
}

/**
 * Get event by ID
 * @param id - Event ID (e.g., "EVENT_001")
 */
export function getEventById(id: string): EventMasterConfig | undefined {
  return getAllEvents().find((event) => event.id === id)
}

/**
 * Get charge for a specific member type
 * @param eventCode - Event code
 * @param isMember - Whether requesting member is a society member
 */
export function getEventCharge(
  eventCode: string,
  isMember: boolean
): number | null {
  const event = getEventByCode(eventCode)
  if (!event) return null

  return isMember ? event.memberCharge : event.nonMemberCharge
}

/**
 * Check if an area is allowed for this event
 * @param eventCode - Event code
 * @param area - Area code to check
 */
export function isAreaAllowedForEvent(
  eventCode: string,
  area: string
): boolean {
  const event = getEventByCode(eventCode)
  return event ? event.allowedAreas.includes(area) : false
}

/**
 * Check if a time slot is allowed for this event
 * @param eventCode - Event code
 * @param timeSlot - Time slot to check
 */
export function isTimeSlotAllowedForEvent(
  eventCode: string,
  timeSlot: string
): boolean {
  const event = getEventByCode(eventCode)
  return event ? event.allowedTimeSlots.includes(timeSlot) : false
}

/**
 * Get allowed areas for an event as labels
 * @param eventCode - Event code
 */
export function getAllowedAreasForEvent(eventCode: string): string[] {
  const event = getEventByCode(eventCode)
  return event ? event.allowedAreas : []
}

/**
 * Get allowed time slots for an event as labels
 * @param eventCode - Event code
 */
export function getAllowedTimeSlotsForEvent(eventCode: string): string[] {
  const event = getEventByCode(eventCode)
  return event ? event.allowedTimeSlots : []
}

/**
 * Get event name in specific language
 * @param eventCode - Event code
 * @param language - "hi" for Hindi, "en" for English
 */
export function getEventName(
  eventCode: string,
  language: "hi" | "en" = "en"
): string | null {
  const event = getEventByCode(eventCode)
  if (!event) return null

  return language === "hi" ? event.nameHindi : event.nameEnglish
}

/**
 * Filter events that require approval
 */
export function getEventsRequiringApproval(): EventMasterConfig[] {
  return getAllEvents().filter((event) => event.requiresApproval)
}

/**
 * Filter events that don't require approval
 */
export function getEventsNotRequiringApproval(): EventMasterConfig[] {
  return getAllEvents().filter((event) => !event.requiresApproval)
}

/**
 * Get all unique areas across all events
 */
export function getAllUniqueAreas(): string[] {
  const areas = new Set<string>()
  getAllEvents().forEach((event) => {
    event.allowedAreas.forEach((area) => areas.add(area))
  })
  return Array.from(areas).sort()
}

/**
 * Get all unique time slots across all events
 */
export function getAllUniqueTimeSlots(): string[] {
  const timeSlots = new Set<string>()
  getAllEvents().forEach((event) => {
    event.allowedTimeSlots.forEach((slot) => timeSlots.add(slot))
  })
  return Array.from(timeSlots).sort()
}

/**
 * Calculate total charge with optional discount
 * @param eventCode - Event code
 * @param isMember - Whether requesting member is a society member
 * @param discountPercent - Optional discount percentage (0-100)
 */
export function calculateEventCharge(
  eventCode: string,
  isMember: boolean,
  discountPercent: number = 0
): number | null {
  const baseCharge = getEventCharge(eventCode, isMember)
  if (baseCharge === null) return null

  const discount = (baseCharge * discountPercent) / 100
  return baseCharge - discount
}

/**
 * Get event configuration summary for a specific event code
 */
export function getEventSummary(
  eventCode: string
): Partial<EventMasterConfig> | null {
  const event = getEventByCode(eventCode)
  if (!event) return null

  return {
    code: event.code,
    nameHindi: event.nameHindi,
    nameEnglish: event.nameEnglish,
    description: event.description,
    memberCharge: event.memberCharge,
    nonMemberCharge: event.nonMemberCharge,
    defaultArea: event.defaultArea,
    requiresApproval: event.requiresApproval,
    estimatedDuration: event.estimatedDuration,
  }
}

/**
 * Get pricing information for an event
 */
export function getEventPricing(
  eventCode: string
): { memberCharge: number; nonMemberCharge: number; markup: number } | null {
  const event = getEventByCode(eventCode)
  if (!event) return null

  const markup = (
    ((event.nonMemberCharge - event.memberCharge) / event.memberCharge) *
    100
  ).toFixed(2)

  return {
    memberCharge: event.memberCharge,
    nonMemberCharge: event.nonMemberCharge,
    markup: parseFloat(markup),
  }
}
