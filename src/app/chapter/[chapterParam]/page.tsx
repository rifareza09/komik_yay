import { apiClient } from '@/lib/api';
import Header from '@/components/Header';
import Link from 'next/link';
import { Suspense } from 'react';

interface ChapterPageProps {
  params: Promise<{ chapterParam: string }>;
  searchParams: Promise<{ manga?: string; source?: string }>;
}

async function ChapterContent({
  chapterParam,
  mangaParam,
  source,
}: {
  chapterParam: string;
  mangaParam: string;
  source: string;
}) {
  try {
    const images = await apiClient.getKomikuChapter(chapterParam);

    if (!images.data || images.data.length === 0) {
      return (
        <div className="rounded-lg bg-gray-800 px-4 py-6 text-center text-yellow-500">
          Tidak ada gambar chapter ditemukan
        </div>
      );
    }

    return (
      <div>
        <div className="mb-4 sm:mb-6 lg:mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg sm:text-2xl lg:text-2xl font-bold text-white">
            Membaca Chapter
          </h1>
          <Link
            href={`/detail/${mangaParam}?source=${source}`}
            className="rounded-lg bg-red-600 px-3 py-2 sm:px-4 sm:py-2 font-semibold text-white hover:bg-red-700 transition text-center sm:text-left text-xs sm:text-sm lg:text-base"
          >
            ← Kembali ke Detail
          </Link>
        </div>

        <div className="space-y-2 sm:space-y-3 lg:space-y-4">
          {images.data.map((imageUrl: string, idx: number) => (
            <div
              key={idx}
              className="flex justify-center"
            >
              <img
                src={imageUrl}
                alt={`Page ${idx + 1}`}
                className="max-w-2xl w-full h-auto object-contain rounded"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 lg:mt-12 text-center text-xs sm:text-sm lg:text-base text-gray-500">
          Total halaman: {images.data.length}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Chapter error:', error);
    return (
      <div className="rounded-lg bg-gray-800 px-4 py-6 text-center text-red-400">
        <p>Gagal memuat chapter.</p>
        <p className="mt-2 text-sm">
          {error instanceof Error ? error.message : 'Error tidak diketahui'}
        </p>
      </div>
    );
  }
}

export default async function ChapterPage({
  params,
  searchParams,
}: ChapterPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const mangaParam = resolvedSearchParams.manga || 'unknown';
  const source = resolvedSearchParams.source || 'komiku';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <div className="mx-auto w-full px-2 py-4 sm:px-3 sm:py-6 lg:max-w-6xl lg:px-4 lg:py-12">
          <Suspense fallback={<ChapterLoadingSketch />}>
            <ChapterContent
              chapterParam={resolvedParams.chapterParam}
              mangaParam={mangaParam}
              source={source}
            />
          </Suspense>
        </div>
      </main>
    </>
  );
}

function ChapterLoadingSketch() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-96 w-full rounded-lg bg-gray-300" />
        </div>
      ))}
    </div>
  );
}
