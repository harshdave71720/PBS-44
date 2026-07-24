import { getAllEkadashis } from '@/features/booking/repositories/googleSheetsRepository';
import { EkadashiListPage } from '@/features/ekadashi/EkadashiListPage';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const records = await getAllEkadashis();
  return <EkadashiListPage records={records} />;
}
