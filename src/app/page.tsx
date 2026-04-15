import { Suspense } from 'react';
import { apiClient } from '@/lib/api';
import MangaCard from '@/components/MangaCard';
import Pagination from '@/components/Pagination';
import Header from '@/components/Header';

interface HomePageProps {
  searchParams: Promise<{ source?: string; page?: string }>;
}

async function MangaListContent({ source, page }: { source: string; page: number }) {
  try {
    let data;
    
    if (source === 'komikcast') {
      data = await apiClient.getKomikcastLatest(page);
    } else {
      // Always fetch popular (hot) manga
      data = await apiClient.getKomikuLatest(page, 'hot');
    }

    if (!data.data || data.data.length === 0) {
      return <div className="col-span-full text-center text-gray-500">Tidak ada data</div>;
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
            nextPage={data.next_page ? `/?source=${source}&page=${page + 1}` : null}
            prevPage={page > 1 ? `/?source=${source}&page=${page - 1}` : null}
            currentPage={page}
          />
        </div>
      </>
    );
  } catch (error) {
    return (
      <div className="col-span-full rounded-lg bg-red-100 px-4 py-6 text-center text-red-600">
        Gagal memuat data. Pastikan API server berjalan di http://localhost:4000
      </div>
    );
  }
}

function LoadingSketch() {
  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Loading title animation */}
      <div className="animate-pulse">
        <div className="h-5 sm:h-6 lg:h-8 w-40 sm:w-48 lg:w-64 rounded bg-gray-800" />
        <div className="mt-1 sm:mt-2 h-3 sm:h-4 w-48 sm:w-64 lg:w-96 rounded bg-gray-800" />
      </div>
      
      {/* Loading grid */}
      <div className="grid gap-2 sm:gap-3 lg:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="animate-pulse space-y-1">
            <div className="h-40 sm:h-56 lg:h-64 w-full rounded-lg bg-gray-800" />
            <div className="h-2 sm:h-3 rounded bg-gray-800" />
            <div className="h-2 sm:h-3 w-5/6 rounded bg-gray-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const source = params.source || 'komiku';
  const page = parseInt(params.page || '1');

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <div className="mx-auto max-w-7xl px-2 py-4 sm:px-3 sm:py-6 lg:px-4 lg:py-12">
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white">
              📖 Manga Populer
            </h1>
            <p className="mt-0.5 sm:mt-1 lg:mt-2 text-xs sm:text-sm lg:text-base text-gray-400">
              Koleksi manga dan komik yang sedang trending
            </p>
          </div>

          <Suspense fallback={<LoadingSketch />}>
            <MangaListContent source={source} page={page} />
          </Suspense>
        </div>
      </main>
    </>
  );
}
