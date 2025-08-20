import { PodcastEpisode } from '@/types/podcast';

export async function fetchPodcastEpisodes(
  signal?: AbortSignal
): Promise<PodcastEpisode[]> {
  try {
    const response = await fetch('/api/podcast', {
      signal,
      headers: {
        Accept: 'application/rss+xml, application/xml, text/xml'
      }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status}`);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    const items = xmlDoc.querySelectorAll('item');
    const episodes: PodcastEpisode[] = [];

    items.forEach((item, index) => {
      const title = item.querySelector('title')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const guid =
        item.querySelector('guid')?.textContent || `episode-${index}`;
      const pubDate = item.querySelector('pubDate')?.textContent || '';

      // Get audio URL from enclosure
      const enclosure = item.querySelector('enclosure');
      const audioUrl = enclosure?.getAttribute('url') || '';

      // Get image URL from iTunes image
      const imageElement = item.querySelector('itunes\\:image, image[href]');
      const imageUrl =
        imageElement?.getAttribute('href') ||
        imageElement?.getAttribute('url') ||
        '/assets/default_exlitem_banner.jpg';

      // Get duration from iTunes duration
      const durationElement = item.querySelector('itunes\\:duration, duration');
      let duration = 0;

      if (durationElement?.textContent) {
        const durationText = durationElement.textContent;
        // Handle HH:MM:SS or MM:SS or seconds format
        if (durationText.includes(':')) {
          const parts = durationText.split(':').map(Number);
          if (parts.length === 3) {
            duration = parts[0] * 3600 + parts[1] * 60 + parts[2];
          } else if (parts.length === 2) {
            duration = parts[0] * 60 + parts[1];
          }
        } else {
          duration = parseInt(durationText, 10) || 0;
        }
      }

      if (title && audioUrl) {
        // Create a PodcastEpisode object
        const episode: PodcastEpisode = {
          // Core fields
          id: index + 1, // Use numeric ID
          uuid: guid,
          title: cleanHtmlText(title),
          slug: cleanHtmlText(title)
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, ''),
          excerpt: cleanHtmlText(description),
          featured_image: imageUrl,
          status: 'published',
          is_featured: index === 0, // First episode is featured
          publish_date: pubDate,
          created_at: pubDate,
          updated_at: pubDate,

          // Podcast-specific fields
          episode_number: items.length - index,
          duration: convertSecondsToTimeString(duration),
          audio_url: audioUrl,
          listening_time: Math.round(duration / 60),

          // Required fields with defaults
          sections: [],
          categories: [],
          authors: [],
          seo: {
            title: cleanHtmlText(title),
            description: cleanHtmlText(description).substring(0, 160),
            canonical: ''
          }
        };

        episodes.push(episode);
      }
    });

    return episodes;
  } catch (error) {
    // Don't log errors for aborted requests
    if (error instanceof Error && error.name === 'AbortError') {
      throw error; // Re-throw abort errors to be handled by the component
    }

    console.error('Error fetching podcast episodes:', error);
    // Return fallback data instead of empty array
    return getFallbackEpisodes();
  }
}

function getFallbackEpisodes(): PodcastEpisode[] {
  const now = new Date().toISOString();
  return [
    {
      // Core fields
      id: 1,
      uuid: 'fallback-1',
      title: 'Welcome to the Expert Witness Podcast',
      slug: 'welcome-to-the-expert-witness-podcast',
      excerpt:
        'Join us as we explore the world of expert witness testimony and provide valuable insights for legal professionals and expert witnesses alike.',
      featured_image: '/assets/default_exlitem_banner.jpg',
      status: 'published',
      is_featured: true,
      publish_date: now,
      created_at: now,
      updated_at: now,

      // Podcast-specific fields
      episode_number: 1,
      duration: '30:00',
      audio_url: '',
      listening_time: 30,

      // Required fields with defaults
      sections: [],
      categories: [],
      authors: [],
      seo: {
        title: 'Welcome to the Expert Witness Podcast',
        description:
          'Join us as we explore the world of expert witness testimony and provide valuable insights for legal professionals and expert witnesses alike.',
        canonical: ''
      }
    }
  ];
}

function cleanHtmlText(text: string): string {
  // Remove HTML tags and decode HTML entities
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = text;
  return tempDiv.textContent || tempDiv.innerText || text;
}

function convertSecondsToTimeString(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatDuration(seconds: number): string {
  if (!seconds || seconds === 0) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function truncateDescription(
  description: string,
  maxLength: number = 150
): string {
  if (description.length <= maxLength) return description;

  const truncated = description.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');

  if (lastSpaceIndex > 0) {
    return truncated.slice(0, lastSpaceIndex) + '...';
  }

  return truncated + '...';
}
