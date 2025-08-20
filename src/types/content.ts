// Content Management Types for Expert Witness Categories

export interface ContentMetadata {
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  expertCount?: number;
  lastUpdated: string;
  author?: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  order?: number;
  category?: string;
  tags?: string[];
}

export interface ContentSection {
  id: string;
  title: string;
  content: string;
  order: number;
  subsections?: ContentSubsection[];
}

export interface ContentSubsection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface ExpertGuideContent {
  metadata: ContentMetadata;
  overview: string;
  sections: ContentSection[];
  faqs: FAQItem[];
  relatedCategories?: string[];
  featuredExperts?: string[]; // Will be populated from API
}

export interface FeaturedExpert {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  yearsExperience: number;
  education: string[];
  certifications: string[];
  location: string;
  hourlyRate?: {
    min: number;
    max: number;
  };
  availability: 'available' | 'limited' | 'unavailable';
  rating: number;
  reviewCount: number;
  profileImage?: string;
  isPremium: boolean;
  isVerified: boolean;
}

export interface CategoryContent {
  category: string;
  subcategory?: string;
  guide: ExpertGuideContent;
  experts: FeaturedExpert[];
  totalExperts: number;
  isLoading: boolean;
  error?: string;
}

export interface ContentPath {
  category: string;
  subcategory?: string;
  filePath: string;
}

export interface ContentCacheItem {
  content: ExpertGuideContent;
  lastFetched: number;
  expiresAt: number;
}

export interface ContentError {
  code:
    | 'FILE_NOT_FOUND'
    | 'PARSE_ERROR'
    | 'INVALID_FRONTMATTER'
    | 'NETWORK_ERROR';
  message: string;
  details?: Record<string, unknown>;
}

// API Response types for future backend integration
export interface ApiExpertResponse {
  experts: FeaturedExpert[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ApiCategoryStats {
  category: string;
  subcategory?: string;
  totalExperts: number;
  availableExperts: number;
  premiumExperts: number;
  averageRating: number;
  lastUpdated: string;
}

// Content loading options
export interface ContentLoadOptions {
  includeExperts?: boolean;
  includeStats?: boolean;
  forceFresh?: boolean;
  fallbackToStatic?: boolean;
}

// Content validation schemas (for future use with zod)
export interface ContentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}
