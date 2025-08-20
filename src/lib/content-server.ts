// Server-side content management utilities for Node.js environment

import { promises as fs } from 'fs';
import path from 'path';
import type {
  ExpertGuideContent,
  ContentMetadata,
  FAQItem,
  ContentSection,
  ContentPath,
  ContentCacheItem
} from '@/types/content';

// Server-side content cache
const serverCache = new Map<string, ContentCacheItem>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Generates content path based on category and subcategory (server-side)
 */
export function getContentPathServer(
  category: string,
  subcategory?: string
): ContentPath {
  const basePath = path.join(process.cwd(), 'src', 'content', 'expert-guides');

  if (subcategory) {
    return {
      category,
      subcategory,
      filePath: path.join(basePath, category, `${subcategory}.md`)
    };
  }

  return {
    category,
    filePath: path.join(basePath, category, `${category}.md`)
  };
}

/**
 * Maps URL segments to content paths (server-side)
 */
export function mapUrlToContentServer(
  categorySlug: string,
  subcategorySlug?: string
): ContentPath | null {
  const categoryMappings: Record<string, string> = {
    medical: 'medical',
    engineering: 'engineering',
    'accounting-finance': 'accounting',
    'law-enforcement': 'law-enforcement',
    psychology: 'psychology',
    technology: 'technology',
    construction: 'construction',
    environmental: 'environmental'
  };

  const subcategoryMappings: Record<string, string> = {
    'forensic-psychiatry': 'forensic-psychiatry',
    cardiology: 'cardiology',
    orthopedics: 'orthopedics',
    neurology: 'neurology'
  };

  const mappedCategory = categoryMappings[categorySlug];
  if (!mappedCategory) return null;

  const mappedSubcategory = subcategorySlug
    ? subcategoryMappings[subcategorySlug]
    : undefined;

  return getContentPathServer(mappedCategory, mappedSubcategory);
}

/**
 * Parses markdown frontmatter (server-side)
 */
function parseFrontmatterServer(content: string): {
  data: Partial<ContentMetadata>;
  content: string;
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content };
  }

  const [, frontmatterString, markdownContent] = match;
  const data: Partial<ContentMetadata> = {};

  frontmatterString.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts
        .join(':')
        .trim()
        .replace(/^["']|["']$/g, '');
      switch (key.trim()) {
        case 'title':
          data.title = value;
          break;
        case 'description':
          data.description = value;
          break;
        case 'category':
          data.category = value;
          break;
        case 'subcategory':
          data.subcategory = value;
          break;
        case 'expertCount':
          data.expertCount = parseInt(value, 10);
          break;
        case 'lastUpdated':
          data.lastUpdated = value;
          break;
      }
    }
  });

  return { data, content: markdownContent };
}

/**
 * Converts markdown content to FAQ items (server-side)
 */
function markdownToFAQServer(content: string): FAQItem[] {
  const faqs: FAQItem[] = [];
  const sections = content.split(/^## /gm).filter(Boolean);

  sections.forEach((section, index) => {
    if (!section.trim()) return;

    const lines = section.split('\n');
    const title = lines[0]?.trim();
    const content = lines.slice(1).join('\n').trim();

    if (title && content) {
      faqs.push({
        id: `faq-${index + 1}`,
        question: title,
        answer: content,
        order: index + 1
      });
    }
  });

  return faqs;
}

/**
 * Converts markdown content to structured sections (server-side)
 */
function markdownToSectionsServer(content: string): ContentSection[] {
  const sections: ContentSection[] = [];
  const parts = content.split(/^## /gm).filter(Boolean);

  parts.forEach((part, index) => {
    const lines = part.split('\n');
    const title = lines[0]?.trim();
    const sectionContent = lines.slice(1).join('\n').trim();

    if (title && sectionContent) {
      sections.push({
        id: `section-${index + 1}`,
        title,
        content: sectionContent,
        order: index + 1
      });
    }
  });

  return sections;
}

/**
 * Loads and parses markdown content from file (server-side)
 */
export async function loadMarkdownFileServer(
  filePath: string
): Promise<ExpertGuideContent | null> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data: frontmatter, content: markdownContent } =
      parseFrontmatterServer(fileContent);

    const overviewMatch = markdownContent.match(/^([\s\S]*?)(?=^## )/m);
    const overview = overviewMatch ? overviewMatch[1].trim() : '';

    const faqs = markdownToFAQServer(markdownContent);
    const sections = markdownToSectionsServer(markdownContent);

    const metadata: ContentMetadata = {
      title: frontmatter.title || 'Expert Witness Guide',
      description:
        frontmatter.description || 'Comprehensive expert witness information',
      category: frontmatter.category || '',
      subcategory: frontmatter.subcategory,
      expertCount: frontmatter.expertCount || 0,
      lastUpdated: frontmatter.lastUpdated || new Date().toISOString(),
      ...frontmatter
    };

    return {
      metadata,
      overview,
      sections,
      faqs
    };
  } catch (error) {
    console.error(`Error loading markdown file ${filePath}:`, error);
    return null;
  }
}

/**
 * Gets cached content or loads from file (server-side)
 */
export async function getCachedContentServer(
  cacheKey: string,
  filePath: string
): Promise<ExpertGuideContent | null> {
  const cached = serverCache.get(cacheKey);

  if (cached && Date.now() < cached.expiresAt) {
    return cached.content;
  }

  const content = await loadMarkdownFileServer(filePath);

  if (content) {
    serverCache.set(cacheKey, {
      content,
      lastFetched: Date.now(),
      expiresAt: Date.now() + CACHE_DURATION
    });
  }

  return content;
}

/**
 * Creates fallback content when markdown file is not found (server-side)
 */
export function createFallbackContentServer(
  category: string,
  subcategory?: string
): ExpertGuideContent {
  const displayName = subcategory
    ? `${subcategory.charAt(0).toUpperCase()}${subcategory.slice(1)} Expert Witnesses`
    : `${category.charAt(0).toUpperCase()}${category.slice(1)} Expert Witnesses`;

  return {
    metadata: {
      title: displayName,
      description: `Expert witness information for ${displayName.toLowerCase()}`,
      category,
      subcategory,
      lastUpdated: new Date().toISOString()
    },
    overview: `Comprehensive guide to ${displayName.toLowerCase()} and their role in legal proceedings.`,
    sections: [],
    faqs: []
  };
}

/**
 * Main server-side function to load expert guide content
 */
export async function loadExpertGuideContentServer(
  category: string,
  subcategory?: string,
  forceFresh = false
): Promise<ExpertGuideContent> {
  try {
    const contentPath = mapUrlToContentServer(category, subcategory);

    if (!contentPath) {
      return createFallbackContentServer(category, subcategory);
    }

    const cacheKey = `${category}${subcategory ? `/${subcategory}` : ''}`;

    let content: ExpertGuideContent | null = null;

    if (!forceFresh) {
      content = await getCachedContentServer(cacheKey, contentPath.filePath);
    } else {
      content = await loadMarkdownFileServer(contentPath.filePath);
    }

    return content || createFallbackContentServer(category, subcategory);
  } catch (error) {
    console.error('Error loading expert guide content:', error);
    return createFallbackContentServer(category, subcategory);
  }
}
