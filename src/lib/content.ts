// Client-side content management utilities

import type { CategoryContent, ContentLoadOptions } from '@/types/content';

// Client-side content cache for performance
const contentCache = new Map<
  string,
  { content: CategoryContent; expiresAt: number }
>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches content from API with caching
 */
async function fetchContentFromAPI(
  category: string,
  subcategory?: string,
  forceFresh = false
): Promise<CategoryContent> {
  const url = subcategory
    ? `/api/content/${category}/${subcategory}`
    : `/api/content/${category}`;

  const params = new URLSearchParams();
  if (forceFresh) {
    params.set('forceFresh', 'true');
  }

  const finalUrl = params.toString() ? `${url}?${params.toString()}` : url;

  const response = await fetch(finalUrl);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch content: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Main function to load expert guide content (client-side)
 */
export async function loadExpertGuideContent(
  category: string,
  subcategory?: string,
  options: ContentLoadOptions = {}
): Promise<CategoryContent> {
  const { forceFresh = false } = options;

  try {
    const cacheKey = `${category}${subcategory ? `/${subcategory}` : ''}`;

    // Check cache first (unless forceFresh is true)
    if (!forceFresh) {
      const cached = contentCache.get(cacheKey);
      if (cached && Date.now() < cached.expiresAt) {
        return cached.content;
      }
    }

    // Fetch from API
    const content = await fetchContentFromAPI(
      category,
      subcategory,
      forceFresh
    );

    // Cache the result
    contentCache.set(cacheKey, {
      content,
      expiresAt: Date.now() + CACHE_DURATION
    });

    return content;
  } catch (error) {
    console.error('Error loading expert guide content:', error);

    // Return error state
    return {
      category,
      subcategory,
      guide: {
        metadata: {
          title: 'Expert Witness Guide',
          description: 'Expert witness information',
          category,
          subcategory,
          lastUpdated: new Date().toISOString()
        },
        overview: '',
        sections: [],
        faqs: []
      },
      experts: [],
      totalExperts: 0,
      isLoading: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Preloads content for popular categories
 */
export async function preloadPopularContent(): Promise<void> {
  const popularCategories = [
    { category: 'medical' },
    { category: 'medical', subcategory: 'forensic-psychiatry' },
    { category: 'engineering' },
    { category: 'accounting-finance' }
  ];

  await Promise.allSettled(
    popularCategories.map(({ category, subcategory }) =>
      loadExpertGuideContent(category, subcategory)
    )
  );
}

/**
 * Clears content cache
 */
export function clearContentCache(): void {
  contentCache.clear();
}

/**
 * Gets cache statistics
 */
export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: contentCache.size,
    keys: Array.from(contentCache.keys())
  };
}
