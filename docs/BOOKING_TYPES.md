# PBS-44 Society Bhavan Booking System — TypeScript Types Guide

## Overview

This document describes the complete TypeScript type definitions for the PBS-44 Society Bhavan Booking System. All types are defined in [`src/types/booking.ts`](src/types/booking.ts).

---

## Enums

### `MemberType`
Defines the categories of members in the society.

```typescript
enum MemberType {
  OWNER = "owner",           // फ्लैट का मालिक
  TENANT = "tenant",         // किराए पर रहने वाला
  NON_MEMBER = "non_member", // गैर-सदस्य
}
```

**Usage:**
```typescript
const booking: IBooking = {
  memberType: MemberType.OWNER,
  // ... other fields
}
```

---

### `EventType`
Specifies the type of event to be hosted.

```typescript
enum EventType {
  WEDDING,           // विवाह
  ENGAGEMENT,        // सगुन/मेहंदी
  BIRTHDAY,          // जन्मदिन
  ANNIVERSARY,       // वर्षगांठ
  RELIGIOUS_CEREMONY,// धार्मिक अनुष्ठान
  CORPORATE_EVENT,   // कॉर्पोरेट आयोजन
  COMMUNITY_EVENT,   // सामुदायिक आयोजन
  SEMINAR,           // सेमिनार
  OTHER,             // अन्य
}
```

---

### `AreaCode`
Represents the different halls/areas in the society Bhavan.

```typescript
enum AreaCode {
  MAIN_HALL,        // मुख्य हॉल
  DRAWING_ROOM,     // ड्राइंग रूम
  CONFERENCE_ROOM,  // सम्मेलन कक्ष
  TERRACE,          // छत
  GARDEN,           // बगीचा
  KITCHEN_AREA,     // रसोई
  PARKING,          // पार्किंग
}
```

---

### `TimeSlot`
Predefined time slots for booking.

```typescript
enum TimeSlot {
  MORNING,    // 6 AM - 12 PM
  AFTERNOON,  // 12 PM - 6 PM
  EVENING,    // 6 PM - 11 PM
  FULL_DAY,   // 6 AM - 11 PM
}
```

---

### `BookingStatus`
Lifecycle of a booking through the system.

```typescript
enum BookingStatus {
  PENDING,           // प्रतीक्षमान
  APPROVED,          // अनुमोदित
  REJECTED,          // अस्वीकृत
  CONFIRMED,         // पुष्टि की गई
  PAYMENT_PENDING,   // भुगतान लंबित
  PAYMENT_RECEIVED,  // भुगतान प्राप्त
  COMPLETED,         // पूर्ण
  CANCELLED,         // रद्द
}
```

---

### `MemberStatus`
Indicates the status of a member.

```typescript
enum MemberStatus {
  ACTIVE,     // सक्रिय
  INACTIVE,   // निष्क्रिय
  SUSPENDED,  // निलंबित
  RESIGNED,   // त्यागपत्र
}
```

---

### `CommitteeRole`
Roles within the society management committee.

```typescript
enum CommitteeRole {
  PRESIDENT,       // अध्यक्ष
  VICE_PRESIDENT,  // उपाध्यक्ष
  SECRETARY,       // सचिव
  TREASURER,       // कोषाध्यक्ष
  MEMBER,          // सदस्य
}
```

---

## Core Interfaces

### `IMember`
Represents a member of the society.

```typescript
interface IMember {
  id: string
  memberId: string           // Unique ID like "M-001"
  name: string
  memberType: MemberType
  status: MemberStatus
  email: string
  mobile: string
  flatNo: string             // Flat number
  block?: string
  address?: string
  joinDate: Date
  idProof?: string           // Type of ID proof
  idProofNumber?: string
  isVerified: boolean
  createdAt: Date
  updatedAt: Date
}
```

---

### `IBooking`
**Core entity** — Contains all booking information.

```typescript
interface IBooking {
  // Identifiers
  id: string
  bookingId: string               // e.g., "BOOK-2026-001"

  // Applicant information
  applicantName: string
  memberId?: string
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
  requestedArea: AreaCode[]       // Multiple areas can be requested
  allocatedArea?: AreaCode[]      // Areas actually allocated

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
  approvedBy?: string
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
```

**Key Fields:**
- `bookingId`: Unique identifier (e.g., "BOOK-2026-001")
- `requestedArea`: Array of areas requested by applicant
- `allocatedArea`: Array of areas approved by committee
- `status`: Tracks booking through its lifecycle
- `foodRequired` / `kitchenRequired`: Facility requirements

---

### `IArea`
Details of a hall/area in the Bhavan.

```typescript
interface IArea {
  id: string
  areaCode: AreaCode
  name: string
  capacity: number             // Max guests
  isActive: boolean
  description?: string
  amenities?: string[]         // e.g., ["AC", "Projector", "Sound System"]
  images?: string[]
}
```

---

### `ICharge`
Pricing rules for different combinations of event, area, and time.

```typescript
interface ICharge {
  id: string
  chargeId: string
  eventType: EventType
  area: AreaCode
  timeSlot: TimeSlot
  baseAmount: number                  // ₹
  memberDiscount?: number             // 0-100 (percentage)
  kitchenChargeIfUsed?: number
  extraHourCharge?: number
  guestParkingChargePerVehicle?: number
  foodHandlingCharge?: number
  effectiveFrom: Date
  effectiveTo?: Date                  // NULL = ongoing
  notes?: string
}
```

---

### `ICommitteeMember`
Member of the society management committee.

```typescript
interface ICommitteeMember {
  id: string
  memberId: string             // FK to IMember
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
```

---

### `IPayment`
Record of payment for a booking.

```typescript
interface IPayment {
  id: string
  paymentId: string            // e.g., "PAY-2026-001"
  bookingId: string
  amount: number               // ₹
  paymentMethod: "cash" | "check" | "online" | "bank_transfer"
  paymentDate: Date
  receiptNo: string
  notes?: string
  createdAt: Date
  createdBy: string            // Who processed the payment
}
```

---

## Request/Response Interfaces

### `IBookingRequest`
Payload for creating a new booking.

```typescript
interface IBookingRequest {
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
```

---

### `IBookingApproval`
Payload for approving/rejecting a booking.

```typescript
interface IBookingApproval {
  bookingId: string
  action: "approve" | "reject"
  allocatedArea?: AreaCode[]
  approvedBy: string           // Committee member ID
  remarks?: string
  estimatedCharge?: number
  discount?: number
  rejectionReason?: string
}
```

---

## Usage Examples

### Creating a New Booking

```typescript
import { IBookingRequest, EventType, AreaCode, TimeSlot, MemberType } from "@/types/booking"

const newBooking: IBookingRequest = {
  applicantName: "राज शर्मा",
  mobile: "9876543210",
  email: "raj@example.com",
  memberId: "M-001",
  memberType: MemberType.OWNER,
  eventType: EventType.WEDDING,
  eventName: "राज की शादी",
  noOfGuests: 150,
  date: new Date("2026-08-15"),
  timeSlot: TimeSlot.FULL_DAY,
  requestedArea: [AreaCode.MAIN_HALL, AreaCode.GARDEN],
  foodRequired: true,
  kitchenRequired: true,
  decorationRequired: true,
  parkingRequired: true,
  remarks: "कृपया डेकोरेशन के लिए अतिरिक्त स्थान दें।",
}
```

### Processing Approval

```typescript
import { IBookingApproval, AreaCode } from "@/types/booking"

const approval: IBookingApproval = {
  bookingId: "BOOK-2026-001",
  action: "approve",
  allocatedArea: [AreaCode.MAIN_HALL, AreaCode.GARDEN],
  approvedBy: "C-001", // Committee member ID
  remarks: "अनुमोदित है।",
  estimatedCharge: 15000,
  discount: 500, // Member discount
}
```

### Checking Booking Status

```typescript
import { IBooking, BookingStatus } from "@/types/booking"

function isBookingConfirmed(booking: IBooking): boolean {
  return booking.status === BookingStatus.CONFIRMED &&
         booking.paymentStatus === BookingStatus.PAYMENT_RECEIVED
}
```

---

## File Location

All types are exported from: **`src/types/booking.ts`**

Central export point: **`src/types/booking.index.ts`**

---

## Integration Notes

- **Database**: Map these interfaces to your ORM (Prisma, TypeORM, etc.)
- **API**: Use `IBookingRequest` and `IBookingApproval` for request validation
- **Localization**: Use the `*Label` enums for UI translations
- **Validation**: Implement schema validation using Zod or Yup before persisting
- **Status Flow**: Respect the `BookingStatus` enum when updating bookings

---

## Future Enhancements

- [ ] Add role-based access control (RBAC) permissions
- [ ] Add document upload fields (proposals, ID copies)
- [ ] Add multi-language support for descriptions
- [ ] Add recurring/annual booking support
- [ ] Add guest list management
- [ ] Add vendor/catering partner integration
