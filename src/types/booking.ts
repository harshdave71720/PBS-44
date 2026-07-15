/**
 * PBS-44 Society Bhavan Booking System
 * TypeScript types and interfaces for the booking management system
 */

// ─────────────────────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Member types in the society
 */
export enum MemberType {
  OWNER = "owner",
  TENANT = "tenant",
  NON_MEMBER = "non_member",
}

export const MemberTypeLabel: Record<MemberType, string> = {
  [MemberType.OWNER]: "मालिक",
  [MemberType.TENANT]: "किरायेदार",
  [MemberType.NON_MEMBER]: "गैर-सदस्य",
}

/**
 * Types of events that can be booked
 */
export enum EventType {
  WEDDING = "wedding",
  ENGAGEMENT = "engagement",
  BIRTHDAY = "birthday",
  ANNIVERSARY = "anniversary",
  RELIGIOUS_CEREMONY = "religious_ceremony",
  CORPORATE_EVENT = "corporate_event",
  COMMUNITY_EVENT = "community_event",
  SEMINAR = "seminar",
  OTHER = "other",
}

export const EventTypeLabel: Record<EventType, string> = {
  [EventType.WEDDING]: "विवाह",
  [EventType.ENGAGEMENT]: "सगुन/मेहंदी",
  [EventType.BIRTHDAY]: "जन्मदिन",
  [EventType.ANNIVERSARY]: "वर्षगांठ",
  [EventType.RELIGIOUS_CEREMONY]: "धार्मिक अनुष्ठान",
  [EventType.CORPORATE_EVENT]: "कॉर्पोरेट आयोजन",
  [EventType.COMMUNITY_EVENT]: "सामुदायिक आयोजन",
  [EventType.SEMINAR]: "सेमिनार",
  [EventType.OTHER]: "अन्य",
}

/**
 * Hall/Area codes in the society
 */
export enum AreaCode {
  MAIN_HALL = "main_hall",
  DRAWING_ROOM = "drawing_room",
  CONFERENCE_ROOM = "conf_room",
  TERRACE = "terrace",
  GARDEN = "garden",
  KITCHEN_AREA = "kitchen",
  PARKING = "parking",
}

export const AreaCodeLabel: Record<AreaCode, string> = {
  [AreaCode.MAIN_HALL]: "मुख्य हॉल",
  [AreaCode.DRAWING_ROOM]: "ड्राइंग रूम",
  [AreaCode.CONFERENCE_ROOM]: "सम्मेलन कक्ष",
  [AreaCode.TERRACE]: "छत",
  [AreaCode.GARDEN]: "बगीचा",
  [AreaCode.KITCHEN_AREA]: "रसोई",
  [AreaCode.PARKING]: "पार्किंग",
}

/**
 * Available time slots for bookings
 */
export enum TimeSlot {
  MORNING = "morning",         // 6 AM - 12 PM
  AFTERNOON = "afternoon",     // 12 PM - 6 PM
  EVENING = "evening",         // 6 PM - 11 PM
  FULL_DAY = "full_day",       // 6 AM - 11 PM
}

export const TimeSlotLabel: Record<TimeSlot, string> = {
  [TimeSlot.MORNING]: "सुबह (6 AM - 12 PM)",
  [TimeSlot.AFTERNOON]: "दोपहर (12 PM - 6 PM)",
  [TimeSlot.EVENING]: "शाम (6 PM - 11 PM)",
  [TimeSlot.FULL_DAY]: "पूरे दिन (6 AM - 11 PM)",
}

/**
 * Booking status lifecycle
 */
export enum BookingStatus {
  PENDING = "pending",           // Initial request
  APPROVED = "approved",         // Approved by committee
  REJECTED = "rejected",         // Rejected by committee
  CONFIRMED = "confirmed",       // Booking confirmed
  PAYMENT_PENDING = "payment_pending",
  PAYMENT_RECEIVED = "payment_received",
  COMPLETED = "completed",       // Event completed
  CANCELLED = "cancelled",       // Booking cancelled
}

export const BookingStatusLabel: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: "प्रतीक्षमान",
  [BookingStatus.APPROVED]: "अनुमोदित",
  [BookingStatus.REJECTED]: "अस्वीकृत",
  [BookingStatus.CONFIRMED]: "पुष्टि की गई",
  [BookingStatus.PAYMENT_PENDING]: "भुगतान लंबित",
  [BookingStatus.PAYMENT_RECEIVED]: "भुगतान प्राप्त",
  [BookingStatus.COMPLETED]: "पूर्ण",
  [BookingStatus.CANCELLED]: "रद्द",
}

/**
 * Member status in the society
 */
export enum MemberStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  SUSPENDED = "suspended",
  RESIGNED = "resigned",
}

/**
 * Committee member roles
 */
export enum CommitteeRole {
  PRESIDENT = "president",
  VICE_PRESIDENT = "vice_president",
  SECRETARY = "secretary",
  TREASURER = "treasurer",
  MEMBER = "member",
}

export const CommitteeRoleLabel: Record<CommitteeRole, string> = {
  [CommitteeRole.PRESIDENT]: "अध्यक्ष",
  [CommitteeRole.VICE_PRESIDENT]: "उपाध्यक्ष",
  [CommitteeRole.SECRETARY]: "सचिव",
  [CommitteeRole.TREASURER]: "कोषाध्यक्ष",
  [CommitteeRole.MEMBER]: "सदस्य",
}

// ─────────────────────────────────────────────────────────────────────────────
// INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Time slot details
 */
export interface ITimeSlot {
  id: string
  slot: TimeSlot
  startTime: string // HH:MM format
  endTime: string   // HH:MM format
  active: boolean
}

/**
 * Area/Hall details
 */
export interface IArea {
  id: string
  areaCode: AreaCode
  name: string
  capacity: number
  isActive: boolean
  description?: string
  amenities?: string[]
  images?: string[]
}

/**
 * Event type configuration
 */
export interface IEventType {
  id: string
  type: EventType
  name: string
  defaultDuration: number // in hours
  baseCharge: number      // in rupees
  description?: string
}

/**
 * Charge/Rate configuration
 */
export interface ICharge {
  id: string
  chargeId: string
  eventType: EventType
  area: AreaCode
  timeSlot: TimeSlot
  baseAmount: number              // in rupees
  memberDiscount?: number         // percentage (0-100)
  kitchenChargeIfUsed?: number
  extraHourCharge?: number
  guestParkingChargePerVehicle?: number
  foodHandlingCharge?: number
  effectiveFrom: Date
  effectiveTo?: Date
  notes?: string
}

/**
 * Member of the society
 */
export interface IMember {
  id: string
  memberId: string
  name: string
  memberType: MemberType
  status: MemberStatus
  email: string
  mobile: string
  flatNo: string
  block?: string
  address?: string
  joinDate: Date
  idProof?: string
  idProofNumber?: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Committee member details
 */
export interface ICommitteeMember {
  id: string
  memberId: string // Foreign key to IMember
  role: CommitteeRole
  name: string
  designation: string
  email: string
  mobile: string
  joinDate: Date
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

/**
 * Bhavan booking
 */
export interface IBooking {
  // Identifiers
  id: string
  bookingId: string // e.g., "BOOK-2026-001"

  // Applicant information
  applicantName: string
  memberId?: string // Foreign key to IMember
  mobile: string
  email?: string
  memberType: MemberType

  // Event details
  eventType: EventType
  eventName?: string
  noOfGuests?: number

  // Booking specifics
  date: Date
  timeSlot: TimeSlot
  requestedArea: AreaCode[]        // Multiple areas can be requested
  allocatedArea?: AreaCode[]       // Areas actually allocated
  
  // Facilities
  foodRequired: boolean
  kitchenRequired: boolean
  decorationRequired?: boolean
  parkingRequired?: boolean
  
  // Financial
  estimatedCharge?: number
  discount?: number
  totalCharge?: number
  paymentStatus?: BookingStatus
  paymentDate?: Date
  paymentMethod?: "cash" | "check" | "online" | "bank_transfer"
  receiptNo?: string

  // Status & Tracking
  status: BookingStatus
  approvedBy?: string             // Committee member who approved
  approvalDate?: Date
  rejectionReason?: string
  remarks?: string
  notes?: string

  // Timeline
  createdAt: Date
  updatedAt: Date
  cancelledAt?: Date
  cancelledBy?: string
  cancellationReason?: string
}

/**
 * System settings and configuration
 */
export interface ISettings {
  id: string
  settingKey: string
  settingValue: string | number | boolean
  description?: string
  category: "bhavan" | "booking" | "charges" | "notifications" | "general"
  isEditable: boolean
  updatedAt: Date
}

/**
 * Settings snapshot for the system
 */
export interface ISystemSettings {
  // Bhavan operating hours
  bhavan_open_time: string         // HH:MM
  bhavan_close_time: string        // HH:MM
  
  // Booking policies
  advance_booking_days: number     // Min days in advance
  max_booking_days: number         // Max days in advance
  booking_cancellation_days: number // Days before event to cancel
  
  // Charges
  member_discount_percentage: number
  food_handling_charge: number
  guest_parking_charge: number
  
  // Notifications
  notify_member_on_approval: boolean
  notify_committee_on_new_booking: boolean
  notify_days_before_event: number
  
  // General
  society_name: string
  society_address: string
  contact_phone: string
  contact_email: string
}

/**
 * Booking request payload (for creating new bookings)
 */
export interface IBookingRequest {
  applicantName: string
  mobile: string
  email?: string
  memberId?: string
  memberType: MemberType
  eventType: EventType
  eventName?: string
  noOfGuests?: number
  date: string | Date
  timeSlot: TimeSlot
  requestedArea: AreaCode[]
  foodRequired: boolean
  kitchenRequired: boolean
  decorationRequired?: boolean
  parkingRequired?: boolean
  remarks?: string
}

/**
 * Booking update payload
 */
export interface IBookingUpdate {
  eventName?: string
  noOfGuests?: number
  date?: Date
  timeSlot?: TimeSlot
  requestedArea?: AreaCode[]
  allocatedArea?: AreaCode[]
  foodRequired?: boolean
  kitchenRequired?: boolean
  decorationRequired?: boolean
  parkingRequired?: boolean
  remarks?: string
  status?: BookingStatus
  approvedBy?: string
  rejectionReason?: string
}

/**
 * Booking approval payload
 */
export interface IBookingApproval {
  bookingId: string
  action: "approve" | "reject"
  allocatedArea?: AreaCode[]
  approvedBy: string
  remarks?: string
  estimatedCharge?: number
  discount?: number
  rejectionReason?: string
}

/**
 * Payment record
 */
export interface IPayment {
  id: string
  paymentId: string
  bookingId: string
  amount: number
  paymentMethod: "cash" | "check" | "online" | "bank_transfer"
  paymentDate: Date
  receiptNo: string
  notes?: string
  createdAt: Date
  createdBy: string
}

/**
 * Audit log entry
 */
export interface IAuditLog {
  id: string
  entityType: "booking" | "member" | "payment" | "settings"
  entityId: string
  action: "create" | "update" | "delete" | "approve" | "reject"
  changedBy: string
  oldValues?: Record<string, unknown>
  newValues?: Record<string, unknown>
  timestamp: Date
  remarks?: string
}

/**
 * Report/Analytics
 */
export interface IBookingReport {
  totalBookings: number
  approvedBookings: number
  rejectedBookings: number
  completedBookings: number
  cancelledBookings: number
  pendingBookings: number
  totalRevenue: number
  bookingsByEventType: Record<EventType, number>
  bookingsByArea: Record<AreaCode, number>
  averageCharge: number
  reportDate: Date
}
