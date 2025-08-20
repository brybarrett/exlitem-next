import {
  BlogListResponse,
  BlogDetailResponse,
  BlogFilters,
  BlogPost,
  BlogCategory
} from '@/types/blog';

const BLOG_API_BASE_URL = 'https://api.jurimatic.com/articles';
const DOMAIN = 'exlitem.com';
const CONTENT_TYPE = 'blogs';

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

export async function fetchBlogPosts(
  filters: BlogFilters = {}
): Promise<BlogListResponse> {
  const {
    page = 1,
    size = 10,
    sort_by = 'publish_date',
    sort_order = 'desc',
    category,
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

  if (category) {
    params.append('category', category);
  }

  if (search) {
    params.append('search', search);
  }

  const url = `${BLOG_API_BASE_URL}?${params.toString()}`;
  const cacheKey = getCacheKey(url);

  // Check cache first
  const cached = getFromCache<BlogListResponse>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(url, {
      next: { revalidate: CACHE_DURATION }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.statusText}`);
    }

    const data: BlogListResponse = await response.json();

    // Process and enrich blog posts
    const enrichedResults = data.results.map((post) => ({
      ...post,
      reading_time: calculateReadingTime(post)
    }));

    const enrichedData = {
      ...data,
      results: enrichedResults
    };

    // Cache the response
    setCache(cacheKey, enrichedData);

    return enrichedData;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw error;
  }
}

export async function fetchBlogPost(slug: string): Promise<BlogDetailResponse> {
  const url = `${BLOG_API_BASE_URL}/slug/${slug}?domain=${DOMAIN}&content_type=${CONTENT_TYPE}`;
  const cacheKey = getCacheKey(url);

  // Check cache first
  const cached = getFromCache<BlogDetailResponse>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(url, {
      next: { revalidate: CACHE_DURATION }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch blog post: ${response.statusText}`);
    }

    const data = await response.json();

    // Handle different response structures
    let blogData: BlogDetailResponse;

    // The API returns the article in a 'results' object
    if (data.results) {
      const article = data.results as BlogPost;
      article.reading_time = calculateReadingTime(article);

      // Normalize author names
      if (article.authors) {
        article.authors = article.authors.map((author) => ({
          ...author,
          name:
            author.name ||
            `${author.first_name || ''} ${author.last_name || ''}`.trim()
        }));
      }

      blogData = {
        article: article,
        seo: article.seo || {},
        author: article.authors?.[0] || null,
        sections: article.sections || [],
        metadata: {
          created_at: article.created_at,
          updated_at: article.updated_at,
          is_active: true
        }
      };
    } else if (data.article) {
      // Fallback if the structure changes
      blogData = data as BlogDetailResponse;
      blogData.article.reading_time = calculateReadingTime(blogData.article);
    } else if (data.id && data.title) {
      // If the response is the article itself
      const article = data as BlogPost;
      article.reading_time = calculateReadingTime(article);
      blogData = {
        article: article,
        seo: article.seo || {},
        author: article.authors?.[0] || null,
        sections: article.sections || [],
        metadata: {
          created_at: article.created_at,
          updated_at: article.updated_at,
          is_active: true
        }
      };
    } else {
      throw new Error('Invalid blog post response structure');
    }

    // Cache the response
    setCache(cacheKey, blogData);

    return blogData;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    throw error;
  }
}

export async function fetchRelatedPosts(
  currentSlug: string,
  categories: string[] = [],
  limit: number = 3
): Promise<BlogPost[]> {
  try {
    // Fetch more posts than needed to filter out the current one
    const response = await fetchBlogPosts({
      size: limit + 5,
      sort_by: 'publish_date',
      sort_order: 'desc'
    });

    // Filter out current post and limit results
    const relatedPosts = response.results
      .filter((post) => post.slug !== currentSlug)
      .slice(0, limit);

    return relatedPosts;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

export async function fetchFeaturedPosts(): Promise<BlogPost[]> {
  try {
    const response = await fetchBlogPosts({
      size: 5,
      sort_by: 'publish_date',
      sort_order: 'desc'
    });

    // Return posts marked as featured or just the latest posts
    return response.results.filter((post) => post.is_featured).slice(0, 3);
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    return [];
  }
}

// Utility function to calculate reading time
function calculateReadingTime(post: BlogPost): number {
  const wordsPerMinute = 200;
  let wordCount = 0;

  // Count words in all sections
  if (post.sections) {
    post.sections.forEach((section) => {
      if (section.content) {
        // Strip HTML tags and count words
        const text = section.content.replace(/<[^>]*>/g, '');
        wordCount += text.split(/\s+/).filter((word) => word.length > 0).length;
      }
    });
  }

  // Calculate reading time in minutes, minimum 1 minute
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

// Extract unique categories from blog posts
export function extractCategories(
  posts: BlogPost[]
): (BlogCategory & { post_count: number })[] {
  const categoryMap = new Map<string, BlogCategory & { post_count: number }>();

  posts.forEach((post) => {
    post.categories?.forEach((category) => {
      if (!categoryMap.has(category.slug)) {
        categoryMap.set(category.slug, { ...category, post_count: 0 });
      }
      const existingCategory = categoryMap.get(category.slug)!;
      existingCategory.post_count += 1;
    });
  });

  // Sort by post count descending, then by name
  return Array.from(categoryMap.values()).sort((a, b) => {
    if (b.post_count !== a.post_count) {
      return b.post_count - a.post_count;
    }
    return a.name.localeCompare(b.name);
  });
}

// Get all blog slugs for static generation
export async function getAllBlogSlugs(): Promise<string[]> {
  try {
    const allSlugs: string[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await fetchBlogPosts({ page, size: 50 });
      allSlugs.push(...response.results.map((post) => post.slug));

      hasMore = page < response.pages;
      page++;
    }

    return allSlugs;
  } catch (error) {
    console.error('Error fetching all blog slugs:', error);
    return [];
  }
}
