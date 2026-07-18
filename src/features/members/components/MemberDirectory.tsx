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

const MEMBERS_PER_PAGE = 50;

export function MemberDirectory({ initialMembers }: MemberDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredMembers = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return initialMembers;
    }

    return initialMembers.filter((member) => {
      const mobile = member.mobile.toLowerCase();
      const membershipNo = String(member.membershipNo).toLowerCase();

      return (
        mobile.includes(normalizedSearch) ||
        membershipNo.includes(normalizedSearch)
      );
    });
  }, [initialMembers, searchTerm]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredMembers.length / MEMBERS_PER_PAGE)
  );
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * MEMBERS_PER_PAGE;
  const paginatedMembers = filteredMembers.slice(
    startIndex,
    startIndex + MEMBERS_PER_PAGE
  );

  return (
    <div className="space-y-4">
      <h2 className="mb-4 text-2xl font-bold text-[#7A1C1C]">
        सदस्यों की सूची
      </h2>

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
              <TableHead className="border-r border-maroon-800/20 px-4 py-3 font-semibold text-[#7A1C1C]">
                सदस्यता क्र.
              </TableHead>
              <TableHead className="border-r border-maroon-800/20 px-4 py-3 font-semibold text-[#7A1C1C]">
                नाम
              </TableHead>
              <TableHead className="border-r border-maroon-800/20 px-4 py-3 font-semibold text-[#7A1C1C]">
                निवास स्थान
              </TableHead>
              <TableHead className="border-r border-maroon-800/20 px-4 py-3 font-semibold text-[#7A1C1C]">
                मूलगांव
              </TableHead>
              <TableHead className="border-r border-maroon-800/20 px-4 py-3 font-semibold text-[#7A1C1C]">
                मोबाइल
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedMembers.map((member) => (
              <TableRow
                key={`${member.membershipNo}-${member.mobile}-${member.fullName}`}
                className="border-b border-maroon-800/20 hover:bg-[#FFF8EE]"
              >
                <TableCell className="border-r border-maroon-800/20 px-4 py-3 align-top">
                  {member.membershipNo}
                </TableCell>
                <TableCell className="border-r border-maroon-800/20 px-4 py-3 align-top">
                  {member.fullName}
                </TableCell>
                <TableCell className="border-r border-maroon-800/20 px-4 py-3 align-top">
                  {member.address}
                </TableCell>
                <TableCell className="border-r border-maroon-800/20 px-4 py-3 align-top">
                  {member.village}
                </TableCell>
                <TableCell className="border-r border-maroon-800/20 px-4 py-3 align-top">
                  {member.mobile}
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
          onClick={() =>
            setCurrentPage((page) => Math.min(totalPages, page + 1))
          }
          disabled={safeCurrentPage === totalPages}
          className="rounded border px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
