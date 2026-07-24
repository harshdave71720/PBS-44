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
import type { EkadashiBooking } from '@/features/booking/repositories/googleSheetsRepository';

export function EkadashiListPage({ records }: { records: EkadashiBooking[] }) {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter(
      (r) =>
        r.ekadashiNaam.toLowerCase().includes(q) ||
        r.maahAndPaksh.toLowerCase().includes(q) ||
        r.date.includes(q),
    );
  }, [records, search]);

  return (
    <section className="bg-[#FFFDF7] py-10 sm:py-14">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#7A1C1C] sm:text-3xl">
            एकादशी सूची एवं बुकिंग
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            वर्ष भर की समस्त एकादशी तिथियाँ एवं बुकिंग विवरण
          </p>
          <div className="mt-3 flex justify-center gap-1">
            <span className="h-1 w-12 rounded-full bg-accent" />
            <span className="h-1 w-4 rounded-full bg-secondary" />
            <span className="h-1 w-2 rounded-full bg-primary/40" />
          </div>
        </div>

        <Input
          placeholder="एकादशी नाम, पक्ष या दिनांक से खोजें..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6"
        />

        <div className="overflow-x-auto rounded-xl border border-maroon-800/20 bg-[#FFFDF7] shadow-[0_6px_20px_rgba(60,42,33,0.07)]">
          <Table className="border border-maroon-800/20 bg-[#FFFDF7]">
            <TableHeader className="bg-[#EBDCC5] text-[#7A1C1C]">
              <TableRow className="border-b border-maroon-800/20 hover:bg-transparent">
                <TableHead className="border-r border-maroon-800/20 px-4 py-3 font-semibold text-[#7A1C1C]">दिनांक एवं वार</TableHead>
                <TableHead className="border-r border-maroon-800/20 px-4 py-3 font-semibold text-[#7A1C1C]">माह एवं पक्ष</TableHead>
                <TableHead className="border-r border-maroon-800/20 px-4 py-3 font-semibold text-[#7A1C1C]">एकादशी नाम</TableHead>
                <TableHead className="px-4 py-3 font-semibold text-[#7A1C1C]">बुकिंग स्थिति</TableHead>
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
                    key={`${r.date}-${r.ekadashiNaam}-${i}`}
                    className="border-b border-maroon-800/20 hover:bg-[#FFF8EE]"
                  >
                    <TableCell className="border-r border-maroon-800/20 px-4 py-3 align-top whitespace-nowrap">
                      {r.date}{r.day ? ` (${r.day})` : ''}
                    </TableCell>
                    <TableCell className="border-r border-maroon-800/20 px-4 py-3 align-top">{r.maahAndPaksh}</TableCell>
                    <TableCell className="border-r border-maroon-800/20 px-4 py-3 align-top font-medium">{r.ekadashiNaam}</TableCell>
                    <TableCell className="px-4 py-3 align-top">
                      {r.whoBooked ? (
                        <span className="text-sm font-medium text-[#7A1C1C]">
                          🔒 बुक किया गया: {r.whoBooked}{r.village ? ` (${r.village})` : ''}
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-green-700">✅ उपलब्ध</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          कुल {filtered.length} रिकॉर्ड{search ? ` (${records.length} में से)` : ''}
        </p>
      </div>
    </section>
  );
}
