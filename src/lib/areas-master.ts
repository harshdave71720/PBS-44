/**
 * Area Master Configuration Loader
 * Provides typed access to area definitions from areas-master.json
 */

import areasMasterData from "@/data/areas-master.json"

export interface AreaDimensions {
  length: number | string
  width: number | string
  height: number | string
  unit: string
}

export interface AreaMasterConfig {
  id: string
  code: string
  displayName: string
  displayNameHindi: string
  capacity: number
  description: string
  descriptionHindi: string
  amenities: string[]
  dimensions: AreaDimensions
  sortOrder: number
  enabled: boolean
}

export interface AreasMasterData {
  areas: AreaMasterConfig[]
  metadata: {
    version: string
    lastUpdated: string
    description: string
    totalCapacity: number
    notes: string
  }
}

/**
 * Get all areas from master configuration
 * @param onlyEnabled - If true, only return enabled areas
 */
export function getAllAreas(onlyEnabled: boolean = true): AreaMasterConfig[] {
  const data = areasMasterData as AreasMasterData
  const areas = data.areas
  
  if (onlyEnabled) {
    return areas.filter((area) => area.enabled).sort((a, b) => a.sortOrder - b.sortOrder)
  }
  
  return areas.sort((a, b) => a.sortOrder - b.sortOrder)
}

/**
 * Get area by code
 * @param code - Area code (e.g., "GF", "SPH", "FLW", "FRW", "RT")
 */
export function getAreaByCode(code: string): AreaMasterConfig | undefined {
  return getAllAreas(false).find((area) => area.code === code)
}

/**
 * Get area by ID
 * @param id - Area ID (e.g., "AREA_001")
 */
export function getAreaById(id: string): AreaMasterConfig | undefined {
  return getAllAreas(false).find((area) => area.id === id)
}

/**
 * Get area display name in specific language
 * @param areaCode - Area code
 * @param language - "hi" for Hindi, "en" for English
 */
export function getAreaName(
  areaCode: string,
  language: "hi" | "en" = "en"
): string | null {
  const area = getAreaByCode(areaCode)
  if (!area) return null

  return language === "hi" ? area.displayNameHindi : area.displayName
}

/**
 * Get area capacity
 * @param areaCode - Area code
 */
export function getAreaCapacity(areaCode: string): number | null {
  const area = getAreaByCode(areaCode)
  return area ? area.capacity : null
}

/**
 * Check if area is enabled for booking
 * @param areaCode - Area code
 */
export function isAreaEnabled(areaCode: string): boolean {
  const area = getAreaByCode(areaCode)
  return area ? area.enabled : false
}

/**
 * Get area description in specific language
 * @param areaCode - Area code
 * @param language - "hi" for Hindi, "en" for English
 */
export function getAreaDescription(
  areaCode: string,
  language: "hi" | "en" = "en"
): string | null {
  const area = getAreaByCode(areaCode)
  if (!area) return null

  return language === "hi" ? area.descriptionHindi : area.description
}

/**
 * Get area amenities
 * @param areaCode - Area code
 */
export function getAreaAmenities(areaCode: string): string[] {
  const area = getAreaByCode(areaCode)
  return area ? area.amenities : []
}

/**
 * Get area dimensions
 * @param areaCode - Area code
 */
export function getAreaDimensions(areaCode: string): AreaDimensions | null {
  const area = getAreaByCode(areaCode)
  return area ? area.dimensions : null
}

/**
 * Filter areas by minimum capacity
 * @param minCapacity - Minimum capacity required
 */
export function getAreasByCapacity(minCapacity: number): AreaMasterConfig[] {
  return getAllAreas().filter((area) => area.capacity >= minCapacity)
}

/**
 * Check if an area can accommodate a given number of guests
 * @param areaCode - Area code
 * @param guestCount - Number of guests
 * @param bufferPercent - Safety buffer percentage (default 10)
 */
export function canAreaAccommodate(
  areaCode: string,
  guestCount: number,
  bufferPercent: number = 10
): boolean {
  const capacity = getAreaCapacity(areaCode)
  if (capacity === null) return false

  const effectiveCapacity = capacity - (capacity * bufferPercent) / 100
  return guestCount <= effectiveCapacity
}

/**
 * Get all areas suitable for an event (with required capacity)
 * @param requiredCapacity - Capacity needed
 * @param onlyEnabled - Only return enabled areas
 */
export function getSuitableAreas(
  requiredCapacity: number,
  onlyEnabled: boolean = true
): AreaMasterConfig[] {
  const areas = getAllAreas(onlyEnabled)
  return areas.filter((area) => area.capacity >= requiredCapacity)
}

/**
 * Get area information summary
 * @param areaCode - Area code
 * @param language - "hi" for Hindi, "en" for English
 */
export function getAreaSummary(
  areaCode: string,
  language: "hi" | "en" = "en"
): Partial<AreaMasterConfig> | null {
  const area = getAreaByCode(areaCode)
  if (!area) return null

  return {
    code: area.code,
    displayName: language === "hi" ? area.displayNameHindi : area.displayName,
    capacity: area.capacity,
    description: language === "hi" ? area.descriptionHindi : area.description,
    amenities: area.amenities,
    dimensions: area.dimensions,
    enabled: area.enabled,
  }
}

/**
 * Get all unique amenities across all areas
 */
export function getAllUniqueAmenities(): string[] {
  const amenities = new Set<string>()
  getAllAreas(false).forEach((area) => {
    area.amenities.forEach((amenity) => amenities.add(amenity))
  })
  return Array.from(amenities).sort()
}

/**
 * Calculate total venue capacity
 */
export function getTotalVenueCapacity(): number {
  return (areasMasterData as AreasMasterData).metadata.totalCapacity
}

/**
 * Get area by minimum capacity (smallest area that fits requirement)
 * @param requiredCapacity - Capacity needed
 */
export function getSmallestSuitableArea(
  requiredCapacity: number
): AreaMasterConfig | null {
  const suitable = getSuitableAreas(requiredCapacity)
  if (suitable.length === 0) return null

  return suitable.reduce((smallest, current) =>
    current.capacity < smallest.capacity ? current : smallest
  )
}

/**
 * Get area by maximum capacity (largest area)
 */
export function getLargestArea(): AreaMasterConfig | null {
  const areas = getAllAreas()
  if (areas.length === 0) return null

  return areas.reduce((largest, current) =>
    current.capacity > largest.capacity ? current : largest
  )
}

/**
 * Compare two areas for capacity and features
 */
export function compareAreas(
  areaCode1: string,
  areaCode2: string
): {
  area1: AreaMasterConfig | null
  area2: AreaMasterConfig | null
  capacityDifference: number
  sameAmenities: string[]
  uniqueTo1: string[]
  uniqueTo2: string[]
} | null {
  const area1 = getAreaByCode(areaCode1)
  const area2 = getAreaByCode(areaCode2)

  if (!area1 || !area2) return null

  const amenities1 = new Set(area1.amenities)
  const amenities2 = new Set(area2.amenities)

  const sameAmenities = Array.from(amenities1).filter((a) => amenities2.has(a))
  const uniqueTo1 = Array.from(amenities1).filter((a) => !amenities2.has(a))
  const uniqueTo2 = Array.from(amenities2).filter((a) => !amenities1.has(a))

  return {
    area1,
    area2,
    capacityDifference: area1.capacity - area2.capacity,
    sameAmenities,
    uniqueTo1,
    uniqueTo2,
  }
}

/**
 * Get area details for display (bilingual)
 */
export function getAreaDisplayInfo(
  areaCode: string,
  language: "hi" | "en" = "en"
): {
  code: string
  name: string
  capacity: number
  description: string
  amenities: string[]
  enabled: boolean
} | null {
  const area = getAreaByCode(areaCode)
  if (!area) return null

  return {
    code: area.code,
    name: language === "hi" ? area.displayNameHindi : area.displayName,
    capacity: area.capacity,
    description:
      language === "hi" ? area.descriptionHindi : area.description,
    amenities: area.amenities,
    enabled: area.enabled,
  }
}

/**
 * Get areas sorted by capacity (ascending)
 */
export function getAreasSortedByCapacity(): AreaMasterConfig[] {
  return getAllAreas().sort((a, b) => a.capacity - b.capacity)
}
