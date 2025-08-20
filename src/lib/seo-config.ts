/**
 * SEO Configuration for Exlitem Expert Witness Platform
 * Centralized SEO constants, defaults, and templates
 */

export const SITE_CONFIG = {
  name: 'Exlitem',
  title: 'Find Expert Witnesses | Research Experts | Exlitem AI Expert Search',
  description:
    'AI powered expert witness search and research platform for litigation and dispute resolution professionals.',
  url: 'https://exlitem.com',
  domain: 'exlitem.com',
  locale: 'en_US',
  type: 'website'
};

export const COMPANY_INFO = {
  name: 'Exlitem',
  legalName: 'Exlitem, Inc.',
  description:
    'Leading expert witness directory and legal research platform connecting attorneys with qualified expert witnesses across all practice areas.',
  phone: '(866) 955-4836',
  email: 'support@exlitem.com',
  address: {
    streetAddress: '228 Park Ave S PMB 431825',
    addressLocality: 'New York',
    addressRegion: 'NY',
    postalCode: '10003',
    addressCountry: 'US'
  },
  founded: '2024',
  industry: 'Legal Technology',
  socialMedia: {
    linkedin: 'https://linkedin.com/company/exlitem',
    twitter: 'https://twitter.com/exlitem',
    facebook: 'https://facebook.com/exlitem',
    instagram: 'https://instagram.com/exlitem_',
    youtube: 'https://youtube.com/@exlitem',
    github: 'https://github.com/exlitemtech'
  }
};

export const SEO_DEFAULTS = {
  title: SITE_CONFIG.title,
  description: SITE_CONFIG.description,
  openGraph: {
    type: 'website' as const,
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [
      {
        url: `${SITE_CONFIG.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Exlitem: AI Expert Witness Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image' as const,
    site: '@exlitem',
    creator: '@exlitem',
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description,
    images: [`${SITE_CONFIG.url}/twitter-image.jpg`]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large' as 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'b_tkcre9K_uoNv9Dc2pvCSc4Ajfb8-zNSD81WdB5FTA', // Add Google Search Console verification ID
    bing: 'FBAE64CA4C1A3419794FF5E3169EED4B' // Add Bing Webmaster verification ID
  }
};

export const SEO_TEMPLATES = {
  home: {
    title:
      'Find Expert Witnesses | AI Enabled Expert Witness Platform - Exlitem',
    description:
      'Connect with qualified expert witnesses across medical, engineering, financial, and technical fields. Verified professionals ready to support your litigation needs.'
  },
  directory: {
    title: 'Expert Witness Directory | Find Qualified Experts by Practice Area',
    description:
      'Browse our comprehensive directory of expert witnesses. Search by practice area, location, and expertise to find the perfect expert for your case.'
  },
  expertProfile: {
    titleTemplate: (name: string, practiceArea: string) =>
      `${name} - ${practiceArea} Expert Witness | Exlitem`,
    descriptionTemplate: (
      name: string,
      practiceArea: string,
      location?: string
    ) =>
      `${name} is a qualified ${practiceArea} expert witness${location ? ` in ${location}` : ''}. View credentials, experience, and contact information for your litigation needs.`
  },
  category: {
    titleTemplate: (category: string) =>
      `${category} Expert Witnesses | Find Qualified ${category} Experts - Exlitem`,
    descriptionTemplate: (category: string, expertCount?: number) =>
      `Find qualified ${category} expert witnesses for your case. ${expertCount ? `Browse ${expertCount} verified experts` : 'Browse our verified experts'} with proven litigation experience.`
  },
  subcategory: {
    titleTemplate: (subcategory: string, category: string) =>
      `${subcategory} Expert Witnesses | ${category} Specialists - Exlitem`,
    descriptionTemplate: (
      subcategory: string,
      category: string,
      expertCount?: number
    ) =>
      `Connect with ${subcategory} expert witnesses specializing in ${category}. ${expertCount ? `${expertCount} qualified experts` : 'Qualified experts'} available for consultation and testimony.`
  },
  searchConcierge: {
    title:
      'Expert Search Concierge | Let Us Find Your Expert Witness - Exlitem',
    description:
      "Our expert search concierge service helps you find the perfect expert witness for your case. Tell us your requirements and we'll handle the research and vetting."
  },
  blog: {
    title: 'Expert Witness Blog | Legal Insights & Expert Testimony Analysis',
    description:
      'Expert witness insights, litigation strategies, and legal analysis. Stay informed with the latest trends in expert testimony and professional consulting.'
  },
  podcast: {
    title:
      'On the Stand with Ashish Arun | Expert Witness Interviews & Legal Insights',
    description:
      'Listen to interviews with leading expert witnesses and legal professionals. Get insights into expert testimony, case strategies, and industry trends.'
  }
};

export const EXPERT_WITNESS_KEYWORDS = {
  primary: [
    'expert witness',
    'expert witnesses',
    'litigation expert',
    'forensic expert',
    'legal consultant',
    'professional witness',
    'technical expert',
    'industry expert'
  ],
  secondary: [
    'expert testimony',
    'litigation support',
    'forensic consulting',
    'expert opinion',
    'case expert',
    'trial expert',
    'consulting expert',
    'expert analysis'
  ],
  categories: [
    'medical expert witness',
    'engineering expert witness',
    'financial expert witness',
    'accounting expert witness',
    'construction expert witness',
    'technology expert witness',
    'psychology expert witness',
    'environmental expert witness'
  ],
  longTail: [
    'find expert witness for lawsuit',
    'hire expert witness for trial',
    'qualified expert witness directory',
    'professional expert witness services',
    'litigation expert consultant',
    'expert witness testimony services'
  ]
};

export const STRUCTURED_DATA_DEFAULTS = {
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY_INFO.name,
    legalName: COMPANY_INFO.legalName,
    description: COMPANY_INFO.description,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: COMPANY_INFO.phone,
      contactType: 'customer service',
      availableLanguage: 'English'
    },
    sameAs: Object.values(COMPANY_INFO.socialMedia)
  },
  website: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.url}/directory?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  }
};

export const PAGE_PRIORITIES = {
  home: 1.0,
  directory: 0.9,
  categories: 0.8,
  expertProfiles: 0.7,
  subcategories: 0.6,
  blog: 0.5,
  static: 0.4
};

export const CANONICAL_URL_CONFIG = {
  trailingSlash: true,
  baseUrl: SITE_CONFIG.url
};
