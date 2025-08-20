import { Metadata } from 'next';
import {
  SITE_CONFIG,
  SEO_DEFAULTS,
  SEO_TEMPLATES,
  STRUCTURED_DATA_DEFAULTS,
  CANONICAL_URL_CONFIG,
  COMPANY_INFO
} from './seo-config';

/**
 * Interface for generating page-specific metadata
 */
interface MetadataProps {
  title?: string;
  description?: string;
  keywords?: string[];
  path?: string;
  image?: string;
  noIndex?: boolean;
  alternates?: {
    canonical?: string;
  };
}

/**
 * Interface for expert data used in SEO generation
 */
interface ExpertData {
  id: string;
  name: string;
  practiceArea: string;
  location?: string;
  bio?: string;
  specializations?: string[];
  image?: string;
  credentials?: string[];
  experience?: string;
}

/**
 * Interface for category data used in SEO generation
 */
interface CategoryData {
  name: string;
  slug: string;
  description: string;
  expertCount?: number;
  subcategories?: Array<{
    name: string;
    slug: string;
    expertCount?: number;
  }>;
}

/**
 * Generate canonical URL for a given path
 */
export function generateCanonicalUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  const baseUrl = CANONICAL_URL_CONFIG.baseUrl.replace(/\/$/, '');
  const url = `${baseUrl}/${cleanPath}`;

  return CANONICAL_URL_CONFIG.trailingSlash && !url.endsWith('/')
    ? `${url}/`
    : url;
}

/**
 * Create page title with site name
 */
export function createPageTitle(title: string, includeSiteName = true): string {
  if (!includeSiteName) return title;

  // Avoid duplicate site names
  if (title.includes(SITE_CONFIG.name)) return title;

  return `${title} - ${SITE_CONFIG.name}`;
}

/**
 * Truncate description to optimal length for meta description
 */
export function truncateDescription(
  description: string,
  maxLength = 160
): string {
  if (description.length <= maxLength) return description;

  const truncated = description.slice(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0
    ? `${truncated.slice(0, lastSpace)}...`
    : `${truncated}...`;
}

/**
 * Generate metadata for any page
 */
export function generateMetadata(props: MetadataProps): Metadata {
  const {
    title,
    description,
    keywords = [],
    path = '',
    image,
    noIndex = false,
    alternates
  } = props;

  const pageTitle = title ? createPageTitle(title) : SEO_DEFAULTS.title;
  const pageDescription = description
    ? truncateDescription(description)
    : SEO_DEFAULTS.description;
  const canonicalUrl = alternates?.canonical || generateCanonicalUrl(path);
  const imageUrl = image
    ? `${SITE_CONFIG.url}${image}`
    : `${SITE_CONFIG.url}/og-image.jpg`;

  const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      type: 'website',
      locale: SITE_CONFIG.locale,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      title: pageTitle,
      description: pageDescription,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || SITE_CONFIG.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      site: SEO_DEFAULTS.twitter.site,
      creator: SEO_DEFAULTS.twitter.creator,
      title: pageTitle,
      description: pageDescription,
      images: [imageUrl]
    },
    robots: noIndex
      ? {
          index: false,
          follow: false
        }
      : SEO_DEFAULTS.robots
  };

  return metadata;
}

/**
 * Generate metadata for expert profile pages
 */
export function generateExpertMetadata(
  expert: ExpertData,
  path: string
): Metadata {
  const title = SEO_TEMPLATES.expertProfile.titleTemplate(
    expert.name,
    expert.practiceArea
  );
  const description = SEO_TEMPLATES.expertProfile.descriptionTemplate(
    expert.name,
    expert.practiceArea,
    expert.location
  );

  const keywords = [
    expert.name,
    `${expert.practiceArea} expert witness`,
    ...(expert.specializations || []),
    ...(expert.location ? [`expert witness ${expert.location}`] : []),
    'litigation support',
    'professional testimony'
  ];

  return generateMetadata({
    title,
    description,
    keywords,
    path,
    image: expert.image
  });
}

/**
 * Generate metadata for category pages
 */
export function generateCategoryMetadata(
  category: CategoryData,
  path: string
): Metadata {
  const title = SEO_TEMPLATES.category.titleTemplate(category.name);
  const description = SEO_TEMPLATES.category.descriptionTemplate(
    category.name,
    category.expertCount
  );

  const keywords = [
    `${category.name} expert witness`,
    `${category.name} expert`,
    `${category.name} litigation support`,
    ...(category.subcategories?.map((sub) => `${sub.name} expert witness`) ||
      []),
    'professional testimony',
    'case consultation'
  ];

  return generateMetadata({
    title,
    description,
    keywords,
    path
  });
}

/**
 * Generate metadata for subcategory pages
 */
export function generateSubcategoryMetadata(
  subcategory: string,
  category: CategoryData,
  path: string,
  expertCount?: number
): Metadata {
  const title = SEO_TEMPLATES.subcategory.titleTemplate(
    subcategory,
    category.name
  );
  const description = SEO_TEMPLATES.subcategory.descriptionTemplate(
    subcategory,
    category.name,
    expertCount
  );

  const keywords = [
    `${subcategory} expert witness`,
    `${subcategory} expert`,
    `${category.name} expert witness`,
    `${subcategory} litigation support`,
    'professional testimony',
    'expert consultation'
  ];

  return generateMetadata({
    title,
    description,
    keywords,
    path
  });
}

/**
 * Generate JSON-LD structured data for expert profiles
 */
export function generateExpertStructuredData(expert: ExpertData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: expert.name,
    jobTitle: `${expert.practiceArea} Expert Witness`,
    description:
      expert.bio ||
      `Professional ${expert.practiceArea} expert witness providing litigation support and testimony services.`,
    url: `${SITE_CONFIG.url}/expert/${expert.id}`,
    image: expert.image ? `${SITE_CONFIG.url}${expert.image}` : undefined,
    address: expert.location
      ? {
          '@type': 'PostalAddress',
          addressLocality: expert.location
        }
      : undefined,
    knowsAbout: expert.specializations,
    hasCredential: expert.credentials?.map((credential) => ({
      '@type': 'EducationalOccupationalCredential',
      name: credential
    })),
    worksFor: {
      '@type': 'Organization',
      name: COMPANY_INFO.name,
      url: SITE_CONFIG.url
    },
    makesOffer: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        name: `${expert.practiceArea} Expert Witness Services`,
        description:
          'Professional expert witness testimony and litigation support services'
      }
    }
  };
}

/**
 * Generate JSON-LD structured data for organization
 */
export function generateOrganizationStructuredData() {
  return STRUCTURED_DATA_DEFAULTS.organization;
}

/**
 * Generate JSON-LD structured data for website
 */
export function generateWebsiteStructuredData() {
  return STRUCTURED_DATA_DEFAULTS.website;
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(
  breadcrumbs: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http')
        ? crumb.url
        : `${SITE_CONFIG.url}${crumb.url}`
    }))
  };
}

/**
 * Generate FAQ structured data from content
 */
export function generateFAQStructuredData(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

/**
 * Generate local business structured data (if needed for specific experts)
 */
export function generateLocalBusinessStructuredData(businessData: {
  name: string;
  address?: string;
  phone?: string;
  website?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: businessData.name,
    url: businessData.website || SITE_CONFIG.url,
    telephone: businessData.phone,
    address: businessData.address
      ? {
          '@type': 'PostalAddress',
          streetAddress: businessData.address
        }
      : undefined
  };
}

/**
 * Helper function to create structured data script content
 */
export function createStructuredDataScript(data: any): string {
  return JSON.stringify(data);
}
