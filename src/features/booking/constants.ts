import { BhavanType } from '@/types/availability';

export const BHAVAN_SHEET_TAB_MAP: Record<BhavanType, string> = {
  [BhavanType.MAIN_BHAVAN]: 'मुख्य धर्मशाला',
  [BhavanType.DEVPURI_BHAVAN]: 'देवपुरी धर्मशाला',
  [BhavanType.GOVIND_COLONY_BHAVAN]: 'गोविंद कॉलोनी धर्मशाला',
};

export const BHAVAN_QUERY_MAP: Record<string, BhavanType> = {
  MAIN_BHAVAN: BhavanType.MAIN_BHAVAN,
  DEVPURI_BHAVAN: BhavanType.DEVPURI_BHAVAN,
  GOVIND_COLONY_BHAVAN: BhavanType.GOVIND_COLONY_BHAVAN,
};

export const BOOKING_CACHE_TAG = 'bhavan-bookings';
