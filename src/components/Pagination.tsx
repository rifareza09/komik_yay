'use client';

import Link from 'next/link';

interface PaginationProps {
  nextPage: string | null;
  prevPage: string | null;
  currentPage: number;
}

export default function Pagination({ nextPage, prevPage, currentPage }: PaginationProps) {
  return (
    <div className="mt-8 flex justify-center gap-4">
      {prevPage && (
        <Link
          href={prevPage}
          className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 transition"
        >
          ← Sebelumnya
        </Link>
      )}

      <div className="flex items-center px-4 py-3 font-semibold text-gray-400">
        Halaman {currentPage}
      </div>

      {nextPage && (
        <Link
          href={nextPage}
          className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700 transition"
        >
          Selanjutnya →
        </Link>
      )}
    </div>
  );
}
