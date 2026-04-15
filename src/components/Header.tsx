'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [source, setSource] = useState('komiku');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}&source=${source}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-black border-b border-gray-800">
      <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4">
        <div className="flex flex-col gap-3 sm:gap-6 md:flex-row md:items-center md:justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl sm:text-3xl font-bold text-red-600 hover:text-red-500 transition w-fit">
            ᴇᴊᴀᴘᴀᴡ
          </Link>

          {/* Navigation Menu */}
          <nav className="flex flex-wrap gap-2 sm:gap-3 md:gap-6">
            <Link
              href="/"
              className="text-xs sm:text-sm text-gray-300 hover:text-white transition font-medium px-2 py-1"
            >
              Beranda
            </Link>
            <Link
              href="/daftar-komik"
              className="text-xs sm:text-sm text-gray-300 hover:text-white transition font-medium px-2 py-1"
            >
              Daftar Komik
            </Link>
            <Link
              href="/genre/isekai"
              className="text-xs sm:text-sm text-gray-300 hover:text-white transition font-medium px-2 py-1"
            >
              Isekai
            </Link>
            <Link
              href="/genre/fantasy"
              className="text-xs sm:text-sm text-gray-300 hover:text-white transition font-medium px-2 py-1"
            >
              Fantasy
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Cari..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-sm sm:text-base rounded bg-gray-800 border border-gray-700 px-3 sm:px-4 py-2 text-white placeholder-gray-500 focus:border-red-600 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded bg-red-600 px-4 sm:px-6 py-2 font-semibold text-white hover:bg-red-700 transition text-sm sm:text-base whitespace-nowrap"
            >
              Cari
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
