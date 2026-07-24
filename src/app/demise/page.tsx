import { getDemiseRecords } from '@/features/booking/repositories/googleSheetsRepository';
import { DemisePage } from '@/features/demise/DemisePage';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const records = await getDemiseRecords();
  return <DemisePage records={records} />;
}
