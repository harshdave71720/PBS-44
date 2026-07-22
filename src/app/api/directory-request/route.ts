import { NextResponse } from 'next/server';
import {
  saveDirectoryRequest,
  type SaveDirectoryRequestParams,
} from '@/features/booking/repositories/googleSheetsRepository';

const CHANGE_DETAILS = new Set<SaveDirectoryRequestParams['changeDetail']>([
  'MobileNumber',
  'Address',
  'Both',
]);

function isValidBody(value: unknown): value is SaveDirectoryRequestParams {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return (
    (typeof v.membershipNumber === 'string' || typeof v.membershipNumber === 'number') &&
    typeof v.memberName === 'string' &&
    typeof v.memberMobileNumber === 'string' &&
    typeof v.gaonName === 'string' &&
    typeof v.applicantName === 'string' &&
    typeof v.applicantMobileNumber === 'string' &&
    typeof v.changeDetail === 'string' &&
    CHANGE_DETAILS.has(v.changeDetail as SaveDirectoryRequestParams['changeDetail']) &&
    typeof v.updatedDetails === 'string'
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (!isValidBody(body)) {
      return NextResponse.json({ error: 'Invalid request payload.' }, { status: 400 });
    }
    await saveDirectoryRequest(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save directory request:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
