// API service layer for expert witness data integration

import type {
  FeaturedExpert,
  ApiExpertResponse,
  ApiCategoryStats
} from '@/types/content';

// Configuration for API endpoints
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_EXPERTS_API_URL || '/api/experts',
  timeout: 10000,
  retryAttempts: 3
};

// Response cache for performance
const expertCache = new Map<string, { data: any; expiresAt: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Generic API request function with retry logic
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.baseUrl}${endpoint}`;

  for (let attempt = 1; attempt <= API_CONFIG.retryAttempts; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        API_CONFIG.timeout
      );

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (attempt === API_CONFIG.retryAttempts) {
        throw error;
      }

      // Wait before retry with exponential backoff
      await new Promise((resolve) =>
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }

  throw new Error('Max retry attempts reached');
}

/**
 * Gets cached data or fetches fresh data
 */
function getCachedData<T>(cacheKey: string): T | null {
  const cached = expertCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }
  return null;
}

/**
 * Sets data in cache
 */
function setCacheData(cacheKey: string, data: any): void {
  expertCache.set(cacheKey, {
    data,
    expiresAt: Date.now() + CACHE_DURATION
  });
}

/**
 * Fetches featured experts for a specific category/subcategory
 */
export async function fetchFeaturedExperts(
  category: string,
  subcategory?: string,
  options: {
    limit?: number;
    includeStats?: boolean;
    forceFresh?: boolean;
  } = {}
): Promise<FeaturedExpert[]> {
  const { limit = 5, forceFresh = false } = options;
  const cacheKey = `featured-${category}${subcategory ? `-${subcategory}` : ''}-${limit}`;

  // Check cache first
  if (!forceFresh) {
    const cached = getCachedData<FeaturedExpert[]>(cacheKey);
    if (cached) return cached;
  }

  try {
    // For now, return mock data since backend API isn't implemented yet
    // This structure makes it easy to replace with real API calls
    const mockExperts = await generateMockFeaturedExperts(
      category,
      subcategory,
      limit
    );

    // TODO: Replace with actual API call when backend is ready
    // const response = await apiRequest<ApiExpertResponse>(
    //   `/featured?category=${category}${subcategory ? `&subcategory=${subcategory}` : ''}&limit=${limit}`
    // );
    // const experts = response.experts;

    setCacheData(cacheKey, mockExperts);
    return mockExperts;
  } catch (error) {
    console.error('Error fetching featured experts:', error);
    // Return empty array on error to prevent UI breaking
    return [];
  }
}

/**
 * Fetches category statistics
 */
export async function fetchCategoryStats(
  category: string,
  subcategory?: string
): Promise<ApiCategoryStats | null> {
  const cacheKey = `stats-${category}${subcategory ? `-${subcategory}` : ''}`;

  const cached = getCachedData<ApiCategoryStats>(cacheKey);
  if (cached) return cached;

  try {
    // TODO: Replace with actual API call
    const mockStats = await generateMockCategoryStats(category, subcategory);

    setCacheData(cacheKey, mockStats);
    return mockStats;
  } catch (error) {
    console.error('Error fetching category stats:', error);
    return null;
  }
}

/**
 * Searches experts by query
 */
export async function searchExperts(
  query: string,
  filters: {
    category?: string;
    subcategory?: string;
    location?: string;
    experience?: string;
    availability?: string;
  } = {},
  pagination: {
    page?: number;
    limit?: number;
  } = {}
): Promise<ApiExpertResponse> {
  const { page = 1, limit = 20 } = pagination;

  try {
    // TODO: Implement actual search API
    const mockResponse = await generateMockSearchResults(query, filters, {
      page,
      limit
    });
    return mockResponse;
  } catch (error) {
    console.error('Error searching experts:', error);
    return {
      experts: [],
      total: 0,
      page,
      limit,
      hasMore: false
    };
  }
}

/**
 * Clears expert cache
 */
export function clearExpertCache(): void {
  expertCache.clear();
}

// Mock data generators (to be replaced with actual API calls)

async function generateMockFeaturedExperts(
  category: string,
  subcategory?: string,
  limit: number = 5
): Promise<FeaturedExpert[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  const baseExperts: Omit<FeaturedExpert, 'id' | 'name'>[] = [
    {
      title: 'Board-Certified Physician',
      specialties: [
        subcategory || category,
        'Expert Testimony',
        'Medical Review'
      ],
      yearsExperience: 15,
      education: [
        'MD from Harvard Medical School',
        'Residency at Johns Hopkins'
      ],
      certifications: ['Board Certified', 'Expert Witness Certified'],
      location: 'New York, NY',
      hourlyRate: { min: 500, max: 800 },
      availability: 'available',
      rating: 4.9,
      reviewCount: 127,
      isPremium: true,
      isVerified: true
    },
    {
      title: 'Senior Medical Expert',
      specialties: [subcategory || category, 'Litigation Support'],
      yearsExperience: 22,
      education: ['MD from Stanford University', 'Fellowship at Mayo Clinic'],
      certifications: ['Board Certified', 'Fellowship Trained'],
      location: 'Los Angeles, CA',
      hourlyRate: { min: 600, max: 1000 },
      availability: 'limited',
      rating: 4.8,
      reviewCount: 89,
      isPremium: true,
      isVerified: true
    }
  ];

  return baseExperts.slice(0, limit).map((expert, index) => ({
    ...expert,
    id: `expert-${category}-${index + 1}`,
    name: `Dr. ${['Sarah', 'Michael', 'Jennifer', 'David', 'Lisa'][index] || 'Expert'} ${['Smith', 'Johnson', 'Williams', 'Brown', 'Davis'][index] || 'Expert'}`
  }));
}

async function generateMockCategoryStats(
  category: string,
  subcategory?: string
): Promise<ApiCategoryStats> {
  await new Promise((resolve) => setTimeout(resolve, 50));

  return {
    category,
    subcategory,
    totalExperts: Math.floor(Math.random() * 500) + 100,
    availableExperts: Math.floor(Math.random() * 300) + 50,
    premiumExperts: Math.floor(Math.random() * 100) + 20,
    averageRating: 4.6 + Math.random() * 0.4,
    lastUpdated: new Date().toISOString()
  };
}

async function generateMockSearchResults(
  query: string,
  filters: any,
  pagination: { page: number; limit: number }
): Promise<ApiExpertResponse> {
  await new Promise((resolve) => setTimeout(resolve, 200));

  const totalResults = Math.floor(Math.random() * 1000) + 100;
  const { page, limit } = pagination;
  const offset = (page - 1) * limit;

  return {
    experts: [], // Would contain actual search results
    total: totalResults,
    page,
    limit,
    hasMore: offset + limit < totalResults
  };
}
