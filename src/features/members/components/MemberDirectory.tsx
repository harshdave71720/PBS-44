'use client';

import { useMemo, useState } from 'react';
import {
  Input,
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui';

export interface Member {
  membershipNo: string | number;
  fullName: string;
  address: string;
  village: string;
  mobile: string;
}

interface MemberDirectoryProps {
  initialMembers: Member[];
}

interface UpdateForm {
  applicantName: string;
  applicantMobile: string;
  newMobile: string;
  newAddress: string;
}

type ChangeDetail = 'MobileNumber' | 'Address' | 'Both';

function computeChangeDetail(
  original: Member,
  form: UpdateForm,
): ChangeDetail | null {
  const mobileChanged = form.newMobile.trim() !== '' && form.newMobile.trim() !== original.mobile.trim();
  const addressChanged = form.newAddress.trim() !== '' && form.newAddress.trim() !== original.address.trim();
  if (mobileChanged && addressChanged) return 'Both';
  if (mobileChanged) return 'MobileNumber';
  if (addressChanged) return 'Address';
  return null;
}

function UpdateModal({
  member,
  onClose,
}: {
  member: Member;
  onClose: () => void;
}) {
  const [form, setForm] = useState<UpdateForm>({
    applicantName: '',
    applicantMobile: '',
    newMobile: member.mobile,
    newAddress: member.address,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const changeDetail = computeChangeDetail(member, form);
  const hasApplicantInfo = form.applicantName.trim() !== '' && form.applicantMobile.trim().length === 10;
  const canSubmit = changeDetail !== null && hasApplicantInfo && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !changeDetail) return;
    setSubmitting(true);
    setError('');

    const updatedParts: string[] = [];
    if (changeDetail === 'MobileNumber' || changeDetail === 'Both') {
      updatedParts.push(`Mobile: ${form.newMobile.trim()}`);
    }
    if (changeDetail === 'Address' || changeDetail === 'Both') {
      updatedParts.push(`Address: ${form.newAddress.trim()}`);
    }

    try {
      const res = await fetch('/api/directory-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          membershipNumber: member.membershipNo,
          memberName: member.fullName,
          memberMobileNumber: member.mobile,
          gaonName: member.village,
          applicantName: form.applicantName.trim(),
          applicantMobileNumber: form.applicantMobile.trim(),
          changeDetail,
          updatedDetails: updatedParts.join(' | '),
        }),
      });
      if (!res.ok) throw new Error('सर्वर त्रुटि');
      setSubmitted(true);
    } catch {
      setError('अनुरोध जमा नहीं हो सका। कृपया पुनः प्रयास करें।');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-[#FFFDF7] p-6 shadow-xl">
        {submitted ? (
          <div className="space-y-4 text-center">
            <p className="text-lg font-semibold text-primary">✅ अनुरोध सफलतापूर्वक जमा हो गया!</p>
            <p className="text-sm text-muted-foreground">
              प्रबंध समिति द्वारा अनुमोदन के बाद निर्देशिका में परिवर्तन दिखाई देंगे।
            </p>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md bg-[#7A1C1C] px-5 py-2 text-sm font-semibold text-white hover:bg-[#5e1515]"
            >
              बंद करें
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <strong>ध्यान दें:</strong> आपकी जानकारी अपडेट करने का अनुरोध सीधे प्रबंध समिति/एडमिन के पास जाएगा। एडमिन द्वारा अनुमोदन (Approval) के पश्चात ही निर्देशिका (Directory) में परिवर्तन दिखाई देंगे।
            </div>

            <div className="grid gap-1 rounded-lg border border-border bg-[#F7EAD3] p-3 text-sm">
              <p><strong>सदस्यता क्र.:</strong> {member.membershipNo}</p>
              <p><strong>नाम:</strong> {member.fullName}</p>
              <p><strong>मूलगांव:</strong> {member.village}</p>
            </div>

            <div className="grid gap-3">
              <div className="grid gap-1">
                <label className="text-sm font-medium">नया मोबाइल नंबर</label>
                <Input
                  inputMode="numeric"
                  maxLength={10}
                  value={form.newMobile}
                  onChange={(e) => setForm((f) => ({ ...f, newMobile: e.target.value.replace(/\D/g, '') }))}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-sm font-medium">नया पता (Address)</label>
                <Input
                  value={form.newAddress}
                  onChange={(e) => setForm((f) => ({ ...f, newAddress: e.target.value }))}
                />
              </div>

              {changeDetail === null && (form.newMobile !== member.mobile || form.newAddress !== member.address) ? null : null}
              {changeDetail === null && (
                <p className="text-sm text-amber-700">
                  कृपया परिवर्तन करने के लिए नया मोबाइल नंबर या पता दर्ज करें।
                </p>
              )}

              <div className="grid gap-1">
                <label className="text-sm font-medium">आवेदक का नाम <span className="text-destructive">*</span></label>
                <Input
                  value={form.applicantName}
                  onChange={(e) => setForm((f) => ({ ...f, applicantName: e.target.value }))}
                />
              </div>
              <div className="grid gap-1">
                <label className="text-sm font-medium">आवेदक का मोबाइल नंबर <span className="text-destructive">*</span></label>
                <Input
                  inputMode="numeric"
                  maxLength={10}
                  value={form.applicantMobile}
                  onChange={(e) => setForm((f) => ({ ...f, applicantMobile: e.target.value.replace(/\D/g, '') }))}
                />
              </div>
            </div>

            {error ? <p className="text-sm font-medium text-destructive">{error}</p> : null}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="flex-1 rounded-md bg-[#7A1C1C] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5e1515] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? 'जमा हो रहा है...' : 'अनुरोध भेजें'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-md border border-border bg-[#FFFDF7] px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-[#F7EAD3]"
              >
                रद्द करें
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const MEMBERS_PER_PAGE = 50;

export function MemberDirectory({ initialMembers }: MemberDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const filteredMembers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return initialMembers;
    return initialMembers.filter((member) => {
      const mobile = member.mobile.toLowerCase();
      const membershipNo = String(member.membershipNo).toLowerCase();
      return mobile.includes(normalizedSearch) || membershipNo.includes(normalizedSearch);
    });
  }, [initialMembers, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / MEMBERS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * MEMBERS_PER_PAGE;
  const paginatedMembers = filteredMembers.slice(startIndex, startIndex + MEMBERS_PER_PAGE);

  return (
    <div className="space-y-4">
      {selectedMember ? (
        <UpdateModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      ) : null}

      <h2 className="mb-4 text-2xl font-bold text-[#7A1C1C]">सदस्यों की सूची</h2>

      <Input
        placeholder="मोबाइल नंबर या सदस्यता क्र. से खोजें..."
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value);
          setCurrentPage(1);
        }}
      />

      <div className="overflow-x-auto rounded-xl border border-maroon-800/20 bg-[#FFFDF7] shadow-[0_6px_20px_rgba(60,42,33,0.07)]">
        <Table className="border border-maroon-800/20 bg-[#FFFDF7]">
          <TableHeader className="bg-[#EBDCC5] text-[#7A1C1C]">
            <TableRow className="border-b border-maroon-800/20 hover:bg-transparent">
              <TableHead className="border-r border-maroon-800/20 px-4 py-3 font-semibold text-[#7A1C1C]">सदस्यता क्र.</TableHead>
              <TableHead className="border-r border-maroon-800/20 px-4 py-3 font-semibold text-[#7A1C1C]">नाम</TableHead>
              <TableHead className="border-r border-maroon-800/20 px-4 py-3 font-semibold text-[#7A1C1C]">निवास स्थान</TableHead>
              <TableHead className="border-r border-maroon-800/20 px-4 py-3 font-semibold text-[#7A1C1C]">मूलगांव</TableHead>
              <TableHead className="border-r border-maroon-800/20 px-4 py-3 font-semibold text-[#7A1C1C]">मोबाइल</TableHead>
              <TableHead className="px-4 py-3 font-semibold text-[#7A1C1C]">अपडेट</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMembers.map((member) => (
              <TableRow
                key={`${member.membershipNo}-${member.mobile}-${member.fullName}`}
                className="border-b border-maroon-800/20 hover:bg-[#FFF8EE]"
              >
                <TableCell className="border-r border-maroon-800/20 px-4 py-3 align-top">{member.membershipNo}</TableCell>
                <TableCell className="border-r border-maroon-800/20 px-4 py-3 align-top">{member.fullName}</TableCell>
                <TableCell className="border-r border-maroon-800/20 px-4 py-3 align-top">{member.address}</TableCell>
                <TableCell className="border-r border-maroon-800/20 px-4 py-3 align-top">{member.village}</TableCell>
                <TableCell className="border-r border-maroon-800/20 px-4 py-3 align-top">{member.mobile}</TableCell>
                <TableCell className="px-4 py-3 align-top">
                  <button
                    type="button"
                    onClick={() => setSelectedMember(member)}
                    className="whitespace-nowrap rounded-md border border-[#7A1C1C] px-3 py-1 text-xs font-semibold text-[#7A1C1C] transition-colors hover:bg-[#FFF7E8]"
                  >
                    जानकारी अपडेट करें
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={safeCurrentPage === 1}
          className="rounded border px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-muted-foreground">
          Page {safeCurrentPage} of {totalPages}
        </span>
        <button
          type="button"
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          disabled={safeCurrentPage === totalPages}
          className="rounded border px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
