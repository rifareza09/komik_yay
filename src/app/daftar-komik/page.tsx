'use client';

import Header from '@/components/Header';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');

export default function DaftarKomikPage() {
  const [selectedLetter, setSelectedLetter] = useState('A');
  const [allManga, setAllManga] = useState<Array<{ title: string; param: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch manga from API
  useEffect(() => {
    const fetchManga = async () => {
      try {
        setLoading(true);
        const mangaSet = new Set<string>(); // To avoid duplicates
        const mangaList: Array<{ title: string; param: string }> = [];

        console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);

        // Fetch multiple pages to get more manga
        for (let page = 1; page <= 5; page++) {
          try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/komiku?page=${page}`;
            console.log(`Fetching: ${url}`);
            
            const res = await fetch(url);
            
            if (!res.ok) {
              console.error(`API Error (page ${page}):`, res.status, res.statusText);
              continue;
            }
            
            const data = await res.json();
            console.log(`Page ${page} data:`, data);

            if (data.data && Array.isArray(data.data)) {
              data.data.forEach((manga: any) => {
                if (manga.title && manga.param && !mangaSet.has(manga.param)) {
                  mangaList.push({
                    title: manga.title,
                    param: manga.param,
                  });
                  mangaSet.add(manga.param);
                }
              });
            }
          } catch (pageError) {
            console.error(`Error fetching page ${page}:`, pageError);
            continue;
          }
        }

        console.log('Final manga list:', mangaList);
        setAllManga(mangaList);
        setError(null);
      } catch (err) {
        console.error('Error fetching manga:', err);
        setError(`Gagal memuat daftar komik: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setAllManga([]);
      } finally {
        setLoading(false);
      }
    };

    fetchManga();
  }, []);

  const filteredManga = useMemo(() => {
    return allManga
      .filter((manga) => {
        const firstLetter = manga.title.charAt(0).toUpperCase();
        if (selectedLetter === '#') {
          return /[0-9]/.test(manga.title.charAt(0));
        }
        return firstLetter === selectedLetter;
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [allManga, selectedLetter]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <div className="mx-auto max-w-7xl px-2 py-4 sm:px-3 sm:py-6 lg:px-4 lg:py-12">
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 lg:mb-8">Daftar Komik</h1>

          {/* Alphabet Filter */}
          <div className="mb-4 sm:mb-6 lg:mb-8 flex flex-wrapgap-1 sm:gap-2 rounded-lg bg-gray-800 p-2 sm:p-3 lg:p-4 overflow-x-auto">
            {ALPHABET.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`px-2 sm:px-3 py-1 sm:py-2 rounded font-semibold transition text-xs sm:text-sm lg:text-base whitespace-nowrap ${
                  selectedLetter === letter
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Manga List */}
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 lg:mb-4">
              Dimulai dengan "{selectedLetter}" ({filteredManga.length})
            </h2>

            {loading ? (
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-10 sm:h-12 rounded-lg bg-gray-800 animate-pulse"
                  />
                ))}
              </div>
            ) : error ? (
              <p className="text-red-400 p-4">{error}</p>
            ) : filteredManga.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 sm:gap-2 lg:gap-3">
                {filteredManga.map((manga, idx) => (
                  <Link
                    key={idx}
                    href={`/detail/${manga.param}?source=komiku`}
                    className="p-2 sm:p-3 lg:p-4 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition border border-gray-700 hover:border-red-600"
                  >
                    <div className="font-semibold truncate text-xs sm:text-sm lg:text-base">{manga.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5 truncate">{manga.param}</div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 p-4">
                Tidak ada komik yang dimulai dengan "{selectedLetter}"
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
