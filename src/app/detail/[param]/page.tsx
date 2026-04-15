import { apiClient } from '@/lib/api';
import Header from '@/components/Header';
import Link from 'next/link';
import { Suspense } from 'react';

interface DetailPageProps {
  params: Promise<{ param: string }>;
  searchParams: Promise<{ source?: string }>;
}

async function DetailContent({ param, source }: { param: string; source: string }) {
  try {
    let data;

    if (source === 'komikcast') {
      data = await apiClient.getKomikcastDetail(param);
    } else {
      data = await apiClient.getKomikuDetail(param);
    }

    console.log('DetailContent received data:', data, 'param:', param, 'source:', source);

    if (!data || Object.keys(data).length === 0) {
      return (
        <div className="rounded-lg bg-gray-800 px-4 py-6 text-center text-yellow-500">
          <p>Data tidak ditemukan untuk: {param}</p>
          <p className="mt-2 text-sm">Sumber: {source}</p>
          <p className="mt-2 text-xs">Debug: {JSON.stringify(data)}</p>
        </div>
      );
    }

    // If we only have error field, show error
    if (data.error && !data.title) {
      return (
        <div className="rounded-lg bg-gray-800 px-4 py-6 text-center text-yellow-500">
          <p>API Error: {JSON.stringify(data.error)}</p>
          <p className="mt-2 text-sm">Sumber: {source}</p>
          <p className="mt-2 text-xs">Debug: {JSON.stringify(data)}</p>
        </div>
      );
    }

    return (
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="relative h-96 w-full overflow-hidden rounded-lg shadow-lg bg-gray-800">
            {data.thumbnail ? (
              <img
                src={data.thumbnail}
                alt={data.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-gray-400">
                Tidak ada gambar
              </div>
            )}
          </div>

          {data.rating && (
            <div className="mt-4 text-center">
              <span className="inline-block rounded-lg bg-yellow-100 px-4 py-2 font-bold text-yellow-700">
                ⭐ {data.rating}
              </span>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <h1 className="text-4xl font-bold text-white">{data.title || 'Judul Tidak Tersedia'}</h1>

          {data.description && (
            <p className="mt-4 text-gray-300">{data.description}</p>
          )}

          {data.genre && (
            <div className="mt-6">
              <h3 className="mb-2 font-bold text-white">Genre:</h3>
              <div className="flex flex-wrap gap-2">
                {(Array.isArray(data.genre) ? data.genre : [data.genre]).map(
                  (gen: string, idx: number) => (
                    <span
                      key={idx}
                      className="rounded-full bg-red-900 px-3 py-1 text-sm text-red-300"
                    >
                      {gen}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {data.author && (
            <div className="mt-4">
              <p className="text-gray-300">
                <span className="font-bold">Author:</span> {data.author}
              </p>
            </div>
          )}

          {data.status && (
            <div className="mt-4">
              <p className="text-gray-300">
                <span className="font-bold">Status:</span> {data.status}
              </p>
            </div>
          )}

          {data.latest_chapter && (
            <div className="mt-4">
              <p className="text-gray-300">
                <span className="font-bold">Chapter Terbaru:</span> {data.latest_chapter}
              </p>
            </div>
          )}

          {data.chapters && Array.isArray(data.chapters) && data.chapters.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-4 text-xl font-bold text-white">Daftar Chapter:</h3>
              <div className="max-h-96 space-y-2 overflow-y-auto rounded-lg border border-gray-700 bg-gray-800 p-4">
                {data.chapters.slice(0, 50).map((chapter: any, idx: number) => (
                  <Link
                    key={idx}
                    href={`/chapter/${chapter.param}?manga=${param}&source=${source}`}
                    className="block rounded px-3 py-2 text-red-500 hover:bg-gray-700 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{chapter.chapter}</span>
                      {chapter.release && (
                        <span className="text-xs text-gray-400">{chapter.release}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Link
            href={`/?source=${source}`}
            className="mt-8 inline-block rounded-lg bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700"
          >
            ← Kembali
          </Link>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Detail error:', error);
    return (
      <div className="rounded-lg bg-gray-800 px-4 py-6 text-center text-red-400">
        <p>Gagal memuat detail.</p>
        <p className="mt-2 text-sm">{error instanceof Error ? error.message : 'Error tidak diketahui'}</p>
        <p className="mt-2 text-sm">Param: {param} | Source: {source}</p>
      </div>
    );
  }
}

export default async function DetailPage({ params, searchParams }: DetailPageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const source = resolvedSearchParams.source || 'komiku';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <div className="mx-auto max-w-7xl px-2 py-4 sm:px-3 sm:py-6 lg:px-4 lg:py-12">
        <Suspense fallback={<DetailLoadingSketch />}>
          <DetailContent param={resolvedParams.param} source={source} />
        </Suspense>
        </div>
      </main>
    </>
  );
}

function DetailLoadingSketch() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      <div className="animate-pulse md:col-span-1">
        <div className="h-96 w-full rounded-lg bg-gray-300" />
      </div>
      <div className="md:col-span-2">
        <div className="h-8 w-2/3 rounded bg-gray-300" />
        <div className="mt-4 space-y-2">
          <div className="h-4 w-full rounded bg-gray-300" />
          <div className="h-4 w-full rounded bg-gray-300" />
          <div className="h-4 w-2/3 rounded bg-gray-300" />
        </div>
      </div>
    </div>
  );
}
