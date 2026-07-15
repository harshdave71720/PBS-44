# Events Master Quick Reference

## What Was Created

### 1. Configuration File
**`src/data/events-master.json`** — Central JSON configuration defining all 8 events:
- Sooraj Pooja, Uttara Kary, Barsi, Shraddha Paksh
- Marriage, Birthday Party, Mahila Sangeet, Other

**Each event includes:**
- Code, Hindi/English names, descriptions
- Member & non-member charges (₹)
- Allowed areas and time slots
- Approval requirements
- Duration estimates

### 2. Utility Module
**`src/lib/events-master.ts`** — TypeScript utilities for working with events:
- ✅ 16+ functions for retrieving, filtering, and validating events
- ✅ Charge calculations with optional discounts
- ✅ Area/time slot validation
- ✅ Bilingual name retrieval (Hindi/English)
- ✅ Approval status filtering

### 3. Example Component
**`src/components/examples/EventSelectionExample.tsx`** — Interactive demo component:
- Event type selector
- Area and time slot filtering
- Real-time price display
- Member vs. non-member pricing
- Input validation

### 4. Documentation
**`docs/EVENTS_MASTER.md`** — Complete reference with:
- Event details and specifications
- Function documentation with examples
- Usage patterns and best practices
- Pricing strategy explanation

---

## Quick Start

### Import Events Master

```typescript
import {
  getAllEvents,
  getEventByCode,
  getEventCharge,
  getAllowedAreasForEvent,
  isAreaAllowedForEvent,
} from "@/lib/events-master"
```

### Get All Events

```typescript
const events = getAllEvents()
// Returns array of 8 EventMasterConfig objects
```

### Look Up Specific Event

```typescript
const marriage = getEventByCode("marriage")
// {
//   id: "EVENT_005",
//   code: "marriage",
//   nameHindi: "विवाह",
//   nameEnglish: "Marriage",
//   memberCharge: 5000,
//   nonMemberCharge: 10000,
//   allowedAreas: ["MAIN_HALL", "GARDEN", "TERRACE", "KITCHEN_AREA", "PARKING"],
//   ...
// }
```

### Calculate Booking Charge

```typescript
const charge = getEventCharge("birthday_party", true) // Member
// Returns: 1500

const nonMemberCharge = getEventCharge("birthday_party", false)
// Returns: 3000

// With discount
import { calculateEventCharge } from "@/lib/events-master"
const discounted = calculateEventCharge("marriage", true, 10) // 10% discount
// Returns: 4500 (5000 - 10%)
```

### Validate Booking

```typescript
const isValid = isAreaAllowedForEvent("marriage", "MAIN_HALL")
// Returns: true

const hasTimeSlot = isTimeSlotAllowedForEvent("birthday_party", "EVENING")
// Returns: true
```

### Get Event in User's Language

```typescript
const eventName = getEventName("sooraj_pooja", "hi") // Hindi
// Returns: "सूरज पूजा"

const englishName = getEventName("sooraj_pooja", "en")
// Returns: "Sooraj Pooja"
```

---

## Event Pricing Matrix

| Event | Member | Non-Member | Markup |
|-------|--------|------------|--------|
| Sooraj Pooja | ₹500 | ₹1,000 | 2x |
| Uttara Kary | ₹1,500 | ₹3,000 | 2x |
| Barsi | ₹800 | ₹1,500 | 2x |
| Shraddha Paksh | ₹1,200 | ₹2,500 | 2x |
| **Marriage** | **₹5,000** | **₹10,000** | **2x** |
| Birthday Party | ₹1,500 | ₹3,000 | 2x |
| Mahila Sangeet | ₹1,000 | ₹2,000 | 2x |
| Other | ₹2,000 | ₹4,000 | 2x |

---

## Approval Requirements

**Requires Committee Approval:**
- Uttara Kary ✓
- Barsi ✓
- Shraddha Paksh ✓
- Marriage ✓
- Other ✓

**Auto-Approved:**
- Sooraj Pooja
- Birthday Party
- Mahila Sangeet

---

## Common Use Cases

### 1. Build Event Dropdown
```typescript
function EventDropdown() {
  const events = getAllEvents()
  return (
    <select>
      {events.map(e => (
        <option key={e.id} value={e.code}>
          {getEventName(e.code, "en")}
        </option>
      ))}
    </select>
  )
}
```

### 2. Display Price Based on Status
```typescript
function PriceDisplay({ eventCode, isMember }) {
  const charge = getEventCharge(eventCode, isMember)
  return <div>₹{charge}</div>
}
```

### 3. Validate Booking Request
```typescript
function validateBooking(eventCode, area, timeSlot) {
  return (
    isAreaAllowedForEvent(eventCode, area) &&
    isTimeSlotAllowedForEvent(eventCode, timeSlot)
  )
}
```

### 4. Determine Workflow
```typescript
function getWorkflow(eventCode) {
  const events = getEventsRequiringApproval()
  return events.some(e => e.code === eventCode)
    ? "approval_workflow"
    : "auto_confirm"
}
```

---

## File Locations

| Purpose | Path |
|---------|------|
| **Configuration** | `src/data/events-master.json` |
| **Utilities** | `src/lib/events-master.ts` |
| **Example** | `src/components/examples/EventSelectionExample.tsx` |
| **Documentation** | `docs/EVENTS_MASTER.md` |
| **Types** | `src/types/booking.ts` |

---

## Next Steps

1. **Build Booking Form** — Use EventSelectionExample as reference
2. **Create API Route** — `/api/bookings` to process bookings
3. **Add Database Layer** — Store bookings with event master reference
4. **Build Admin Dashboard** — Edit charges and event availability
5. **Implement Payment** — Integrate charge calculation
6. **Generate Reports** — Revenue by event type

---

## Key Functions Reference

| Function | Purpose | Returns |
|----------|---------|---------|
| `getAllEvents()` | Get all events | `EventMasterConfig[]` |
| `getEventByCode(code)` | Find event by code | `EventMasterConfig \| undefined` |
| `getEventCharge(code, isMember)` | Get booking charge | `number \| null` |
| `isAreaAllowedForEvent(code, area)` | Validate area | `boolean` |
| `isTimeSlotAllowedForEvent(code, slot)` | Validate time | `boolean` |
| `getEventName(code, lang)` | Get name in language | `string \| null` |
| `calculateEventCharge(code, isMember, discount)` | Calculate with discount | `number \| null` |
| `getEventsRequiringApproval()` | Filter approval events | `EventMasterConfig[]` |
| `getAllowedAreasForEvent(code)` | Get areas for event | `string[]` |
| `getAllowedTimeSlotsForEvent(code)` | Get slots for event | `string[]` |

---

## Build Status

✅ **Production Build:** Passing  
✅ **TypeScript:** All types valid  
✅ **JSON:** Valid configuration  
✅ **Components:** Ready to use  

Run tests anytime:
```bash
npm run build
npm run lint
```
