export interface BlogAuthor {
  name?: string;
  email: string;
  role?: string;
  first_name?: string;
  last_name?: string;
  description?: string;
  avatar?: string;
  profile_image?: string;
  uuid?: string;
}

export interface BlogSection {
  type: string;
  content: string;
  headings?: string[];
}

export interface BlogSEO {
  title: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
}

export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
}

export interface BlogPost {
  id: number;
  uuid: string;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  status: 'published' | 'draft' | 'archived';
  is_featured: boolean;
  allow_comments: boolean;
  show_author_bio: boolean;
  show_related_articles: boolean;
  template: string;
  publish_date?: string;
  created_at: string;
  updated_at: string;
  sections: BlogSection[];
  categories: BlogCategory[];
  authors: BlogAuthor[];
  seo: BlogSEO;
  reading_time?: number;
  view_count?: number;
}

export interface BlogListResponse {
  level: string;
  detail: string;
  results: BlogPost[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface BlogDetailResponse {
  article: BlogPost;
  seo: BlogSEO;
  author: BlogAuthor;
  sections: BlogSection[];
  metadata: {
    created_at: string;
    updated_at: string;
    is_active: boolean;
  };
}

export interface BlogFilters {
  page?: number;
  size?: number;
  sort_by?: 'publish_date' | 'updated_at' | 'title';
  sort_order?: 'asc' | 'desc';
  category?: string;
  search?: string;
}
