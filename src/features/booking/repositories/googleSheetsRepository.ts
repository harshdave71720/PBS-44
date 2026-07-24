import { google } from 'googleapis';
import { parse, format, isValid } from 'date-fns';
import { BhavanBooking } from '@/features/booking/utils/availability';

export const EVENT_NAME_MAP: Record<string, string> = {
  manglik_karyakram: 'Manglik Event',
  shok_uttarkaryakram: 'Shok / Uttarkary Event',
  dharmik_karyakram: 'Religious Event',
  samaj_karyakram: 'Social Event',
  anya: 'Other',
};

export const SHEET_TO_EVENT_MAP: Record<string, string> = {
  'Manglik Event': 'manglik_karyakram',
  'Shok / Uttarkary Event': 'shok_uttarkaryakram',
  'Religious Event': 'dharmik_karyakram',
  'Social Event': 'samaj_karyakram',
  Other: 'anya',
};

function getSheetsClient() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;

  if (!email) {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_EMAIL is missing from environment variables.',
    );
  }
  if (!key) {
    throw new Error(
      'GOOGLE_PRIVATE_KEY is missing from environment variables.',
    );
  }

  const auth = new google.auth.JWT({
    email,
    key: key.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

export type CreateBookingRequestParams = {
  membershipNumber: string | number;
  memberName?: string;
  memberMobileNumber?: string;
  applicantName: string;
  gaonName: string;
  applicantMobileNumber: string;
  bookedFor: string;
  eventName: string;
  bookingType: 'FULL_BHAVAN' | 'HALF_BHAVAN' | 'HALL_ONLY';
  bhavanName: string;
  remarks?: string;
};

/** Google Sheets columns A through M, in schema order. */
type GoogleSheetsBookingRow = [
  bookingDate: string,
  membershipNumber: string | number,
  memberName: string,
  memberMobileNumber: string,
  gaonName: string,
  applicantName: string,
  applicantMobileNumber: string,
  bookedFor: string,
  eventName: string,
  bookingType: CreateBookingRequestParams['bookingType'],
  bookingStatus: 'PENDING' | 'CONFIRMED',
  paymentStatus: 'PENDING' | 'PAID',
  remarks: string,
];

export async function createBookingRequest({
  membershipNumber,
  memberName = '',
  memberMobileNumber = '',
  applicantName,
  gaonName,
  applicantMobileNumber,
  bookedFor,
  eventName,
  bookingType,
  bhavanName,
  remarks = '',
}: CreateBookingRequestParams) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!spreadsheetId) {
    throw new Error(
      'GOOGLE_SHEET_ID is missing from environment variables. Please check your .env.local file.',
    );
  }

  const timestamp = format(new Date(), 'dd/MM/yyyy HH:mm:ss');
  const row: GoogleSheetsBookingRow = [
    timestamp,
    membershipNumber,
    memberName,
    memberMobileNumber,
    gaonName,
    applicantName,
    applicantMobileNumber,
    bookedFor,
    EVENT_NAME_MAP[eventName] || eventName,
    bookingType,
    'PENDING',
    'PENDING',
    [remarks, `Requested for ${bhavanName}`].filter(Boolean).join(' | '),
  ];

  const sheets = getSheetsClient();

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "'Booking_Requests'!A:M",
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });
}

export type SaveDirectoryRequestParams = {
  membershipNumber: string | number;
  memberName: string;
  memberMobileNumber: string;
  gaonName: string;
  applicantName: string;
  applicantMobileNumber: string;
  changeDetail: 'MobileNumber' | 'Address' | 'Both';
  updatedDetails: string;
};

export async function saveDirectoryRequest({
  membershipNumber,
  memberName,
  memberMobileNumber,
  gaonName,
  applicantName,
  applicantMobileNumber,
  changeDetail,
  updatedDetails,
}: SaveDirectoryRequestParams) {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEET_ID is missing from environment variables.');
  }

  const timestamp = format(new Date(), 'dd/MM/yyyy HH:mm:ss');
  const row = [
    membershipNumber,
    memberName,
    memberMobileNumber,
    gaonName,
    applicantName,
    applicantMobileNumber,
    changeDetail,
    timestamp,
    updatedDetails,
    'PENDING',
  ];

  const sheets = getSheetsClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "'Directory_Requests'!A:J",
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });
}
export interface DemiseRecord {
  date: string;
  name: string;
  village: string;
  address: string;
}

export async function getDemiseRecords(): Promise<DemiseRecord[]> {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) throw new Error('GOOGLE_SHEET_ID is missing.');

    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "'Demise'!A2:D",
    });

    return (response.data.values ?? [])
      .map((row) => ({
        date: String(row[0] ?? '').trim(),
        name: String(row[1] ?? '').trim(),
        village: String(row[2] ?? '').trim(),
        address: String(row[3] ?? '').trim(),
      }))
      .sort((a, b) => {
        const parse = (d: string) => {
          const [dd, mm, yyyy] = d.split('/');
          return new Date(Number(yyyy), Number(mm) - 1, Number(dd)).getTime();
        };
        return parse(b.date) - parse(a.date);
      });
  } catch (error) {
    console.error('Failed to fetch Demise records:', error);
    return [];
  }
}

export interface EkadashiBooking {
  date: string;
  maahAndPaksh: string;
  ekadashiNaam: string;
  day: string;
  whoBooked?: string;
  village?: string;
}

export async function getAllEkadashis(): Promise<EkadashiBooking[]> {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) throw new Error('GOOGLE_SHEET_ID is missing.');

    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "'Ekadashi'!A2:F",
    });

    return (response.data.values ?? [])
      .map((row) => ({
        date: String(row[0] ?? '').trim(),
        maahAndPaksh: String(row[1] ?? '').trim(),
        ekadashiNaam: String(row[2] ?? '').trim(),
        day: String(row[3] ?? '').trim(),
        whoBooked: String(row[4] ?? '').trim() || undefined,
        village: String(row[5] ?? '').trim() || undefined,
      }))
      .sort((a, b) => {
        const parse = (d: string) => {
          const [dd, mm, yyyy] = d.split('/');
          return new Date(Number(yyyy), Number(mm) - 1, Number(dd)).getTime();
        };
        return parse(a.date) - parse(b.date);
      });
  } catch (error) {
    console.error('Failed to fetch all Ekadashi records:', error);
    return [];
  }
}

export async function getUpcomingEkadashis(): Promise<EkadashiBooking[]> {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) throw new Error('GOOGLE_SHEET_ID is missing.');

    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "'Ekadashi'!A2:F",
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (response.data.values ?? []).flatMap((row) => {
      const raw = String(row[0] ?? '').trim();
      const [d, m, y] = raw.split('/');
      const date = new Date(Number(y), Number(m) - 1, Number(d));
      if (isNaN(date.getTime()) || date < today) return [];
      return [{
        date: raw,
        maahAndPaksh: String(row[1] ?? '').trim(),
        ekadashiNaam: String(row[2] ?? '').trim(),
        day: String(row[3] ?? '').trim(),
        whoBooked: String(row[4] ?? '').trim() || undefined,
        village: String(row[5] ?? '').trim() || undefined,
      }];
    });
  } catch (error) {
    console.error('Failed to fetch Ekadashi data:', error);
    return [];
  }
}

export async function getMembersFromDirectory(): Promise<
  { membershipNo: string; fullName: string; address: string; village: string; mobile: string }[]
> {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    if (!spreadsheetId) throw new Error('GOOGLE_SHEET_ID is missing.');

    const sheets = getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "'Directory'!A2:E",
    });

    return (response.data.values ?? []).map((row) => ({
      membershipNo: row[0] ?? '',
      fullName: row[1] ?? '',
      address: row[2] ?? '',
      village: row[3] ?? '',
      mobile: row[4] ?? '',
    }));
  } catch (error) {
    console.error('Failed to fetch members from Directory sheet:', error);
    return [];
  }
}

export async function getBhavanBookings(
  bhavanName: string,
): Promise<BhavanBooking[]> {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    if (!spreadsheetId) {
      throw new Error(
        'GOOGLE_SHEET_ID is missing from environment variables. Please check your .env.local file.',
      );
    }

    const sheets = getSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `'${bhavanName}'!A2:M`,
    });

    const rows = response.data.values ?? [];

    return rows.map((row): BhavanBooking => {
      const rawDate = row[0] ?? '';
      const parsedDate = parseSheetDate(rawDate);
      const bookingDate = isValid(parsedDate)
        ? format(parsedDate, 'yyyy-MM-dd')
        : rawDate;

      const rawBookedFor = row[7] ?? '';
      const parsedBookedFor = parseSheetDate(rawBookedFor);
      const bookedFor = isValid(parsedBookedFor)
        ? format(parsedBookedFor, 'yyyy-MM-dd')
        : rawBookedFor || undefined;

      return {
        bookingDate,
        bookedFor,
        membershipNumber: row[1] ?? '',
        memberName: row[2] ?? '',
        memberMobileNumber: row[3] ?? '',
        gaonName: row[4] ?? '',
        applicantName: row[5] ?? '',
        applicantMobileNumber: row[6] ?? '',
        eventName: SHEET_TO_EVENT_MAP[row[8] ?? ''] || row[8] || '',
        bookingType: row[9] as BhavanBooking['bookingType'],
        bookingStatus: row[10] as BhavanBooking['bookingStatus'],
        paymentStatus: row[11] as BhavanBooking['paymentStatus'],
        remarks: row[12] ?? '',
      };
    });
  } catch (error) {
    console.error(`Failed to fetch bookings for "${bhavanName}":`, error);
    return [];
  }
}

function parseSheetDate(value: string): Date {
  for (const dateFormat of ['dd/MM/yyyy HH:mm:ss', 'dd/MM/yyyy', 'yyyy-MM-dd']) {
    const parsedDate = parse(value, dateFormat, new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }

  return new Date('invalid');
}
