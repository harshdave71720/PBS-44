# PBS-44 Areas Master Configuration

## Overview

The Areas Master is a centralized JSON configuration file that defines all physical spaces available at PBS-44 Society Bhavan. It provides capacity, amenities, dimensions, and availability information for each area.

**File Location:** `src/data/areas-master.json`  
**Utility Module:** `src/lib/areas-master.ts`

---

## Area Structure

Each area in the master configuration has the following properties:

```json
{
  "id": "AREA_001",
  "code": "GF",
  "displayName": "Bhutal",
  "displayNameHindi": "भूतल",
  "capacity": 250,
  "description": "Ground floor main area with excellent ventilation and accessibility",
  "descriptionHindi": "भूतल पर स्थित मुख्य हॉल, उत्तम वेंटिलेशन और पहुंच सुविधा के साथ",
  "amenities": ["Central AC", "Sound system", "Stage area", "Multiple entrances", "Adequate parking"],
  "dimensions": {
    "length": 45,
    "width": 35,
    "height": 12,
    "unit": "feet"
  },
  "sortOrder": 1,
  "enabled": true
}
```

### Property Details

| Property | Type | Description |
|----------|------|-------------|
| `id` | string | Unique area identifier (e.g., "AREA_001") |
| `code` | string | Machine-readable code (e.g., "GF", "SPH") - used for lookups |
| `displayName` | string | Area name in English |
| `displayNameHindi` | string | Area name in Hindi (हिंदी) |
| `capacity` | number | Maximum guest capacity |
| `description` | string | Detailed description in English |
| `descriptionHindi` | string | Detailed description in Hindi |
| `amenities` | string[] | List of available amenities |
| `dimensions` | object | Physical dimensions with length, width, height, unit |
| `sortOrder` | number | Display order in UI (1-5) |
| `enabled` | boolean | Whether area is available for booking |

---

## Available Areas

### 1. Bhutal (भूतल) — Ground Floor
- **Code:** `GF`
- **Capacity:** 250 guests
- **Dimensions:** 45ft × 35ft × 12ft high
- **Sort Order:** 1
- **Status:** Enabled ✓
- **Amenities:** Central AC, Sound system, Stage area, Multiple entrances, Adequate parking
- **Best For:** Large events, weddings, major celebrations
- **Description:** Ground floor main area with excellent ventilation and accessibility

### 2. Sooraj Poojan Hall (सूरज पूजन हॉल)
- **Code:** `SPH`
- **Capacity:** 150 guests
- **Dimensions:** 30ft × 25ft × 10ft high
- **Sort Order:** 2
- **Status:** Enabled ✓
- **Amenities:** Natural lighting, Prayer platform, Peaceful ambiance, Basic AC, Separate entrance
- **Best For:** Religious ceremonies, prayer meetings, spiritual gatherings
- **Description:** Dedicated prayer hall with natural light, ideal for religious ceremonies

### 3. First Floor Left Wing (प्रथम तल बायां विंग)
- **Code:** `FLW`
- **Capacity:** 120 guests
- **Dimensions:** 35ft × 20ft × 10ft high
- **Sort Order:** 3
- **Status:** Enabled ✓
- **Amenities:** Air conditioned, Flexible layout, Natural light, Staircase access, Restroom nearby
- **Best For:** Medium gatherings, seminars, cultural programs
- **Description:** First floor left section, flexible space for medium gatherings

### 4. First Floor Right Wing (प्रथम तल दायां विंग)
- **Code:** `FRW`
- **Capacity:** 120 guests
- **Dimensions:** 35ft × 20ft × 10ft high
- **Sort Order:** 4
- **Status:** Enabled ✓
- **Amenities:** Air conditioned, Flexible layout, Natural light, Staircase access, Restroom nearby
- **Best For:** Medium gatherings, seminars, cultural programs
- **Description:** First floor right section, similar to left wing with independent access

### 5. Roof Top (छत)
- **Code:** `RT`
- **Capacity:** 200 guests
- **Dimensions:** 50ft × 40ft open
- **Sort Order:** 5
- **Status:** Enabled ✓
- **Amenities:** Open air, City view, Garden space, Lighting setup available, Partial covering
- **Best For:** Outdoor events, garden parties, sky-view celebrations
- **Description:** Open rooftop space ideal for outdoor events, gardens, and sky-view celebrations

---

## Area Capacity Overview

| Area | Code | Capacity | Best Use |
|------|------|----------|----------|
| Bhutal | GF | 250 | Large events, weddings |
| Sooraj Poojan Hall | SPH | 150 | Religious ceremonies |
| First Floor Left Wing | FLW | 120 | Medium gatherings |
| First Floor Right Wing | FRW | 120 | Medium gatherings |
| Roof Top | RT | 200 | Outdoor events |
| **Total Capacity** | — | **840** | — |

---

## Utility Functions

The `src/lib/areas-master.ts` module provides typed functions for working with areas:

### Basic Retrieval

```typescript
import { getAllAreas, getAreaByCode, getAreaById } from "@/lib/areas-master"

// Get all enabled areas (sorted by sortOrder)
const areas = getAllAreas()

// Get all areas including disabled ones
const allAreas = getAllAreas(false)

// Get area by code
const groundFloor = getAreaByCode("GF")

// Get area by ID
const area = getAreaById("AREA_001")
```

### Capacity & Suitability

```typescript
import { getAreaCapacity, getAreasByCapacity, getSuitableAreas, canAreaAccommodate } from "@/lib/areas-master"

// Get capacity of specific area
const capacity = getAreaCapacity("GF") // 250

// Get areas with minimum capacity
const largeAreas = getAreasByCapacity(200)
// Returns: [GF (250), RT (200)]

// Get suitable areas for event
const suitable = getSuitableAreas(150)
// Returns all areas with capacity >= 150

// Check if area can fit guests (with 10% safety buffer)
const canFit = canAreaAccommodate("SPH", 130) // true (150 - 10% = 135)
```

### Information Retrieval

```typescript
import {
  getAreaName,
  getAreaDescription,
  getAreaAmenities,
  getAreaDimensions,
  getAreaDisplayInfo,
} from "@/lib/areas-master"

// Get area name in language
const nameEn = getAreaName("GF", "en") // "Bhutal"
const nameHi = getAreaName("GF", "hi") // "भूतल"

// Get area description
const descEn = getAreaDescription("RT", "en")
// "Open rooftop space ideal for outdoor events..."

// Get amenities
const amenities = getAreaAmenities("GF")
// ["Central AC", "Sound system", "Stage area", ...]

// Get dimensions
const dims = getAreaDimensions("SPH")
// { length: 30, width: 25, height: 10, unit: "feet" }

// Get complete display info
const info = getAreaDisplayInfo("FLW", "en")
```

### Status & Availability

```typescript
import { isAreaEnabled, getTotalVenueCapacity } from "@/lib/areas-master"

// Check if area is enabled for booking
const available = isAreaEnabled("GF") // true

// Get total venue capacity
const total = getTotalVenueCapacity() // 840
```

### Filtering & Comparison

```typescript
import {
  getSmallestSuitableArea,
  getLargestArea,
  getAreasSortedByCapacity,
  getAllUniqueAmenities,
  compareAreas,
} from "@/lib/areas-master"

// Get smallest area that fits requirement
const best = getSmallestSuitableArea(100)
// Returns FLW or FRW (120 capacity, smallest that fits)

// Get largest area
const largest = getLargestArea() // GF (250)

// Sort by capacity ascending
const bySize = getAreasSortedByCapacity()
// [FLW (120), FRW (120), SPH (150), RT (200), GF (250)]

// Get all amenities across all areas
const allAmenities = getAllUniqueAmenities()

// Compare two areas
const comparison = compareAreas("GF", "SPH")
// { capacityDifference: 100, sameAmenities: [...], uniqueTo1: [...], uniqueTo2: [...] }
```

---

## Usage Examples

### Example 1: Area Selection for Event

```typescript
import { getSuitableAreas, getAreaName } from "@/lib/areas-master"

function AreaSelector({ guestCount }) {
  const suitable = getSuitableAreas(guestCount)

  return (
    <select name="area">
      {suitable.map((area) => (
        <option key={area.id} value={area.code}>
          {getAreaName(area.code, "en")} - {area.capacity} capacity
        </option>
      ))}
    </select>
  )
}
```

### Example 2: Capacity Validation

```typescript
import { canAreaAccommodate } from "@/lib/areas-master"

function validateGuestCount(areaCode, guestCount) {
  if (!canAreaAccommodate(areaCode, guestCount)) {
    return {
      valid: false,
      error: `This area cannot accommodate ${guestCount} guests`,
    }
  }
  return { valid: true }
}
```

### Example 3: Display Area Details

```typescript
import { getAreaDisplayInfo, getAreaAmenities } from "@/lib/areas-master"

function AreaDetailsCard({ areaCode }) {
  const info = getAreaDisplayInfo(areaCode, "en")
  const amenities = getAreaAmenities(areaCode)

  if (!info) return <div>Area not found</div>

  return (
    <div>
      <h3>{info.name}</h3>
      <p>Capacity: {info.capacity}</p>
      <p>{info.description}</p>
      <ul>
        {amenities.map((a) => (
          <li key={a}>{a}</li>
        ))}
      </ul>
    </div>
  )
}
```

### Example 4: Build Area Dropdown (Bilingual)

```typescript
import { getAllAreas, getAreaName } from "@/lib/areas-master"

function AreaDropdown({ language = "en" }) {
  const areas = getAllAreas()

  return (
    <select name="area">
      <option value="">Select an area</option>
      {areas.map((area) => (
        <option key={area.code} value={area.code}>
          {getAreaName(area.code, language)}
        </option>
      ))}
    </select>
  )
}
```

### Example 5: Recommend Best Area

```typescript
import { getSmallestSuitableArea, getAreaName } from "@/lib/areas-master"

function recommendArea(guestCount) {
  const recommended = getSmallestSuitableArea(guestCount)

  if (!recommended) {
    return "No suitable area available for this guest count"
  }

  return `We recommend ${getAreaName(recommended.code, "en")} (capacity: ${recommended.capacity})`
}
```

---

## Adding New Areas

To add a new area, update `src/data/areas-master.json`:

1. Add a new entry to the `areas` array
2. Ensure `id` is unique and incremental
3. Create a descriptive `code` (uppercase, e.g., "KT" for Kitchen)
4. Provide both English and Hindi names
5. Set realistic capacity based on dimensions
6. List all amenities
7. Add dimensions data
8. Set `sortOrder` (incremental from last)
9. Set `enabled: true` by default
10. Update `metadata.totalCapacity`

Example:

```json
{
  "id": "AREA_006",
  "code": "KT",
  "displayName": "Kitchen Area",
  "displayNameHindi": "रसोई क्षेत्र",
  "capacity": 50,
  "description": "Full-service kitchen with modern cooking facilities",
  "descriptionHindi": "आधुनिक खाना पकाने की सुविधा के साथ पूरी रसोई",
  "amenities": ["Stove", "Refrigerator", "Exhaust system", "Storage"],
  "dimensions": {
    "length": 20,
    "width": 15,
    "height": 8,
    "unit": "feet"
  },
  "sortOrder": 6,
  "enabled": true
}
```

---

## Integration with Booking System

### 1. With Events Master

Areas and events work together for booking validation:

```typescript
import { isAreaAllowedForEvent } from "@/lib/events-master"
import { canAreaAccommodate } from "@/lib/areas-master"

function validateEventAreaBooking(eventCode, areaCode, guestCount) {
  const eventValid = isAreaAllowedForEvent(eventCode, areaCode)
  const capacityValid = canAreaAccommodate(areaCode, guestCount)

  return eventValid && capacityValid
}
```

### 2. With Booking Form

Use areas master to populate area dropdown:

```typescript
function BookingForm({ eventCode }) {
  const [guestCount, setGuestCount] = useState(0)
  const suitable = getSuitableAreas(guestCount)

  return (
    <form>
      <input 
        type="number" 
        onChange={(e) => setGuestCount(Number(e.target.value))} 
      />
      <select name="area">
        {suitable.map((area) => (
          <option key={area.code} value={area.code}>
            {getAreaName(area.code)} ({area.capacity} capacity)
          </option>
        ))}
      </select>
    </form>
  )
}
```

### 3. With Admin Dashboard

Display/edit area availability:

```typescript
function AreaManagement() {
  const areas = getAllAreas(false)

  return (
    <table>
      <thead>
        <tr>
          <th>Area</th>
          <th>Capacity</th>
          <th>Enabled</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {areas.map((area) => (
          <tr key={area.code}>
            <td>{area.displayName}</td>
            <td>{area.capacity}</td>
            <td>{area.enabled ? "✓" : "✗"}</td>
            <td>Edit | Disable</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

---

## Best Practices

1. **Always validate** area capacity against guest count before confirming bookings
2. **Use 10% safety buffer** in capacity calculations for comfort
3. **Check area enabled status** before offering in UI
4. **Display bilingual names** based on user's language preference
5. **Respect sortOrder** when displaying area lists
6. **Group related areas** (FLW and FRW are adjacent first-floor spaces)
7. **Consider amenities** when recommending areas for specific events
8. **Update metadata.totalCapacity** when adding/removing areas
9. **Use `getSmallestSuitableArea`** to optimize space utilization
10. **Cache area data** if displaying frequently in UI

---

## Related Files

- **Event Types:** [src/types/booking.ts](src/types/booking.ts) — `IArea` interface
- **Events Master:** [src/data/events-master.json](src/data/events-master.json) — Area associations
- **Events Utilities:** [src/lib/events-master.ts](src/lib/events-master.ts) — `isAreaAllowedForEvent()`
- **Booking Types:** See `IArea` interface for database schema

---

## API Reference Summary

| Function | Returns | Purpose |
|----------|---------|---------|
| `getAllAreas(onlyEnabled?)` | `AreaMasterConfig[]` | Get all areas |
| `getAreaByCode(code)` | `AreaMasterConfig \| undefined` | Lookup by code |
| `getAreaById(id)` | `AreaMasterConfig \| undefined` | Lookup by ID |
| `getAreaName(code, lang)` | `string \| null` | Get name in language |
| `getAreaCapacity(code)` | `number \| null` | Get capacity |
| `isAreaEnabled(code)` | `boolean` | Check if available |
| `getAreaDescription(code, lang)` | `string \| null` | Get description |
| `getAreaAmenities(code)` | `string[]` | Get amenities |
| `getAreaDimensions(code)` | `AreaDimensions \| null` | Get dimensions |
| `getAreasByCapacity(minCapacity)` | `AreaMasterConfig[]` | Filter by capacity |
| `canAreaAccommodate(code, count, buffer?)` | `boolean` | Validate capacity |
| `getSuitableAreas(capacity, onlyEnabled?)` | `AreaMasterConfig[]` | Get suitable areas |
| `getSmallestSuitableArea(capacity)` | `AreaMasterConfig \| null` | Optimal fit |
| `getLargestArea()` | `AreaMasterConfig \| null` | Max capacity area |
| `compareAreas(code1, code2)` | `Comparison \| null` | Compare features |
| `getTotalVenueCapacity()` | `number` | Total capacity |
| `getAllUniqueAmenities()` | `string[]` | All amenities |
