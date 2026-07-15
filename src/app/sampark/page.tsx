import {
  MEMBER_CONTACTS,
  OFFICE_BEARER_CONTACTS,
  type ContactDirectoryEntry,
} from "@/data/contact-directory"

interface ContactDirectorySectionProps {
  title: string
  records: ContactDirectoryEntry[]
}

function ContactDirectorySection({ title, records }: ContactDirectorySectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-bold text-primary">{title}</h2>

      <div className="hidden overflow-x-auto rounded-xl border border-border bg-[#FFFDF7] shadow-[0_6px_20px_rgba(60,42,33,0.07)] md:block">
        <table className="min-w-full text-left text-sm text-foreground">
          <thead className="bg-[#F2E6CF] text-primary">
            <tr>
              <th className="px-4 py-3 font-semibold">क्र.</th>
              <th className="px-4 py-3 font-semibold">नाम</th>
              <th className="px-4 py-3 font-semibold">पद</th>
              <th className="px-4 py-3 font-semibold">गांव</th>
              <th className="px-4 py-3 font-semibold">मोबाइल नंबर</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={`${title}-${record.srNo}-${record.name}`} className="border-t border-border/70">
                <td className="px-4 py-3 align-top font-medium">{record.srNo}</td>
                <td className="px-4 py-3 align-top">{record.name}</td>
                <td className="px-4 py-3 align-top">{record.designation}</td>
                <td className="px-4 py-3 align-top">{record.village}</td>
                <td className="px-4 py-3 align-top">{record.mobile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {records.map((record) => (
          <article
            key={`${title}-mobile-${record.srNo}-${record.name}`}
            className="rounded-xl border border-border bg-[#FFFDF7] p-4 shadow-[0_6px_20px_rgba(60,42,33,0.07)]"
          >
            <p className="text-sm font-semibold text-primary">क्र. {record.srNo}</p>
            <p className="mt-2 text-base font-semibold text-foreground">{record.name}</p>
            <p className="mt-1 text-sm text-foreground">
              <span className="font-medium">पद:</span> {record.designation}
            </p>
            <p className="mt-1 text-sm text-foreground">
              <span className="font-medium">गांव:</span> {record.village}
            </p>
            <p className="mt-1 text-sm text-foreground">
              <span className="font-medium">मोबाइल नंबर:</span> {record.mobile}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default function SamparkPage() {
  return (
    <section className="bg-background py-10 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-secondary/80 bg-[#FFFAF0] p-6 shadow-[0_10px_30px_rgba(60,42,33,0.10)] sm:p-8">
          <h1 className="text-3xl font-bold text-primary sm:text-4xl">संपर्क</h1>
          <p className="mt-3 text-base font-medium text-foreground sm:text-lg">
            श्री पालीवाल ब्राह्मण समाज पंचायत 44 श्रेणी ( रजि. ), इंदौर
          </p>
          <p className="mt-2 text-sm text-primary">
            पंजीयन क्रमांक : <span className="font-semibold">03/27/03/08161/31-12-04</span>
          </p>
          <p className="mt-3 whitespace-pre-line text-sm text-foreground">
            42, जूना तुकोगंज,{"\n"}महाराणा प्रताप मार्ग,{"\n"}इंदौर (म.प्र.)
          </p>
        </div>

        <div className="mt-8 space-y-8">
          <ContactDirectorySection title="प्रबंध कार्यकारिणी" records={OFFICE_BEARER_CONTACTS} />
          <ContactDirectorySection title="कार्यकारिणी सदस्य" records={MEMBER_CONTACTS} />
        </div>
      </div>
    </section>
  )
}

