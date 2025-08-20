import { generateMetadata as generateSEOMetadata } from '@/lib/seo-utils';
import { SEO_TEMPLATES, EXPERT_WITNESS_KEYWORDS } from '@/lib/seo-config';
import type { Metadata } from 'next';

export const metadata: Metadata = generateSEOMetadata({
  title: SEO_TEMPLATES.directory.title,
  description: SEO_TEMPLATES.directory.description,
  keywords: [
    ...EXPERT_WITNESS_KEYWORDS.primary,
    ...EXPERT_WITNESS_KEYWORDS.categories,
    'expert witness directory',
    'find expert witness by specialty',
    'search expert witnesses',
    'qualified expert witnesses',
    'professional expert testimony',
    'litigation support experts',
    'expert witness database',
    'find litigation expert'
  ],
  path: '/directory'
});

export default function DirectoryLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
