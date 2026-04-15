'use client';

import Link from 'next/link';
import { Manga } from '@/lib/api';

interface MangaCardProps {
  manga: Manga;
  href: string;
}

export default function MangaCard({ manga, href }: MangaCardProps) {
  return (
    <Link href={href}>
      <div className="group cursor-pointer overflow-hidden rounded-lg shadow-md transition-all hover:shadow-xl sm:hover:scale-105">
        <div className="relative h-40 sm:h-56 lg:h-64 w-full overflow-hidden bg-gray-200">
          <img
            src={manga.thumbnail}
            alt={manga.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-110"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="bg-gray-800 p-2 sm:p-3 lg:p-4">
          <h3 className="line-clamp-2 font-bold text-white group-hover:text-red-500 text-xs sm:text-sm lg:text-base">
            {manga.title}
          </h3>
          <p className="mt-0.5 sm:mt-1 lg:mt-2 line-clamp-2 text-xs text-gray-400 hidden sm:block">
            {manga.description}
          </p>
          <p className="mt-0.5 sm:mt-1 lg:mt-2 text-xs font-semibold text-red-500">
            {manga.latest_chapter}
          </p>
        </div>
      </div>
    </Link>
  );
}
