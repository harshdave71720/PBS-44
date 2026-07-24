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
import type { DemiseRecord } from '@/features/booking/repositories/googleSheetsRepository';

export function DemisePage({ records }: { records: DemiseRecord[] }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.village.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q),
    );
  }, [records, search]);

  return (
    <section className="bg-[#FFFDF7] py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#7A1C1C] sm:text-3xl">
            दिवंगत आत्माएं / शोक संदेश
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            समाज के दिवंगत सदस्यों की सूची एवं विवरण
          </p>
          <div className="mt-3 flex justify-center gap-1">
            <span className="h-1 w-12 rounded-full bg-accent" />
            <span className="h-1 w-4 rounded-full bg-secondary" />
            <span className="h-1 w-2 rounded-full bg-primary/40" />
          </div>
        </div>

        <Input
          placeholder="नाम, मूलगांव या पते से खोजें..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6"
        />

        <div className="overflow-x-auto rounded-xl border border-maroon-800/20 bg-[#FFFDF7] shadow-[0_6px_20px_rgba(60,42,33,0.07)]">
          <Table className="border border-maroon-800/20 bg-[#FFFDF7]">
            <TableHeader className="bg-[#EBDCC5] text-[#7A1C1C]">
              <TableRow className="border-b border-maroon-800/20 hover:bg-transparent">
                <TableHead className="border-r border-maroon-800/20 px-4 py-3 font-semibold text-[#7A1C1C]">दिनांक</TableHead>
                <TableHead className="border-r border-maroon-800/20 px-4 py-3 font-semibold text-[#7A1C1C]">नाम</TableHead>
                <TableHead className="border-r border-maroon-800/20 px-4 py-3 font-semibold text-[#7A1C1C]">मूलगांव</TableHead>
                <TableHead className="px-4 py-3 font-semibold text-[#7A1C1C]">निवास स्थान</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    कोई रिकॉर्ड नहीं मिला।
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r, i) => (
                  <TableRow
                    key={`${r.date}-${r.name}-${i}`}
                    className="border-b border-maroon-800/20 hover:bg-[#FFF8EE]"
                  >
                    <TableCell className="border-r border-maroon-800/20 px-4 py-3 align-top whitespace-nowrap">{r.date}</TableCell>
                    <TableCell className="border-r border-maroon-800/20 px-4 py-3 align-top font-medium">{r.name}</TableCell>
                    <TableCell className="border-r border-maroon-800/20 px-4 py-3 align-top">{r.village}</TableCell>
                    <TableCell className="px-4 py-3 align-top">{r.address}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          कुल {filtered.length} रिकॉर्ड
          {search ? ` (${records.length} में से)` : ''}
        </p>
      </div>
    </section>
  );
}
