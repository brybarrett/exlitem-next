// Extend base types from blog
import { BlogAuthor, BlogSection, BlogSEO, BlogCategory } from './blog';

export interface PodcastGuest {
  name: string;
  title?: string;
  company?: string;
  bio?: string;
  image?: string;
  linkedin?: string;
}

export interface PodcastChapter {
  timestamp: string;
  title: string;
  duration?: string;
}

export interface PodcastEpisode {
  // Core fields from API
  id: number;
  uuid: string;
  title: string;
  slug: string;
  excerpt?: string;
  featured_image?: string;
  status: 'published' | 'draft' | 'archived';
  is_featured: boolean;
  publish_date?: string;
  created_at: string;
  updated_at: string;

  // Podcast-specific fields
  episode_number: number;
  duration: string; // Format: "HH:MM:SS"
  audio_url: string;
  season?: number;
  guests?: PodcastGuest[];
  transcript?: string;
  chapters?: PodcastChapter[];
  show_notes?: string;

  // Shared fields from blog
  sections: BlogSection[];
  categories: BlogCategory[];
  authors: BlogAuthor[];
  seo: BlogSEO;

  // Computed fields
  listening_time?: number; // in minutes
  download_count?: number;
  play_count?: number;
}

// Legacy interface for RSS feed compatibility
export interface SimplePodcastEpisode {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  imageUrl: string;
  pubDate: string;
  duration: number;
  guid: string;
}

export interface PodcastListResponse {
  level: string;
  detail: string;
  results: PodcastEpisode[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface PodcastDetailResponse {
  level: string;
  detail: string;
  results: PodcastEpisode;
}

export interface PodcastFilters {
  page?: number;
  size?: number;
  sort_by?: 'publish_date' | 'episode_number' | 'duration';
  sort_order?: 'asc' | 'desc';
  season?: number;
  search?: string;
}

export interface PodcastPlayerState {
  episodeId: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  playbackRate: number;
}

export interface PodcastSubscriptionPlatform {
  name: string;
  icon: string;
  url: string;
  color?: string;
}

// Component Props
export interface PodcastEpisodesProps {
  className?: string;
}

export interface AudioPlayerProps {
  episode: PodcastEpisode;
  className?: string;
  variant?: 'full' | 'compact' | 'mini';
  onPlay?: () => void;
  onPause?: () => void;
}

export interface EpisodeCardProps {
  episode: PodcastEpisode;
  variant?: 'featured' | 'compact' | 'notion';
  showPlayer?: boolean;
  className?: string;
}
