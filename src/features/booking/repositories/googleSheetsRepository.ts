import { google } from 'googleapis';
import { BhavanBooking } from '@/features/booking/utils/availability';

function getSheetsClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  return google.sheets({ version: 'v4', auth });
}

export async function getBhavanBookings(
  bhavanName: string,
): Promise<BhavanBooking[]> {
  try {
    const sheets = getSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `'${bhavanName}'!A2:K`,
    });

    const rows = response.data.values ?? [];

    return rows.map((row): BhavanBooking => ({
      bookingDate: row[0] ?? '',
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
    }));
  } catch (error) {
    console.error(`Failed to fetch bookings for "${bhavanName}":`, error);
    return [];
  }
}
