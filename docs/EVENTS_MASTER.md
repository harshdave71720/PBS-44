# PBS-44 Events Master Configuration

## Overview

The Events Master is a centralized JSON configuration file that defines all events available for booking at PBS-44 Society Bhavan. It provides pricing, allowed areas, time slots, and approval requirements for each event type.

**File Location:** `src/data/events-master.json`  
**Utility Module:** `src/lib/events-master.ts`

---

## Event Structure

Each event in the master configuration has the following properties:

```json
{
  "id": "EVENT_001",
  "code": "sooraj_pooja",
  "nameHindi": "सूरज पूजा",
  "nameEnglish": "Sooraj Pooja",
  "description": "भगवान सूरज को समर्पित पूजा",
  "memberCharge": 500,
  "nonMemberCharge": 1000,
  "allowedAreas": ["TERRACE", "GARDEN"],
  "allowedTimeSlots": ["MORNING"],
  "defaultArea": "TERRACE",
  "requiresApproval": false,
  "estimatedDuration": "1-2 hours",
  "notes": "सुबह के समय आयोजित होता है"
}
```

### Property Details

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique event identifier (e.g., "EVENT_001") |
| `code` | string | Machine-readable code (e.g., "sooraj_pooja") - used for lookups |
| `nameHindi` | string | Event name in Hindi (हिंदी) |
| `nameEnglish` | string | Event name in English |
| `description` | string | Event description in Hindi |
| `memberCharge` | number | Booking charge for society members (₹) |
| `nonMemberCharge` | number | Booking charge for non-members (₹) |
| `allowedAreas` | string[] | Array of area codes where this event can be held |
| `allowedTimeSlots` | string[] | Array of time slots available for this event |
| `defaultArea` | string | Suggested/default area for this event |
| `requiresApproval` | boolean | Whether committee approval is required before booking |
| `estimatedDuration` | string | Typical duration of the event |
| `notes` | string | Additional notes/instructions |

---

## Available Events

### 1. Sooraj Pooja (सूरज पूजा)
- **Code:** `sooraj_pooja`
- **Type:** Religious ceremony
- **Member Charge:** ₹500 | **Non-Member:** ₹1,000
- **Allowed Areas:** TERRACE, GARDEN
- **Time Slots:** MORNING
- **Requires Approval:** No
- **Duration:** 1-2 hours
- **Description:** Sun worship ceremony, typically held in early morning

### 2. Uttara Kary (उत्तर कार्य)
- **Code:** `uttara_kary`
- **Type:** Religious ceremony (post-cremation ritual)
- **Member Charge:** ₹1,500 | **Non-Member:** ₹3,000
- **Allowed Areas:** MAIN_HALL, DRAWING_ROOM, KITCHEN_AREA
- **Time Slots:** MORNING, AFTERNOON
- **Requires Approval:** Yes ✓
- **Duration:** 2-4 hours
- **Description:** Traditional ritual performed after cremation

### 3. Barsi (बरसी)
- **Code:** `barsi`
- **Type:** Memorial ceremony
- **Member Charge:** ₹800 | **Non-Member:** ₹1,500
- **Allowed Areas:** MAIN_HALL, DRAWING_ROOM, CONFERENCE_ROOM, KITCHEN_AREA
- **Time Slots:** MORNING, AFTERNOON
- **Requires Approval:** Yes ✓
- **Duration:** 2-3 hours
- **Description:** Death anniversary ceremony

### 4. Shraddha Paksh (श्राद्ध पक्ष)
- **Code:** `shraddha_paksh`
- **Type:** Religious observance
- **Member Charge:** ₹1,200 | **Non-Member:** ₹2,500
- **Allowed Areas:** MAIN_HALL, DRAWING_ROOM, KITCHEN_AREA
- **Time Slots:** MORNING, AFTERNOON
- **Requires Approval:** Yes ✓
- **Duration:** 2-3 hours
- **Description:** Ancestor propitiation period (typically September-October)

### 5. Marriage (विवाह)
- **Code:** `marriage`
- **Type:** Social celebration
- **Member Charge:** ₹5,000 | **Non-Member:** ₹10,000
- **Allowed Areas:** MAIN_HALL, GARDEN, TERRACE, KITCHEN_AREA, PARKING
- **Time Slots:** AFTERNOON, EVENING, FULL_DAY
- **Requires Approval:** Yes ✓
- **Duration:** 4-8 hours
- **Description:** Wedding ceremony and reception with full venue access

### 6. Birthday Party (जन्मदिन पार्टी)
- **Code:** `birthday_party`
- **Type:** Social celebration
- **Member Charge:** ₹1,500 | **Non-Member:** ₹3,000
- **Allowed Areas:** MAIN_HALL, DRAWING_ROOM, GARDEN, KITCHEN_AREA
- **Time Slots:** AFTERNOON, EVENING
- **Requires Approval:** No
- **Duration:** 2-4 hours
- **Description:** Birthday celebration

### 7. Mahila Sangeet (महिला संगीत)
- **Code:** `mahila_sangeet`
- **Type:** Cultural program
- **Member Charge:** ₹1,000 | **Non-Member:** ₹2,000
- **Allowed Areas:** MAIN_HALL, DRAWING_ROOM, GARDEN, KITCHEN_AREA
- **Time Slots:** AFTERNOON, EVENING
- **Requires Approval:** No
- **Duration:** 2-3 hours
- **Description:** Women's cultural program (typically pre-wedding)

### 8. Other (अन्य)
- **Code:** `other`
- **Type:** General events
- **Member Charge:** ₹2,000 | **Non-Member:** ₹4,000
- **Allowed Areas:** MAIN_HALL, DRAWING_ROOM, CONFERENCE_ROOM, GARDEN, KITCHEN_AREA
- **Time Slots:** MORNING, AFTERNOON, EVENING, FULL_DAY
- **Requires Approval:** Yes ✓
- **Duration:** Variable
- **Description:** Other social/cultural events

---

## Utility Functions

The `src/lib/events-master.ts` module provides typed functions for working with events:

### Basic Retrieval

```typescript
import { getAllEvents, getEventByCode, getEventById } from "@/lib/events-master"

// Get all events
const allEvents = getAllEvents()

// Get event by code
const marriage = getEventByCode("marriage")

// Get event by ID
const event = getEventById("EVENT_005")
```

### Charge Calculation

```typescript
import { getEventCharge, calculateEventCharge } from "@/lib/events-master"

// Get base charge for a member
const charge = getEventCharge("birthday_party", true) // 1500

// Calculate with discount
const discountedCharge = calculateEventCharge("marriage", true, 10) // 10% discount
// Result: 5000 - (5000 * 10%) = 4500
```

### Area & Time Slot Validation

```typescript
import {
  isAreaAllowedForEvent,
  isTimeSlotAllowedForEvent,
  getAllowedAreasForEvent,
  getAllowedTimeSlotsForEvent,
} from "@/lib/events-master"

// Check if area is allowed
const canBook = isAreaAllowedForEvent("marriage", "MAIN_HALL") // true

// Get all allowed areas for an event
const areas = getAllowedAreasForEvent("marriage")
// ["MAIN_HALL", "GARDEN", "TERRACE", "KITCHEN_AREA", "PARKING"]

// Get all allowed time slots
const slots = getAllowedTimeSlotsForEvent("birthday_party")
// ["AFTERNOON", "EVENING"]
```

### Event Filtering

```typescript
import {
  getEventsRequiringApproval,
  getEventsNotRequiringApproval,
} from "@/lib/events-master"

// Get events that need committee approval
const requireApproval = getEventsRequiringApproval()
// [Uttara Kary, Barsi, Shraddha Paksh, Marriage, Other]

// Get events auto-approved
const autoApproved = getEventsNotRequiringApproval()
// [Sooraj Pooja, Birthday Party, Mahila Sangeet]
```

### Information Retrieval

```typescript
import { getEventName, getEventPricing, getEventSummary } from "@/lib/events-master"

// Get event name in specific language
const nameHi = getEventName("sooraj_pooja", "hi") // "सूरज पूजा"
const nameEn = getEventName("sooraj_pooja", "en") // "Sooraj Pooja"

// Get pricing information
const pricing = getEventPricing("marriage")
// { memberCharge: 5000, nonMemberCharge: 10000, markup: 100 }

// Get event summary
const summary = getEventSummary("birthday_party")
```

### Global Statistics

```typescript
import { getAllUniqueAreas, getAllUniqueTimeSlots } from "@/lib/events-master"

// Get all areas used across all events
const areas = getAllUniqueAreas()
// ["CONFERENCE_ROOM", "DRAWING_ROOM", "GARDEN", "KITCHEN_AREA", "MAIN_HALL", "PARKING", "TERRACE"]

// Get all time slots used
const slots = getAllUniqueTimeSlots()
// ["AFTERNOON", "EVENING", "FULL_DAY", "MORNING"]
```

---

## Usage Examples

### Example 1: Build Event Selection Dropdown

```typescript
import { getAllEvents, getEventName } from "@/lib/events-master"

function EventSelector() {
  const events = getAllEvents()

  return (
    <select name="eventType">
      {events.map((event) => (
        <option key={event.id} value={event.code}>
          {getEventName(event.code, "en")}
        </option>
      ))}
    </select>
  )
}
```

### Example 2: Show Charges Based on Member Type

```typescript
import { getEventCharge, getEventName } from "@/lib/events-master"

function EventPricing({ eventCode, isMember }) {
  const charge = getEventCharge(eventCode, isMember)
  const name = getEventName(eventCode, "en")

  return (
    <div>
      <h3>{name}</h3>
      <p>
        {isMember ? "Member Price" : "Non-Member Price"}: ₹{charge}
      </p>
    </div>
  )
}
```

### Example 3: Validate Booking Request

```typescript
import {
  isAreaAllowedForEvent,
  isTimeSlotAllowedForEvent,
} from "@/lib/events-master"

function validateBooking(
  eventCode: string,
  area: string,
  timeSlot: string
): { valid: boolean; error?: string } {
  if (!isAreaAllowedForEvent(eventCode, area)) {
    return { valid: false, error: `${area} not allowed for this event` }
  }

  if (!isTimeSlotAllowedForEvent(eventCode, timeSlot)) {
    return { valid: false, error: `${timeSlot} not available for this event` }
  }

  return { valid: true }
}
```

### Example 4: Filter Events by Approval Status

```typescript
import { getEventsRequiringApproval } from "@/lib/events-master"

function BookingWorkflow(eventCode: string) {
  const requiresApproval = getEventsRequiringApproval().some(
    (e) => e.code === eventCode
  )

  if (requiresApproval) {
    // Redirect to approval workflow
    return showApprovalForm()
  } else {
    // Auto-confirm booking
    return confirmBookingImmediately()
  }
}
```

---

## Adding New Events

To add a new event, update `src/data/events-master.json`:

1. Add a new entry to the `events` array
2. Ensure `id` is unique (increment from existing)
3. Create a descriptive `code` (lowercase with underscores)
4. Provide both Hindi and English names
5. Set appropriate charges for members and non-members
6. Define allowed areas and time slots
7. Set `requiresApproval` based on event type
8. Update `metadata.lastUpdated`

Example:

```json
{
  "id": "EVENT_009",
  "code": "retirement_party",
  "nameHindi": "सेवानिवृत्ति समारोह",
  "nameEnglish": "Retirement Party",
  "description": "सेवानिवृत्ति पार्टी",
  "memberCharge": 2500,
  "nonMemberCharge": 5000,
  "allowedAreas": ["MAIN_HALL", "GARDEN"],
  "allowedTimeSlots": ["AFTERNOON", "EVENING"],
  "defaultArea": "MAIN_HALL",
  "requiresApproval": false,
  "estimatedDuration": "2-4 hours",
  "notes": "Professional celebration event"
}
```

---

## Pricing Strategy

| Event Category | Member Markup | Use Cases |
|---|---|---|
| **Religious** | 2x | Sooraj Pooja (500→1000), Uttara Kary (1500→3000) |
| **Memorial** | 2x | Barsi (800→1500), Shraddha Paksh (1200→2500) |
| **Social** | 2x | Birthday Party (1500→3000), Mahila Sangeet (1000→2000) |
| **Premium** | 2x | Marriage (5000→10000) |
| **General** | 2x | Other (2000→4000) |

All events follow a **2x markup** for non-members, reflecting the cost of venue and resources.

---

## Best Practices

1. **Always validate** area and time slot combinations against the event master before accepting bookings
2. **Use `requiresApproval`** flag to determine booking workflow (auto-confirm vs. approval queue)
3. **Display event names** in user's preferred language (Hindi/English) based on locale
4. **Apply discounts** transparently: always show original and discounted charges
5. **Cache event data** if displaying frequently to avoid repeated file reads
6. **Update metadata.lastUpdated** whenever you modify the configuration

---

## Related Files

- **Event Types:** See [src/types/booking.ts](src/types/booking.ts) for `IBooking`, `EventType` enum, and related interfaces
- **Booking Form:** Will use events master to populate dropdowns and validate selections
- **Admin Dashboard:** Can edit prices and availability directly in events-master.json
- **Reports:** Can generate revenue reports by event type using charge information
