const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Request deduplication map to avoid duplicate simultaneous requests
const requestCache = new Map<string, Promise<any>>();

export interface Manga {
  title: string;
  description: string;
  latest_chapter: string;
  thumbnail: string;
  param: string;
  detail_url: string;
}

export interface MangaResponse {
  next_page: string | null;
  prev_page: string | null;
  data: Manga[];
}

export interface AnimeResponse {
  data: any[];
  error?: any;
}

// Helper to deduplicate requests
async function fetchWithCache<T>(url: string, cacheDuration: number = 60000): Promise<T> {
  // Check if we already have a pending request for this URL
  if (requestCache.has(url)) {
    return requestCache.get(url)!;
  }

  // Create the fetch promise
  const promise = fetch(url)
    .then(async (res) => {
      if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
      return res.json() as Promise<T>;
    })
    .finally(() => {
      // Remove from cache after a short duration
      setTimeout(() => requestCache.delete(url), cacheDuration);
    });

  // Store the promise to deduplicate concurrent requests
  requestCache.set(url, promise);
  return promise;
}

export const apiClient = {
  async getKomikuLatest(page: number = 1, tag: string = 'hot', genre?: string) {
    let url = `${API_URL}/komiku?page=${page}&tag=${tag}`;
    if (genre) {
      url += `&genre=${genre}`;
    }
    const res = await fetchWithCache<MangaResponse>(url);
    return res;
  },

  async getKomikuSearch(query: string, page: number = 1) {
    const res = await fetch(`${API_URL}/komiku?s=${encodeURIComponent(query)}&page=${page}`);
    if (!res.ok) throw new Error('Failed to search Komiku');
    return (await res.json()) as MangaResponse;
  },

  async getKomikuDetail(param: string) {
    const res = await fetch(`${API_URL}/komiku/${param}`);
    if (!res.ok) throw new Error('Failed to fetch Komiku detail');
    const data = await res.json();
    console.log('Komiku detail response:', data);
    // If response has "data" field, extract it
    return data.data || data;
  },

  async getKomikuChapter(param: string) {
    const res = await fetch(`${API_URL}/komiku/chapter/${param}`);
    if (!res.ok) throw new Error('Failed to fetch chapter');
    return (await res.json()) as any;
  },

  async getKomikcastLatest(page: number = 1) {
    const res = await fetch(`${API_URL}/komikcast?page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch Komikcast');
    return (await res.json()) as MangaResponse;
  },

  async getKomikcastSearch(query: string, page: number = 1) {
    const res = await fetch(`${API_URL}/komikcast?s=${encodeURIComponent(query)}&page=${page}`);
    if (!res.ok) throw new Error('Failed to search Komikcast');
    return (await res.json()) as MangaResponse;
  },

  async getKomikcastDetail(param: string) {
    const res = await fetch(`${API_URL}/komikcast/${param}`);
    if (!res.ok) throw new Error('Failed to fetch Komikcast detail');
    const data = await res.json();
    console.log('Komikcast detail response:', data);
    // If response has "data" field, extract it
    return data.data || data;
  },

  async getAnoboyLatest(page: number = 1) {
    const res = await fetch(`${API_URL}/anoboy?page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch Anoboy');
    return (await res.json()) as AnimeResponse;
  },

  async getAnoboySearch(query: string, page: number = 1) {
    const res = await fetch(`${API_URL}/anoboy?s=${encodeURIComponent(query)}&page=${page}`);
    if (!res.ok) throw new Error('Failed to search Anoboy');
    return (await res.json()) as AnimeResponse;
  },

  async getAnoboyDetail(param: string) {
    const res = await fetch(`${API_URL}/anoboy/${param}`);
    if (!res.ok) throw new Error('Failed to fetch Anoboy detail');
    return (await res.json()) as any;
  },
};
