# PBS-44 Booking Availability Engine

## Overview

The Booking Availability Engine is a sophisticated system that determines whether a booking request can be accepted based on existing bookings, event-specific rules, and resource constraints. It implements PBS-44's complex business rules for event scheduling.

**File Locations:**
- **Types:** `src/types/availability.ts`
- **Engine:** `src/lib/availability-engine.ts`
- **Example:** `src/components/examples/AvailabilityCheckExample.tsx`

---

## Availability Status

The engine returns one of five statuses:

### 1. `AVAILABLE` ✓
**Meaning:** The requested time slot and area are fully available for booking.

**When returned:**
- No conflicts with existing approved/confirmed bookings
- All required areas are unoccupied
- Kitchen (if needed) is available
- Event rules are satisfied

**Action:** Booking can be confirmed immediately.

---

### 2. `PARTIALLY_AVAILABLE` ≈
**Meaning:** Primary areas are occupied, but alternative areas can accommodate the event.

**When returned:**
- Event allows multiple bookings (e.g., Shraddha Paksh)
- Primary preferred areas are conflicted
- Alternative areas are available

**Action:** Offer alternative areas to the user. Booking requires area adjustment but can be auto-approved.

**Example:** Sooraj Pooja requests SPH (occupied) → Suggest TERRACE or GARDEN instead

---

### 3. `KITCHEN_COORDINATION_REQUIRED` ⚠️
**Meaning:** Kitchen is already reserved by an approved booking for the same date/time slot.

**When returned:**
- Food is required for this booking
- Another approved booking already has kitchen reservation
- Cannot provide exclusive kitchen access

**Business Rule:** "If another approved booking already owns the kitchen for same date and slot, return KITCHEN_COORDINATION_REQUIRED. Do not auto approve."

**Action:** Requires manual review. Committee must coordinate between bookings or suggest alternative time slots.

---

### 4. `CONFLICT_REVIEW_REQUIRED` ⚠️
**Meaning:** There are conflicts that require manual committee review.

**When returned:**
- Area conflicts that cannot be resolved with alternates
- Event type doesn't allow multiple concurrent bookings
- Partial conflicts that need human judgment
- Multiple booking limits exceeded

**Action:** Booking requires committee approval to proceed.

---

### 5. `FULLY_OCCUPIED` ✗
**Meaning:** All suitable areas are occupied or maximum concurrent bookings reached.

**When returned:**
- No available areas for this time slot
- Maximum concurrent bookings limit reached for event type
- Complete capacity exhaustion

**Action:** Suggest alternative dates/time slots. Current date/time cannot accommodate this booking.

---

## Event-Specific Rules

### Business Rules Implemented

#### 1. Sooraj Pooja (सूरज पूजा)
- **Preferred Area:** SPH (Sooraj Poojan Hall)
- **Alternate Areas:** TERRACE, GARDEN
- **Kitchen:** Not required
- **Multiple Bookings:** Allowed (up to 3 concurrent)
- **Typical Time:** MORNING
- **Rule:** If lunch/food required, SPH + FLW needed

#### 2. Sooraj Pooja + Lunch
- **Preferred Areas:** SPH + FLW
- **Kitchen:** Required
- **Multiple Bookings:** Allowed
- **Rule:** Food requirement adds FLW to area requirements

#### 3. Shraddha Paksh (श्राद्ध पक्ष)
- **Preferred Area:** MAIN_HALL
- **Alternate Areas:** DRAWING_ROOM
- **Kitchen:** Required
- **Multiple Bookings:** **Allowed** (key rule - up to 3 concurrent)
- **Rule:** "Multiple bookings allowed. One booking may use GF. Another booking may use FLW."

#### 4. Birthday Party (जन्मदिन पार्टी)
- **Preferred Areas:** DRAWING_ROOM, MAIN_HALL
- **Alternate Areas:** GARDEN
- **Kitchen:** Not typically required
- **Multiple Bookings:** Allowed (up to 2)
- **Typical Time:** EVENING
- **Rule:** Usually evening slot

#### 5. Marriage (विवाह)
- **Preferred Areas:** MAIN_HALL, GARDEN, TERRACE
- **Kitchen:** Required
- **Multiple Bookings:** **Not allowed** (exclusive booking)
- **Typical Time:** AFTERNOON, EVENING, FULL_DAY
- **Max Concurrent:** 1

#### 6. Other Events
- **Flexible:** Varies by event type
- **Default:** Allows multiple bookings
- **Max:** 2 concurrent bookings

---

## Kitchen Resource Management

### Critical Resource Handling

The kitchen is a **shared critical resource**. Special logic applies:

```typescript
// If food is required AND another approved booking has kitchen:
if (request.foodRequired && existingApprovedBookingHasKitchen) {
  return KITCHEN_COORDINATION_REQUIRED
  // Do NOT auto-approve - requires committee coordination
}
```

### Kitchen Availability Check

1. **Check if food required** for this booking
2. **Scan existing bookings** for the same date/time
3. **Identify approved bookings** with `kitchenRequired: true`
4. **Return status:**
   - No conflict → Allow booking
   - Conflict found → `KITCHEN_COORDINATION_REQUIRED`

---

## Core Functions

### Main Availability Check

```typescript
function checkAvailability(request: AvailabilityCheckRequest): AvailabilityCheckResult
```

**Input:**
```typescript
interface AvailabilityCheckRequest {
  eventType: string                          // e.g., "marriage"
  date: Date                                 // Booking date
  timeSlot: string                          // "MORNING", "AFTERNOON", "EVENING", "FULL_DAY"
  foodRequired: boolean                     // Kitchen needed?
  existingBookings: BookingForAvailability[]// Active bookings to check against
}
```

**Output:**
```typescript
interface AvailabilityCheckResult {
  status: AvailabilityStatus                // Final status
  available: boolean                         // Can book?
  requiresCoordination: boolean              // Kitchen coordination needed?
  requiresReview: boolean                    // Manual review needed?
  conflicts: ConflictDetail[]               // List of conflicts found
  suggestedAreas?: string[]                 // Alternative areas if partial
  alternativeTimeSlots?: string[]           // Other available times
  recommendations?: string[]                // Action items for user
  details: {                                // Request details
    requestedDate: Date
    requestedTimeSlot: string
    requestedEvent: string
    foodRequired: boolean
    kitchenNeeded: boolean
  }
}
```

### Check Multiple Time Slots

```typescript
function checkAvailabilityForMultipleSlots(
  eventType: string,
  date: Date,
  timeSlots: string[],
  foodRequired: boolean,
  existingBookings: BookingForAvailability[]
): Record<string, AvailabilityStatus>
```

Returns availability status for each time slot on a given date.

**Example Result:**
```typescript
{
  "MORNING": "AVAILABLE",
  "AFTERNOON": "FULLY_OCCUPIED",
  "EVENING": "AVAILABLE",
  "FULL_DAY": "CONFLICT_REVIEW_REQUIRED"
}
```

### Get Recommended Slots

```typescript
function getRecommendedSlots(
  eventType: string,
  date: Date,
  foodRequired: boolean,
  existingBookings: BookingForAvailability[]
): string[]
```

Returns array of available time slots that match the event's typical slots.

**Example:** For Birthday Party on July 15:
```typescript
// Returns: ["EVENING"] if other time slots are occupied
```

### Check Area Usability

```typescript
function canAreaBeUsedForEvent(eventType: string, area: string): boolean
function getUsableAreas(eventType: string): string[]
```

Check if a specific area is valid for an event type.

---

## Usage Examples

### Example 1: Simple Availability Check

```typescript
import { checkAvailability } from "@/lib/availability-engine"

const result = checkAvailability({
  eventType: "birthday_party",
  date: new Date(2026, 6, 20), // July 20, 2026
  timeSlot: "EVENING",
  foodRequired: false,
  existingBookings: [], // No existing bookings
})

if (result.available) {
  // Proceed with booking
  console.log("Available! Suggested areas:", result.suggestedAreas)
} else if (result.status === "KITCHEN_COORDINATION_REQUIRED") {
  // Show coordination message
  console.log("Kitchen needs coordination with existing booking")
} else {
  // Show conflicts
  result.conflicts.forEach(c => console.log(c.message))
}
```

### Example 2: Check All Time Slots for a Date

```typescript
import { checkAvailabilityForMultipleSlots } from "@/lib/availability-engine"

const results = checkAvailabilityForMultipleSlots(
  "marriage",
  new Date(2026, 7, 10), // August 10, 2026
  ["MORNING", "AFTERNOON", "EVENING", "FULL_DAY"],
  true, // food required
  existingBookings
)

// Show availability matrix to user
Object.entries(results).forEach(([slot, status]) => {
  console.log(`${slot}: ${status}`)
})
```

### Example 3: Find Available Slots

```typescript
import { getRecommendedSlots } from "@/lib/availability-engine"

const available = getRecommendedSlots(
  "birthday_party",
  new Date(2026, 6, 25),
  false,
  existingBookings
)

// Shows: ["EVENING"] - only evening available for birthday parties
```

### Example 4: Validate Area for Event

```typescript
import { canAreaBeUsedForEvent } from "@/lib/availability-engine"

const valid = canAreaBeUsedForEvent("marriage", "MAIN_HALL") // true
const invalid = canAreaBeUsedForEvent("sooraj_pooja", "MAIN_HALL") // false
```

---

## Time Slot Conflict Logic

### Time Slot Overlaps

```typescript
const timeSlotMap = {
  FULL_DAY: ["MORNING", "AFTERNOON", "EVENING", "FULL_DAY"],
  MORNING:  ["MORNING", "FULL_DAY"],
  AFTERNOON: ["AFTERNOON", "FULL_DAY"],
  EVENING:  ["EVENING", "FULL_DAY"],
}
```

**Conflicts occur when:**
- `FULL_DAY` conflicts with any other time slot
- `MORNING` conflicts with `MORNING` or `FULL_DAY`
- `AFTERNOON` conflicts with `AFTERNOON` or `FULL_DAY`
- `EVENING` conflicts with `EVENING` or `FULL_DAY`

---

## Conflict Detection

### Conflict Types

```typescript
enum ConflictType {
  AREA_OCCUPIED = "AREA_OCCUPIED",               // Area in use
  KITCHEN_OCCUPIED = "KITCHEN_OCCUPIED",         // Kitchen in use
  PARTIAL_AREA_CONFLICT = "PARTIAL_AREA_CONFLICT", // Some areas free
  KITCHEN_COORDINATION_NEEDED = "KITCHEN_COORDINATION_NEEDED",
  MULTIPLE_BOOKINGS_CONFLICT = "MULTIPLE_BOOKINGS_CONFLICT",
  TIMING_CONFLICT = "TIMING_CONFLICT",
  UNKNOWN = "UNKNOWN",
}
```

### Conflict Resolution Strategy

1. **Check Kitchen First** (highest priority)
   - If kitchen needed and occupied → `KITCHEN_COORDINATION_REQUIRED`
   - Do not proceed further

2. **Check Area Conflicts**
   - If no conflicts → `AVAILABLE`
   - If partial conflicts + event allows multiple → `PARTIALLY_AVAILABLE`
   - If all areas occupied → `FULLY_OCCUPIED`

3. **Check Event Rules**
   - Multiple booking limits
   - Event-specific constraints

4. **Return Status** with recommendations

---

## Integration Patterns

### With Booking Form

```typescript
function BookingForm() {
  const [eventType, setEventType] = useState("marriage")
  const [date, setDate] = useState(new Date())
  
  const handleDateChange = (newDate: Date) => {
    const result = checkAvailability({
      eventType,
      date: newDate,
      timeSlot: "EVENING",
      foodRequired: true,
      existingBookings: getAllBookings(),
    })
    
    if (result.available) {
      enableSubmit()
    } else if (result.status === "PARTIALLY_AVAILABLE") {
      showAreaAlternatives(result.suggestedAreas)
    } else {
      showAlternativeDates(result.alternativeTimeSlots)
    }
  }
}
```

### With Admin Dashboard

```typescript
function BookingManagement() {
  const handleNewBookingRequest = (request: BookingRequest) => {
    const availability = checkAvailability({
      eventType: request.event,
      date: request.date,
      timeSlot: request.timeSlot,
      foodRequired: request.hasFood,
      existingBookings: allBookings,
    })
    
    if (availability.requiresReview) {
      routeToApprovalQueue(request)
    } else if (availability.available) {
      autoConfirmBooking(request)
    } else {
      rejectWithRecommendations(request, availability.recommendations)
    }
  }
}
```

### With API Route

```typescript
// POST /api/bookings/check-availability
export async function POST(req: Request) {
  const { eventType, date, timeSlot, foodRequired } = await req.json()
  
  const existingBookings = await getApprovedBookings()
  
  const result = checkAvailability({
    eventType,
    date: new Date(date),
    timeSlot,
    foodRequired,
    existingBookings,
  })
  
  return Response.json(result)
}
```

---

## Business Logic Summary

| Scenario | Status | Action |
|----------|--------|--------|
| No conflicts, all areas free | `AVAILABLE` | Auto-approve |
| Primary areas occupied, alternates free (multi-event) | `PARTIALLY_AVAILABLE` | Suggest alternatives |
| Kitchen occupied by approved booking | `KITCHEN_COORDINATION_REQUIRED` | Manual coordination |
| Event doesn't allow multiple bookings | `CONFLICT_REVIEW_REQUIRED` | Committee review |
| All areas full | `FULLY_OCCUPIED` | Suggest other dates |

---

## Configuration Reference

### Event Rules Structure

```typescript
interface EventAvailabilityRule {
  eventType: string
  preferredAreas: string[]           // Priority 1
  alternateAreas?: string[]          // Priority 2
  requiresKitchen?: boolean
  allowMultipleBookings?: boolean
  typicalTimeSlots?: string[]        // Recommended times
  maxConcurrentBookings?: number     // Limit per slot
}
```

### Add New Event Rules

To add rules for a new event, update `EVENT_AVAILABILITY_RULES` in `src/lib/availability-engine.ts`:

```typescript
const EVENT_AVAILABILITY_RULES: Record<string, EventAvailabilityRule> = {
  my_event: {
    eventType: "my_event",
    preferredAreas: ["MAIN_HALL"],
    alternateAreas: ["DRAWING_ROOM"],
    requiresKitchen: false,
    allowMultipleBookings: true,
    typicalTimeSlots: ["AFTERNOON"],
    maxConcurrentBookings: 2,
  },
  // ... more events
}
```

---

## Edge Cases Handled

1. ✅ FULL_DAY bookings block all time slots
2. ✅ Kitchen conflicts prioritized over area conflicts
3. ✅ Multiple bookings allowed per event type
4. ✅ Alternative areas suggested when primary unavailable
5. ✅ Max concurrent bookings enforced
6. ✅ Event type specific rules applied
7. ✅ Only approved/confirmed bookings block availability
8. ✅ Time slot overlaps calculated correctly
9. ✅ Alternative dates/slots suggested in recommendations
10. ✅ Bilingual event names (via events-master.json)

---

## Performance Considerations

- **Time Complexity:** O(n) where n = number of existing bookings
- **Space Complexity:** O(m) where m = number of conflicts
- **Optimization:** Filter by date first, then by time slot
- **Caching:** Event rules are static (can be cached)

---

## Testing Scenarios

### Test Case 1: Simple Available Booking
- Event: Birthday Party
- Date: No existing bookings
- Expected: `AVAILABLE`

### Test Case 2: Kitchen Coordination
- Event 1: Marriage (kitchen approved)
- Event 2: Shraddha Paksh (needs kitchen, same time)
- Expected: `KITCHEN_COORDINATION_REQUIRED`

### Test Case 3: Multiple Shraddha Bookings
- Event 1: Shraddha in GF
- Event 2: Shraddha in FLW (same time, different area)
- Expected: `AVAILABLE` or `PARTIALLY_AVAILABLE`

### Test Case 4: Full Day Booking
- Event 1: Marriage FULL_DAY booked
- Event 2: Birthday MORNING request
- Expected: `CONFLICT_REVIEW_REQUIRED` (FULL_DAY blocks all)

### Test Case 5: Capacity Exceeded
- Event: Birthday Party (max 2 concurrent)
- Existing: 2 birthday parties
- Expected: `FULLY_OCCUPIED`

---

## File Structure

```
src/
├── types/
│   └── availability.ts           # Type definitions
├── lib/
│   └── availability-engine.ts    # Engine logic
└── components/
    └── examples/
        └── AvailabilityCheckExample.tsx  # Demo component
```

---

## API Reference

| Function | Purpose | Returns |
|----------|---------|---------|
| `checkAvailability(request)` | Check single slot | `AvailabilityCheckResult` |
| `checkAvailabilityForMultipleSlots(...)` | Check all slots on date | `Record<string, Status>` |
| `getRecommendedSlots(...)` | Get available slots matching event type | `string[]` |
| `canAreaBeUsedForEvent(eventType, area)` | Validate area for event | `boolean` |
| `getUsableAreas(eventType)` | Get all valid areas for event | `string[]` |

---

## Next Steps

1. **Integrate with Booking API** — Use availability check before accepting bookings
2. **Build Booking Form** — Use multi-slot check for date picker
3. **Admin Dashboard** — Display pending coordination requests
4. **Notifications** — Alert committee for coordination needed
5. **Calendar View** — Visual availability by area and time
6. **Reporting** — Kitchen utilization, area occupancy rates
