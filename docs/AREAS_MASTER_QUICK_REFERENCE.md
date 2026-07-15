# Areas Master Quick Reference

## What Was Created

### 1. Configuration File
**`src/data/areas-master.json`** — Central JSON configuration defining all 5 areas:
- GF (Bhutal), SPH (Sooraj Poojan Hall)
- FLW (First Floor Left Wing), FRW (First Floor Right Wing)
- RT (Roof Top)

**Each area includes:**
- Code, English & Hindi names, descriptions
- Capacity (guests), dimensions, amenities
- Sort order, enabled status
- Total venue capacity: 840 guests

### 2. Utility Module
**`src/lib/areas-master.ts`** — TypeScript utilities for working with areas:
- ✅ 18+ functions for retrieving, filtering, and validating areas
- ✅ Capacity calculations with safety buffers
- ✅ Bilingual name retrieval (Hindi/English)
- ✅ Area comparison and recommendations
- ✅ Amenity and dimension information

### 3. Documentation
**`docs/AREAS_MASTER.md`** — Complete reference with:
- Area details and specifications
- Function documentation with examples
- Integration patterns with booking system
- Best practices

---

## Quick Start

### Import Areas Master

```typescript
import {
  getAllAreas,
  getAreaByCode,
  getAreaCapacity,
  canAreaAccommodate,
  getSuitableAreas,
} from "@/lib/areas-master"
```

### Get All Areas

```typescript
const areas = getAllAreas()
// Returns array of 5 AreaMasterConfig objects, sorted by sortOrder
```

### Look Up Specific Area

```typescript
const groundFloor = getAreaByCode("GF")
// {
//   id: "AREA_001",
//   code: "GF",
//   displayName: "Bhutal",
//   displayNameHindi: "भूतल",
//   capacity: 250,
//   amenities: ["Central AC", "Sound system", ...],
//   ...
// }
```

### Get Area Capacity

```typescript
const capacity = getAreaCapacity("SPH") // 150

// Check if area can fit guests (with 10% safety buffer)
const canFit = canAreaAccommodate("RT", 180) // true (200 - 10% = 180)
```

### Find Suitable Areas

```typescript
// Get all areas with capacity >= 200
const largeAreas = getSuitableAreas(200)
// Returns: [GF (250), RT (200)]

// Get smallest area that fits 100 guests
const best = getSmallestSuitableArea(100)
// Returns: FLW (120) - smallest that fits
```

### Get Area in User's Language

```typescript
const nameEn = getAreaName("SPH", "en") // "Sooraj Poojan Hall"
const nameHi = getAreaName("SPH", "hi") // "सूरज पूजन हॉल"

const descEn = getAreaDescription("RT", "en")
// "Open rooftop space ideal for outdoor events..."

const amenities = getAreaAmenities("GF")
// ["Central AC", "Sound system", "Stage area", ...]
```

---

## Area Overview

| Area | Code | Capacity | Dimensions | Best For |
|------|------|----------|------------|----------|
| Bhutal | GF | 250 | 45×35×12 ft | Large events, weddings |
| Sooraj Poojan Hall | SPH | 150 | 30×25×10 ft | Religious ceremonies |
| First Floor Left Wing | FLW | 120 | 35×20×10 ft | Medium gatherings |
| First Floor Right Wing | FRW | 120 | 35×20×10 ft | Medium gatherings |
| Roof Top | RT | 200 | 50×40 ft | Outdoor events |
| **TOTAL** | — | **840** | — | — |

---

## Common Use Cases

### 1. Build Area Dropdown
```typescript
function AreaSelector() {
  const areas = getAllAreas()
  return (
    <select>
      {areas.map(area => (
        <option key={area.code} value={area.code}>
          {getAreaName(area.code, "en")} - {area.capacity} capacity
        </option>
      ))}
    </select>
  )
}
```

### 2. Validate Guest Count
```typescript
function validateGuests(areaCode, guestCount) {
  if (!canAreaAccommodate(areaCode, guestCount)) {
    return { valid: false, error: "Too many guests for this area" }
  }
  return { valid: true }
}
```

### 3. Recommend Best Area
```typescript
function recommendArea(guestCount) {
  const best = getSmallestSuitableArea(guestCount)
  if (!best) return "No suitable area available"
  
  return `We recommend ${getAreaName(best.code)} (${best.capacity} capacity)`
}
```

### 4. Display Area Details
```typescript
function AreaCard({ areaCode }) {
  const info = getAreaDisplayInfo(areaCode, "en")
  const amenities = getAreaAmenities(areaCode)

  return (
    <div>
      <h3>{info.name}</h3>
      <p>Capacity: {info.capacity}</p>
      <p>{info.description}</p>
      <ul>
        {amenities.map(a => <li key={a}>{a}</li>)}
      </ul>
    </div>
  )
}
```

### 5. Compare Two Areas
```typescript
function compareAreas(code1, code2) {
  const comparison = compareAreas(code1, code2)
  return (
    <div>
      <p>Capacity difference: {comparison.capacityDifference}</p>
      <p>Common amenities: {comparison.sameAmenities.join(", ")}</p>
    </div>
  )
}
```

---

## Amenities by Area

| Area | Amenities |
|------|-----------|
| **GF (Bhutal)** | Central AC, Sound system, Stage area, Multiple entrances, Adequate parking |
| **SPH** | Natural lighting, Prayer platform, Peaceful ambiance, Basic AC, Separate entrance |
| **FLW** | Air conditioned, Flexible layout, Natural light, Staircase access, Restroom nearby |
| **FRW** | Air conditioned, Flexible layout, Natural light, Staircase access, Restroom nearby |
| **RT** | Open air, City view, Garden space, Lighting setup available, Partial covering |

---

## Integration with Events Master

### Validate Event + Area + Capacity

```typescript
import { isAreaAllowedForEvent } from "@/lib/events-master"
import { canAreaAccommodate } from "@/lib/areas-master"

function validateBooking(eventCode, areaCode, guestCount) {
  const eventAllows = isAreaAllowedForEvent(eventCode, areaCode)
  const capacityOk = canAreaAccommodate(areaCode, guestCount)
  
  return eventAllows && capacityOk
}
```

### Get Suitable Areas for Event

```typescript
import { isAreaAllowedForEvent } from "@/lib/events-master"
import { getAllAreas } from "@/lib/areas-master"

function getSuitableAreasForEvent(eventCode, guestCount) {
  const areas = getAllAreas()
  return areas.filter(area => 
    isAreaAllowedForEvent(eventCode, area.code) &&
    canAreaAccommodate(area.code, guestCount)
  )
}
```

---

## Key Functions Reference

| Function | Purpose | Returns |
|----------|---------|---------|
| `getAllAreas(onlyEnabled?)` | Get all areas | `AreaMasterConfig[]` |
| `getAreaByCode(code)` | Find area by code | `AreaMasterConfig \| undefined` |
| `getAreaById(id)` | Find area by ID | `AreaMasterConfig \| undefined` |
| `getAreaName(code, lang)` | Get name in language | `string \| null` |
| `getAreaCapacity(code)` | Get capacity | `number \| null` |
| `isAreaEnabled(code)` | Check if available | `boolean` |
| `getAreaDescription(code, lang)` | Get description | `string \| null` |
| `getAreaAmenities(code)` | Get amenities | `string[]` |
| `getAreaDimensions(code)` | Get dimensions | `AreaDimensions \| null` |
| `getAreasByCapacity(minCapacity)` | Filter by capacity | `AreaMasterConfig[]` |
| `canAreaAccommodate(code, count, buffer?)` | Validate capacity | `boolean` |
| `getSuitableAreas(capacity)` | Get suitable areas | `AreaMasterConfig[]` |
| `getSmallestSuitableArea(capacity)` | Optimal fit | `AreaMasterConfig \| null` |
| `getLargestArea()` | Max capacity area | `AreaMasterConfig \| null` |
| `compareAreas(code1, code2)` | Compare features | `Comparison \| null` |
| `getAreaDisplayInfo(code, lang)` | Get display info | `DisplayInfo \| null` |
| `getTotalVenueCapacity()` | Total capacity | `number` (840) |
| `getAllUniqueAmenities()` | All amenities | `string[]` |

---

## Capacity Planning

### Recommended Minimum Capacity Buffer
- **Comfort:** 10% safety buffer (default in `canAreaAccommodate`)
- **Cramped:** 5% buffer (not recommended)
- **Very Safe:** 20% buffer

### Example Calculation
```typescript
// Area: Sooraj Poojan Hall (150 capacity)
// Event: Shraddha Paksh with 145 guests
// Buffer: 10%

// Effective capacity = 150 - (150 * 10%) = 135
// 145 guests > 135 effective capacity = ❌ CANNOT FIT

canAreaAccommodate("SPH", 145) // false
canAreaAccommodate("SPH", 130) // true
```

---

## File Locations

| Purpose | Path |
|---------|------|
| **Configuration** | `src/data/areas-master.json` |
| **Utilities** | `src/lib/areas-master.ts` |
| **Documentation** | `docs/AREAS_MASTER.md` |
| **Types** | `src/types/booking.ts` (IArea interface) |

---

## Build Status

✅ **Production Build:** Passing  
✅ **TypeScript:** All types valid  
✅ **JSON:** Valid configuration  

Run tests:
```bash
npm run build
npm run lint
```

---

## Next Steps

1. **Build Booking Form** — Use area selector with capacity validation
2. **Create API Route** — `/api/bookings` with area availability checks
3. **Build Admin Dashboard** — Manage area availability and capacity
4. **Add Availability Calendar** — Track booked dates per area
5. **Implement Overbooking** — Allow multiple bookings if areas are separate
6. **Generate Utilization Reports** — By area and date
