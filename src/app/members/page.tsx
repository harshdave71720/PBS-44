import membersData from '@/data/members.json';
import { MemberDirectory } from '@/features/members/components/MemberDirectory';

export default function MembersPage() {
  return (
    <section className="bg-background py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <MemberDirectory initialMembers={membersData} />
      </div>
    </section>
  );
}
