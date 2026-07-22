import { getMembersFromDirectory } from '@/features/booking/repositories/googleSheetsRepository';
import { MemberDirectory } from '@/features/members/components/MemberDirectory';

export const dynamic = 'force-dynamic';

export default async function MembersPage() {
  const members = await getMembersFromDirectory();

  return (
    <section className="bg-background py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <MemberDirectory initialMembers={members} />
      </div>
    </section>
  );
}
