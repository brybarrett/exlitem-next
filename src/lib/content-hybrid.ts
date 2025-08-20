// Hybrid content management system combining markdown content with API data

import { loadExpertGuideContent } from '@/lib/content';
import { fetchFeaturedExperts, fetchCategoryStats } from '@/lib/api/experts';
import type {
  CategoryContent,
  ContentLoadOptions,
  FeaturedExpert,
  ApiCategoryStats
} from '@/types/content';

export interface HybridContentOptions extends ContentLoadOptions {
  includeFeaturedExperts?: boolean;
  includeStats?: boolean;
  expertLimit?: number;
}

/**
 * Enhanced content loading that combines markdown content with API data
 */
export async function loadHybridCategoryContent(
  category: string,
  subcategory?: string,
  options: HybridContentOptions = {}
): Promise<CategoryContent> {
  const {
    includeFeaturedExperts = true,
    includeStats = true,
    expertLimit = 5,
    ...contentOptions
  } = options;

  try {
    // Load base content from markdown files
    const baseContent = await loadExpertGuideContent(
      category,
      subcategory,
      contentOptions
    );

    // Prepare promises for parallel data fetching
    const promises: Promise<any>[] = [];

    // Add featured experts promise if requested
    if (includeFeaturedExperts) {
      promises.push(
        fetchFeaturedExperts(category, subcategory, {
          limit: expertLimit,
          forceFresh: contentOptions.forceFresh
        }).catch((error) => {
          console.warn('Failed to fetch featured experts:', error);
          return [] as FeaturedExpert[];
        })
      );
    } else {
      promises.push(Promise.resolve([] as FeaturedExpert[]));
    }

    // Add stats promise if requested
    if (includeStats) {
      promises.push(
        fetchCategoryStats(category, subcategory).catch((error) => {
          console.warn('Failed to fetch category stats:', error);
          return null as ApiCategoryStats | null;
        })
      );
    } else {
      promises.push(Promise.resolve(null as ApiCategoryStats | null));
    }

    // Execute all promises in parallel
    const [experts, stats] = await Promise.all(promises);

    // Merge API data with base content
    const enhancedContent: CategoryContent = {
      ...baseContent,
      experts: experts || [],
      totalExperts: stats?.totalExperts || baseContent.totalExperts || 0
    };

    // Update metadata if we have fresh stats
    if (stats) {
      enhancedContent.guide.metadata = {
        ...enhancedContent.guide.metadata,
        expertCount: stats.totalExperts,
        lastUpdated: stats.lastUpdated
      };
    }

    return enhancedContent;
  } catch (error) {
    console.error('Error loading hybrid category content:', error);

    // Fall back to base content on error
    return loadExpertGuideContent(category, subcategory, contentOptions);
  }
}

/**
 * Preloads hybrid content for multiple categories
 */
export async function preloadHybridContent(
  categories: Array<{ category: string; subcategory?: string }>,
  options: HybridContentOptions = {}
): Promise<void> {
  const promises = categories.map(({ category, subcategory }) =>
    loadHybridCategoryContent(category, subcategory, options).catch((error) => {
      console.warn(
        `Failed to preload content for ${category}${subcategory ? `/${subcategory}` : ''}:`,
        error
      );
    })
  );

  await Promise.allSettled(promises);
}

/**
 * Refreshes expert data for a category while keeping content cached
 */
export async function refreshExpertData(
  category: string,
  subcategory?: string,
  expertLimit: number = 5
): Promise<FeaturedExpert[]> {
  try {
    return await fetchFeaturedExperts(category, subcategory, {
      limit: expertLimit,
      forceFresh: true
    });
  } catch (error) {
    console.error('Error refreshing expert data:', error);
    return [];
  }
}

/**
 * Gets enhanced category content with real-time expert availability
 */
export async function getCategoryContentWithLiveData(
  category: string,
  subcategory?: string,
  options: HybridContentOptions = {}
): Promise<CategoryContent> {
  // Load base content from cache if available
  const baseContent = await loadExpertGuideContent(category, subcategory, {
    ...options,
    forceFresh: false // Use cache for content
  });

  try {
    // Always fetch fresh expert data for live availability
    const experts = await fetchFeaturedExperts(category, subcategory, {
      limit: options.expertLimit || 5,
      forceFresh: true,
      includeStats: true
    });

    return {
      ...baseContent,
      experts,
      totalExperts: experts.length || baseContent.totalExperts
    };
  } catch (error) {
    console.error('Error fetching live expert data:', error);
    return baseContent;
  }
}

/**
 * Validates content integrity between markdown and API data
 */
export async function validateContentIntegrity(
  category: string,
  subcategory?: string
): Promise<{
  isValid: boolean;
  issues: string[];
  recommendations: string[];
}> {
  const issues: string[] = [];
  const recommendations: string[] = [];

  try {
    const [content, stats] = await Promise.all([
      loadExpertGuideContent(category, subcategory),
      fetchCategoryStats(category, subcategory)
    ]);

    // Check for content completeness
    if (content.guide.faqs.length === 0) {
      issues.push('No FAQ content available');
      recommendations.push('Add comprehensive FAQ content to markdown file');
    }

    if (!content.guide.overview || content.guide.overview.trim().length < 100) {
      issues.push('Overview content is missing or too brief');
      recommendations.push('Add detailed overview section to markdown file');
    }

    // Check expert count consistency
    if (stats && content.guide.metadata.expertCount) {
      const difference = Math.abs(
        stats.totalExperts - content.guide.metadata.expertCount
      );
      if (difference > 50) {
        issues.push(
          `Expert count mismatch: Markdown (${content.guide.metadata.expertCount}) vs API (${stats.totalExperts})`
        );
        recommendations.push('Update expert count in markdown frontmatter');
      }
    }

    // Check for outdated content
    if (content.guide.metadata.lastUpdated) {
      const lastUpdate = new Date(content.guide.metadata.lastUpdated);
      const daysSinceUpdate =
        (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24);

      if (daysSinceUpdate > 90) {
        issues.push(`Content is ${Math.floor(daysSinceUpdate)} days old`);
        recommendations.push('Review and update markdown content');
      }
    }

    return {
      isValid: issues.length === 0,
      issues,
      recommendations
    };
  } catch (error) {
    return {
      isValid: false,
      issues: [
        `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      ],
      recommendations: ['Check content files and API availability']
    };
  }
}

/**
 * Exports content for external systems (e.g., search indexing)
 */
export async function exportCategoryContent(
  category: string,
  subcategory?: string,
  format: 'json' | 'markdown' | 'html' = 'json'
): Promise<string> {
  const content = await loadHybridCategoryContent(category, subcategory, {
    includeFeaturedExperts: true,
    includeStats: true
  });

  switch (format) {
    case 'json':
      return JSON.stringify(content, null, 2);

    case 'markdown':
      return generateMarkdownExport(content);

    case 'html':
      return generateHTMLExport(content);

    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

// Helper functions for content export

function generateMarkdownExport(content: CategoryContent): string {
  const { guide } = content;
  let markdown = `# ${guide.metadata.title}\n\n`;

  if (guide.metadata.description) {
    markdown += `${guide.metadata.description}\n\n`;
  }

  if (guide.overview) {
    markdown += `## Overview\n\n${guide.overview}\n\n`;
  }

  guide.faqs.forEach((faq) => {
    markdown += `## ${faq.question}\n\n${faq.answer}\n\n`;
  });

  if (content.experts.length > 0) {
    markdown += `## Featured Experts\n\n`;
    content.experts.forEach((expert) => {
      markdown += `- **${expert.name}** - ${expert.title} (${expert.location})\n`;
    });
    markdown += '\n';
  }

  return markdown;
}

function generateHTMLExport(content: CategoryContent): string {
  const { guide } = content;
  let html = `<article>`;

  html += `<h1>${guide.metadata.title}</h1>`;

  if (guide.metadata.description) {
    html += `<p class="description">${guide.metadata.description}</p>`;
  }

  if (guide.overview) {
    html += `<section class="overview"><h2>Overview</h2><p>${guide.overview}</p></section>`;
  }

  if (guide.faqs.length > 0) {
    html += `<section class="faqs">`;
    guide.faqs.forEach((faq) => {
      html += `<div class="faq-item">`;
      html += `<h3>${faq.question}</h3>`;
      html += `<div class="faq-answer">${faq.answer.replace(/\n/g, '<br>')}</div>`;
      html += `</div>`;
    });
    html += `</section>`;
  }

  html += `</article>`;
  return html;
}
