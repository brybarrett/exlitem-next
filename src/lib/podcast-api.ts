import {
  PodcastListResponse,
  PodcastDetailResponse,
  PodcastFilters,
  PodcastEpisode
} from '@/types/podcast';

const PODCAST_API_BASE_URL = 'https://api.jurimatic.com/articles';
const DOMAIN = 'exlitem.com';
const CONTENT_TYPE = 'podcasts';

// Cache configuration
const CACHE_DURATION = 300; // 5 minutes in seconds
const cache = new Map<string, { data: any; timestamp: number }>();

function getCacheKey(url: string): string {
  return url;
}

function getFromCache<T>(key: string): T | null {
  const cached = cache.get(key);
  if (!cached) return null;

  const now = Date.now();
  const age = (now - cached.timestamp) / 1000;

  if (age > CACHE_DURATION) {
    cache.delete(key);
    return null;
  }

  return cached.data as T;
}

function setCache(key: string, data: any): void {
  cache.set(key, {
    data,
    timestamp: Date.now()
  });
}

export async function fetchPodcastEpisodes(
  filters: PodcastFilters = {}
): Promise<PodcastListResponse> {
  const {
    page = 1,
    size = 9,
    sort_by = 'publish_date',
    sort_order = 'desc',
    season,
    search
  } = filters;

  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sort_by,
    sort_order,
    domain: DOMAIN,
    content_type: CONTENT_TYPE
  });

  if (season) {
    params.append('season', season.toString());
  }

  if (search) {
    params.append('search', search);
  }

  const url = `${PODCAST_API_BASE_URL}?${params.toString()}`;
  const cacheKey = getCacheKey(url);

  // Check cache first
  const cached = getFromCache<PodcastListResponse>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(url, {
      next: { revalidate: CACHE_DURATION }
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch podcast episodes: ${response.statusText}`
      );
    }

    const data: PodcastListResponse = await response.json();

    // Process and enrich podcast episodes
    const enrichedResults = data.results.map((episode) => ({
      ...episode,
      listening_time: calculateListeningTime(episode.duration)
    }));

    const enrichedData = {
      ...data,
      results: enrichedResults
    };

    // Cache the response
    setCache(cacheKey, enrichedData);

    return enrichedData;
  } catch (error) {
    console.error('Error fetching podcast episodes:', error);
    throw error;
  }
}

export async function fetchPodcastEpisode(
  slug: string
): Promise<PodcastDetailResponse> {
  const url = `${PODCAST_API_BASE_URL}/slug/${slug}?domain=${DOMAIN}&content_type=${CONTENT_TYPE}`;
  const cacheKey = getCacheKey(url);

  // Check cache first
  const cached = getFromCache<PodcastDetailResponse>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(url, {
      next: { revalidate: CACHE_DURATION }
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch podcast episode: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Handle the response structure
    let podcastData: PodcastDetailResponse;

    // The API returns the episode in a 'results' object
    if (data.results) {
      const episode = data.results as PodcastEpisode;
      episode.listening_time = calculateListeningTime(episode.duration);

      podcastData = {
        level: data.level || 'success',
        detail: data.detail || 'Episode fetched successfully',
        results: episode
      };
    } else if (data.id && data.title) {
      // If the response is the episode itself
      const episode = data as PodcastEpisode;
      episode.listening_time = calculateListeningTime(episode.duration);
      podcastData = {
        level: 'success',
        detail: 'Episode fetched successfully',
        results: episode
      };
    } else {
      throw new Error('Invalid podcast episode response structure');
    }

    // Cache the response
    setCache(cacheKey, podcastData);

    return podcastData;
  } catch (error) {
    console.error('Error fetching podcast episode:', error);
    throw error;
  }
}

export async function fetchFeaturedEpisodes(): Promise<PodcastEpisode[]> {
  try {
    const response = await fetchPodcastEpisodes({
      size: 5,
      sort_by: 'publish_date',
      sort_order: 'desc'
    });

    // Return episodes marked as featured or just the latest episodes
    return response.results
      .filter((episode) => episode.is_featured)
      .slice(0, 3);
  } catch (error) {
    console.error('Error fetching featured episodes:', error);
    return [];
  }
}

export async function fetchRelatedEpisodes(
  currentSlug: string,
  categories: string[] = [],
  limit: number = 3
): Promise<PodcastEpisode[]> {
  try {
    // Fetch more episodes than needed to filter out the current one
    const response = await fetchPodcastEpisodes({
      size: limit + 5,
      sort_by: 'publish_date',
      sort_order: 'desc'
    });

    // Filter out current episode and limit results
    const relatedEpisodes = response.results
      .filter((episode) => episode.slug !== currentSlug)
      .slice(0, limit);

    return relatedEpisodes;
  } catch (error) {
    console.error('Error fetching related episodes:', error);
    return [];
  }
}

// Utility function to calculate listening time from duration string
function calculateListeningTime(duration: string): number {
  if (!duration) return 0;

  // Duration format: "HH:MM:SS"
  const parts = duration.split(':');
  if (parts.length !== 3) return 0;

  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;
  const seconds = parseInt(parts[2], 10) || 0;

  // Return total minutes (rounded up)
  return Math.ceil(hours * 60 + minutes + seconds / 60);
}

// Format duration for display
export function formatDuration(duration: string): string {
  if (!duration) return '';

  const parts = duration.split(':');
  if (parts.length !== 3) return duration;

  const hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes} min`;
}

// Get episode number with proper formatting
export function formatEpisodeNumber(episodeNumber: number): string {
  return `Episode ${episodeNumber.toString().padStart(3, '0')}`;
}

// Extract seasons from episodes
export function extractSeasons(episodes: PodcastEpisode[]): number[] {
  const seasons = new Set<number>();

  episodes.forEach((episode) => {
    if (episode.season) {
      seasons.add(episode.season);
    }
  });

  return Array.from(seasons).sort((a, b) => b - a);
}

// Get all episode slugs for static generation
export async function getAllPodcastSlugs(): Promise<string[]> {
  try {
    const allSlugs: string[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetchPodcastEpisodes({ page, size: 50 });
      allSlugs.push(...response.results.map((episode) => episode.slug));

      hasMore = page < response.pages;
      page++;
    }

    return allSlugs;
  } catch (error) {
    console.error('Error fetching all podcast slugs:', error);
    return [];
  }
}

// Podcast subscription platforms
export const PODCAST_PLATFORMS = [
  {
    name: 'Apple Podcasts',
    url: 'https://podcasts.apple.com/us/podcast/on-the-stand-with-ashish-arun/id1707682303'
  },
  {
    name: 'Spotify',
    url: 'https://open.spotify.com/show/6nmiVh4GTid1upu8fKmOEq'
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/playlist?list=PLRnAEqUsiCMCIj2pjAZU9efUS0t4RXcXq'
  },
  {
    name: 'Substack',
    url: 'https://exlitem.substack.com/s/on-the-stand-with-ashish-arun'
  },
  {
    name: 'RSS Feed',
    url: 'https://api.substack.com/feed/podcast/4314864/s/196757/private/2ff15226-9046-4c7f-a445-a3182929e772.rss'
  }
];
