import Header from '@/components/Header';
import Link from 'next/link';
import MangaCard from '@/components/MangaCard';
import { apiClient } from '@/lib/api';
import { Suspense } from 'react';

interface GenrePageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

const GENRES = {
  isekai: { name: 'Isekai', description: 'Cerita tentang pindah dunia' },
  fantasy: { name: 'Fantasy', description: 'Dunia fantasi penuh magic' },
  slice_of_life: { name: 'Slice of Life', description: 'Kehidupan sehari-hari' },
  action: { name: 'Action', description: 'Pertarungan dan aksi seru' },
  romance: { name: 'Romance', description: 'Cerita cinta romantis' },
  comedy: { name: 'Comedy', description: 'Komedi yang menghibur' },
  horror: { name: 'Horror', description: 'Cerita menakutkan' },
  mystery: { name: 'Mystery', description: 'Cerita misteri' },
};

async function GenreMangaContent({ genreSlug, page }: { genreSlug: string; page: number }) {
  try {
    // Convert slug to genre name (e.g., slice-of-life -> slice-of-life)
    const genreName = genreSlug.replace(/_/g, '-');
    
    // Fetch manga by genre from API
    const data = await apiClient.getKomikuLatest(page, 'hot', genreName);

    if (!data.data || data.data.length === 0) {
      return (
        <div className="col-span-full text-center text-gray-500 py-12">
          <p>Tidak ada manga ditemukan untuk genre ini</p>
        </div>
      );
    }

    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="grid gap-2 sm:gap-3 lg:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
          {data.data.map((manga, idx) => (
            <MangaCard
              key={idx}
              manga={manga}
              href={`/detail/${manga.param}?source=komiku&genre=${genreSlug}`}
            />
          ))}
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-4">
          {page > 1 && (
            <Link
              href={`/genre/${genreSlug}?page=${page - 1}`}
              className="rounded bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700 transition"
            >
              Sebelumnya
            </Link>
          )}
          <div className="flex items-center text-gray-400">
            Page {page}
          </div>
          {data.next_page && (
            <Link
              href={`/genre/${genreSlug}?page=${page + 1}`}
              className="rounded bg-red-600 px-6 py-2 font-semibold text-white hover:bg-red-700 transition"
            >
              Selanjutnya
            </Link>
          )}
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="col-span-full rounded-lg bg-gray-800 px-4 py-6 text-center text-red-400">
        <p>Gagal memuat manga. Pastikan API server berjalan.</p>
      </div>
    );
  }
}

function LoadingSketch() {
  return (
    <div className="grid gap-2 sm:gap-3 lg:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse space-y-1">
          <div className="h-40 sm:h-56 lg:h-64 w-full rounded-lg bg-gray-800" />
          <div className="h-2 sm:h-3 rounded bg-gray-800" />
          <div className="h-2 sm:h-3 w-5/6 rounded bg-gray-800" />
        </div>
      ))}
    </div>
  );
}

export default async function GenrePage({ params, searchParams }: GenrePageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const genre = GENRES[resolvedParams.slug as keyof typeof GENRES];
  const page = parseInt(resolvedSearchParams.page || '1');

  if (!genre) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-900">
          <div className="mx-auto max-w-7xl px-2 py-4 sm:px-3 sm:py-6 lg:px-4 lg:py-12">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white mb-4">Genre Tidak Ditemukan</h1>
            <Link href="/" className="text-red-600 hover:text-red-500">
              Kembali ke Beranda
            </Link>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-900">
        <div className="mx-auto max-w-7xl px-2 py-4 sm:px-3 sm:py-6 lg:px-4 lg:py-12">
          <div className="mb-4 sm:mb-6 lg:mb-8">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold text-white">{genre.name}</h1>
            <p className="mt-0.5 sm:mt-1 lg:mt-2 text-xs sm:text-sm lg:text-base text-gray-400">{genre.description}</p>
          </div>

          {/* Genre Links */}
          <div className="mb-6 sm:mb-8 lg:mb-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 sm:gap-2 md:gap-3">
            {Object.entries(GENRES).map(([slug, g]) => (
              <Link
                key={slug}
                href={`/genre/${slug}`}
                className={`p-1 sm:p-2 lg:p-4 rounded-lg transition text-xs sm:text-sm lg:text-base ${
                  resolvedParams.slug === slug
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {g.name}
              </Link>
            ))}
          </div>

          {/* Manga Grid */}
          <div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-3 sm:mb-4 lg:mb-6">Manga {genre.name}</h2>
            <Suspense fallback={<LoadingSketch />}>
              <GenreMangaContent genreSlug={resolvedParams.slug} page={page} />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}
