import { google } from 'googleapis';
import { parse, format, isValid } from 'date-fns';
import { BhavanBooking } from '@/features/booking/utils/availability';

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
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return google.sheets({ version: 'v4', auth });
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
      range: `'${bhavanName}'!A2:K`,
    });

    const rows = response.data.values ?? [];

    return rows.map((row): BhavanBooking => {
      const rawDate = row[0] ?? '';
      const parsedDate = parse(rawDate, 'dd/MM/yyyy', new Date());
      const bookingDate = isValid(parsedDate)
        ? format(parsedDate, 'yyyy-MM-dd')
        : rawDate;

      const rawBookedFor = row[5] ?? '';
      const parsedBookedFor = parse(rawBookedFor, 'dd/MM/yyyy', new Date());
      const bookedFor = isValid(parsedBookedFor)
        ? format(parsedBookedFor, 'yyyy-MM-dd')
        : rawBookedFor || undefined;

      return {
        bookingDate,
        bookedFor,
        membershipNumber: Number(row[1]),
        applicantName: row[2] ?? '',
        gaonName: row[3] ?? '',
        mobileNumber: row[4] ?? '',
        eventName: row[5] ?? '',
        foodRequired: row[6] ?? '',
        resourceType: row[7] as BhavanBooking['resourceType'],
        bookingStatus: row[8] as BhavanBooking['bookingStatus'],
        paymentStatus: row[9] as BhavanBooking['paymentStatus'],
        remarks: row[10] ?? '',
      };
    });
  } catch (error) {
    console.error(`Failed to fetch bookings for "${bhavanName}":`, error);
    return [];
  }
}
