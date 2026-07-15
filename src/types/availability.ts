/**
 * Booking Availability Types and Enums
 */

/**
 * Availability status indicating whether a booking can be accepted
 */
export enum AvailabilityStatus {
  AVAILABLE = "AVAILABLE",
  PARTIALLY_AVAILABLE = "PARTIALLY_AVAILABLE",
  KITCHEN_COORDINATION_REQUIRED = "KITCHEN_COORDINATION_REQUIRED",
  CONFLICT_REVIEW_REQUIRED = "CONFLICT_REVIEW_REQUIRED",
  FULLY_OCCUPIED = "FULLY_OCCUPIED",
}

/**
 * Conflict type when availability issues are found
 */
export enum ConflictType {
  AREA_OCCUPIED = "AREA_OCCUPIED",
  KITCHEN_OCCUPIED = "KITCHEN_OCCUPIED",
  PARTIAL_AREA_CONFLICT = "PARTIAL_AREA_CONFLICT",
  KITCHEN_COORDINATION_NEEDED = "KITCHEN_COORDINATION_NEEDED",
  MULTIPLE_BOOKINGS_CONFLICT = "MULTIPLE_BOOKINGS_CONFLICT",
  TIMING_CONFLICT = "TIMING_CONFLICT",
  UNKNOWN = "UNKNOWN",
}

/**
 * Details about a conflict found during availability check
 */
export interface ConflictDetail {
  type: ConflictType
  message: string
  affectedAreas?: string[]
  affectedBookingIds?: string[]
  kitchenConflict?: boolean
  severity: "low" | "medium" | "high"
}

/**
 * Result of availability check
 */
export interface AvailabilityCheckResult {
  status: AvailabilityStatus
  available: boolean
  requiresCoordination: boolean
  requiresReview: boolean
  conflicts: ConflictDetail[]
  suggestedAreas?: string[]
  alternativeTimeSlots?: string[]
  recommendations?: string[]
  details: {
    requestedDate: Date
    requestedTimeSlot: string
    requestedEvent: string
    foodRequired: boolean
    kitchenNeeded: boolean
  }
}

/**
 * Booking information for availability check
 */
export interface BookingForAvailability {
  id: string
  eventType: string
  date: Date | string
  timeSlot: string
  requestedArea: string[]
  allocatedArea?: string[]
  foodRequired: boolean
  kitchenRequired: boolean
  status: "approved" | "confirmed" | "pending" | "rejected" | "cancelled"
}

/**
 * Request for availability check
 */
export interface AvailabilityCheckRequest {
  eventType: string
  date: Date | string
  timeSlot: string
  foodRequired: boolean
  existingBookings: BookingForAvailability[]
}

/**
 * Event configuration for availability rules
 */
export interface EventAvailabilityRule {
  eventType: string
  preferredAreas: string[]
  alternateAreas?: string[]
  areaSelectionMode?: "all_required" | "one_of"
  requiresKitchen?: boolean
  allowMultipleBookings?: boolean
  typicalTimeSlots?: string[]
  maxConcurrentBookings?: number
}

/**
 * Minimal input payload for status-only availability checks.
 */
export interface BookingAvailabilityInput {
  eventType: string
  date: Date | string
  timeSlot: string
  foodRequired: boolean
}

/**
 * Time slot compatibility
 */
export enum TimeSlotCompatibility {
  EXCLUSIVE = "EXCLUSIVE", // No other bookings allowed
  SHAREABLE = "SHAREABLE", // Multiple events can share
  COORDINATED = "COORDINATED", // Requires special coordination
}
