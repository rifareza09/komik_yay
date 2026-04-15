import { Suspense } from 'react';
import { apiClient } from '@/lib/api';
import MangaCard from '@/components/MangaCard';
import Pagination from '@/components/Pagination';
import Header from '@/components/Header';
import Link from 'next/link';

interface SearchPageProps {
  searchParams: Promise<{ q?: string; source?: string; page?: string }>;
}

async function SearchResults({
  query,
  source,
  page,
}: {
  query: string;
  source: string;
  page: number;
}) {
  try {
    let data;

    if (source === 'komikcast') {
      data = await apiClient.getKomikcastSearch(query, page);
    } else {
      data = await apiClient.getKomikuSearch(query, page);
    }

    if (!data.data || data.data.length === 0) {
      return (
        <div className="text-center">
          <p className="text-lg text-gray-400">Tidak ada hasil untuk "{query}"</p>
          <Link href="/" className="mt-4 inline-block text-red-600 hover:text-red-500">
            Kembali ke halaman utama
          </Link>
        </div>
      );
    }

    return (
      <>
        <div className="grid gap-2 sm:gap-3 lg:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {data.data.map((manga, idx) => (
            <MangaCard
              key={idx}
              manga={manga}
              href={`/detail/${manga.param}?source=${source}`}
            />
          ))}
        </div>
        <div className="mt-8 sm:mt-12">
        <Pagination
          nextPage={
            data.next_page ? `/search?q=${encodeURIComponent(query)}&source=${source}&page=${page + 1}` : null
          }
          prevPage={
            page > 1 ? `/search?q=${encodeURIComponent(query)}&source=${source}&page=${page - 1}` : null
          }
          currentPage={page}
        />
        </div>
      </>
    );
  } catch (error) {
    console.error('Search error:', error);
    return (
      <div className="rounded-lg bg-gray-800 px-4 py-6 text-center text-red-400">
        Gagal melakukan pencarian. Silakan coba lagi.
      </div>
    );
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || '';
  const source = params.source || 'komiku';
  const page = parseInt(params.page || '1');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <div className="mx-auto max-w-7xl px-2 py-4 sm:px-3 sm:py-6 lg:px-4 lg:py-12">
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white">
              Hasil Pencarian: "{query}"
            </h1>
            <p className="mt-0.5 sm:mt-1 lg:mt-2 text-xs sm:text-sm lg:text-base text-gray-400">Sumber: {source}</p>
          </div>

          <Suspense fallback={<LoadingSketch />}>
            <SearchResults query={query} source={source} page={page} />
          </Suspense>
        </div>
      </main>
    </>
  );
}

function LoadingSketch() {
  return (
    <div className="grid gap-2 sm:gap-3 lg:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-40 sm:h-56 lg:h-64 w-full rounded-lg bg-gray-800" />
          <div className="mt-1 sm:mt-2 h-2 sm:h-3 rounded bg-gray-800" />
          <div className="mt-0.5 sm:mt-1 h-2 sm:h-3 w-5/6 rounded bg-gray-800" />
        </div>
      ))}
    </div>
  );
}
