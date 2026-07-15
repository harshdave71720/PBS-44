import {
  COMMITTEE_MEMBERS,
  OFFICE_BEARERS,
} from "@/data/executive-committee"
import { ExecutiveCommitteeCard } from "@/features/executive-committee/ExecutiveCommitteeCard"

export function ExecutiveCommitteePage() {
  return (
    <section className="bg-[#FFF9EF] py-10 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="rounded-2xl border border-[#C8A24A]/40 bg-white p-6 shadow-[0_10px_30px_rgba(127,0,0,0.08)] sm:p-8">
          <h1 className="text-3xl font-bold text-[#7F0000] sm:text-4xl">प्रबंध कार्यकारिणी</h1>
          <p className="mt-3 text-base font-medium text-[#5A1010] sm:text-lg">
            श्री पालीवाल ब्राह्मण समाज पंचायत 44 श्रेणी ( रजि. ), इंदौर
          </p>
          <p className="mt-2 text-sm text-[#7F0000]">
            पंजीयन क्रमांक : <span className="font-semibold">03/27/03/08161/31-12-04</span>
          </p>
          <p className="mt-3 whitespace-pre-line text-sm text-[#5A1010]">
            42, जूना तुकोगंज,{"\n"}महाराणा प्रताप मार्ग,{"\n"}इंदौर (म.प्र.)
          </p>
        </header>

        <div className="mt-10 space-y-12">
          <section>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-[#7F0000]">प्रबंध कार्यकारिणी</h2>
              <span className="rounded-full bg-[#7F0000] px-3 py-1 text-xs font-semibold text-white">
                पदाधिकारी
              </span>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {OFFICE_BEARERS.map((member, index) => (
                <ExecutiveCommitteeCard
                  key={`${member.imageKey}-${member.name}`}
                  member={member}
                  highlighted
                  index={index}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-[#7F0000]">कार्यकारिणी सदस्य</h2>
              <span className="rounded-full bg-[#C8A24A]/30 px-3 py-1 text-xs font-semibold text-[#7F0000]">
                सदस्य
              </span>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {COMMITTEE_MEMBERS.map((member, index) => (
                <ExecutiveCommitteeCard
                  key={`${member.imageKey}-${member.name}`}
                  member={member}
                  index={index}
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  )
}

