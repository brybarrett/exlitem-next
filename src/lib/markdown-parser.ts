// Markdown parser utilities for content rendering
import { ReactNode } from 'react';

export interface ParsedContent {
  type: 'heading' | 'paragraph' | 'text';
  level?: number; // For headings (1-6)
  content: string;
  id?: string; // For heading anchors
}

/**
 * Parses markdown content and extracts headings with proper hierarchy
 */
export function parseMarkdownContent(content: string): ParsedContent[] {
  if (!content) return [];

  const lines = content.split('\n').filter((line) => line.trim() !== '');
  const parsed: ParsedContent[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Check for heading (# ## ### etc.)
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = generateHeadingId(text);

      parsed.push({
        type: 'heading',
        level,
        content: text,
        id
      });
    } else if (trimmed.length > 0) {
      // Regular paragraph or text
      parsed.push({
        type: 'paragraph',
        content: trimmed
      });
    }
  }

  return parsed;
}

/**
 * Generates a URL-friendly ID from heading text
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .substring(0, 50); // Limit length
}

/**
 * Extracts table of contents from parsed content
 */
export function extractTableOfContents(parsed: ParsedContent[]): Array<{
  id: string;
  title: string;
  level: number;
}> {
  return parsed
    .filter((item) => item.type === 'heading' && item.level && item.level <= 3)
    .map((item) => ({
      id: item.id!,
      title: item.content,
      level: item.level!
    }));
}

/**
 * Gets the appropriate CSS classes for a heading level
 */
export function getHeadingClasses(level: number): string {
  const baseClasses =
    'font-semibold text-gray-900 dark:text-gray-100 mt-8 mb-4 first:mt-0';

  switch (level) {
    case 1:
      return `${baseClasses} text-3xl lg:text-4xl`;
    case 2:
      return `${baseClasses} text-2xl lg:text-3xl`;
    case 3:
      return `${baseClasses} text-xl lg:text-2xl`;
    case 4:
      return `${baseClasses} text-lg lg:text-xl`;
    case 5:
      return `${baseClasses} text-base lg:text-lg`;
    case 6:
      return `${baseClasses} text-sm lg:text-base`;
    default:
      return `${baseClasses} text-base`;
  }
}

/**
 * Gets the appropriate HTML tag for a heading level
 */
export function getHeadingTag(
  level: number
): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' {
  switch (level) {
    case 1:
      return 'h1';
    case 2:
      return 'h2';
    case 3:
      return 'h3';
    case 4:
      return 'h4';
    case 5:
      return 'h5';
    case 6:
      return 'h6';
    default:
      return 'h2';
  }
}

/**
 * Simple markdown to HTML converter for inline formatting
 */
export function parseInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
    .replace(/`(.*?)`/g, '<code>$1</code>') // Inline code
    .replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    ); // Links
}

/**
 * Extracts H1 title and overview content from markdown
 */
export function extractTitleAndOverview(content: string): {
  title: string;
  overview: string;
} {
  const lines = content.split('\n');
  let title = '';
  let overview = '';
  let foundH1 = false;
  let reachedH2 = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '') continue;

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      const level = headingMatch[1].length;

      if (level === 1 && !foundH1) {
        title = headingMatch[2].trim();
        foundH1 = true;
        continue;
      }

      if (level === 2) {
        reachedH2 = true;
        break;
      }
    } else if (foundH1 && !reachedH2 && trimmed.length > 0) {
      // Collect overview content after H1 and before first H2
      overview += (overview ? '\n' : '') + trimmed;
    }
  }

  return { title, overview };
}

/**
 * Converts H2 sections to FAQ format, with H3+ nested as content
 */
export function convertToFAQFormat(content: string): Array<{
  id: string;
  question: string;
  answer: string;
}> {
  const lines = content.split('\n');
  const faqs: Array<{ id: string; question: string; answer: string }> = [];

  let currentQuestion = '';
  let currentAnswer = '';
  let currentId = '';
  let collectingAnswer = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '') {
      if (collectingAnswer) {
        currentAnswer += '\n';
      }
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      const level = headingMatch[1].length;

      if (level === 1) {
        // Skip H1 headings - they're used as the main title
        continue;
      } else if (level === 2) {
        // Save previous FAQ if it exists
        if (currentQuestion && currentAnswer.trim()) {
          faqs.push({
            id: currentId,
            question: currentQuestion,
            answer: currentAnswer.trim()
          });
        }

        // Start new FAQ from H2
        currentQuestion = headingMatch[2].trim();
        currentId = generateHeadingId(currentQuestion);
        currentAnswer = '';
        collectingAnswer = true;
      } else if (level >= 3 && collectingAnswer) {
        // H3+ headings become part of the current H2's answer content
        currentAnswer += (currentAnswer ? '\n' : '') + line;
      }
    } else if (collectingAnswer && trimmed.length > 0) {
      // Regular content goes into the current answer
      currentAnswer += (currentAnswer ? '\n' : '') + trimmed;
    }
  }

  // Add final FAQ
  if (currentQuestion && currentAnswer.trim()) {
    faqs.push({
      id: currentId,
      question: currentQuestion,
      answer: currentAnswer.trim()
    });
  }

  return faqs;
}

/**
 * Parses Home Page FAQ format where H3 headings are questions
 */
export function parseHomePageFAQ(content: string): Array<{
  id: string;
  question: string;
  answer: string;
}> {
  const lines = content.split('\n');
  const faqs: Array<{ id: string; question: string; answer: string }> = [];

  let currentQuestion = '';
  let currentAnswer = '';
  let currentId = '';
  let collectingAnswer = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '') {
      if (collectingAnswer && currentAnswer) {
        currentAnswer += '\n';
      }
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      const level = headingMatch[1].length;

      if (level === 3) {
        // Save previous FAQ if it exists
        if (currentQuestion && currentAnswer.trim()) {
          faqs.push({
            id: currentId,
            question: currentQuestion,
            answer: currentAnswer.trim()
          });
        }

        // Start new FAQ from H3
        currentQuestion = headingMatch[2].trim();
        currentId = generateHeadingId(currentQuestion);
        currentAnswer = '';
        collectingAnswer = true;
      } else if (level > 3 && collectingAnswer) {
        // H4+ headings become part of the answer content
        currentAnswer += (currentAnswer ? '\n' : '') + line;
      }
    } else if (collectingAnswer && trimmed.length > 0) {
      // Regular content goes into the current answer
      currentAnswer += (currentAnswer ? '\n' : '') + trimmed;
    }
  }

  // Add final FAQ
  if (currentQuestion && currentAnswer.trim()) {
    faqs.push({
      id: currentId,
      question: currentQuestion,
      answer: currentAnswer.trim()
    });
  }

  return faqs;
}

/**
 * Processes full markdown content with sections and paragraphs, skipping H1 for FAQ display
 */
export function processMarkdownSections(
  content: string,
  skipH1ForFAQ: boolean = true
): Array<{
  type: 'heading' | 'content';
  level?: number;
  title?: string;
  id?: string;
  paragraphs?: string[];
}> {
  const lines = content.split('\n');
  const sections: Array<{
    type: 'heading' | 'content';
    level?: number;
    title?: string;
    id?: string;
    paragraphs?: string[];
  }> = [];

  let currentSection: any = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '') continue;

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);

    if (headingMatch) {
      const level = headingMatch[1].length;

      // Skip H1 headings if this is for FAQ display
      if (skipH1ForFAQ && level === 1) {
        continue;
      }

      // Save previous section if it exists
      if (currentSection) {
        sections.push(currentSection);
      }

      // Start new heading section
      const title = headingMatch[2].trim();
      const id = generateHeadingId(title);

      sections.push({
        type: 'heading',
        level,
        title,
        id
      });

      // Start collecting content for this section
      currentSection = {
        type: 'content' as const,
        paragraphs: []
      };
    } else if (trimmed.length > 0) {
      // Add to current content section
      if (!currentSection) {
        currentSection = {
          type: 'content' as const,
          paragraphs: []
        };
      }

      if (currentSection.type === 'content') {
        currentSection.paragraphs.push(trimmed);
      }
    }
  }

  // Add final section
  if (currentSection && currentSection.paragraphs?.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}
