// Edge Runtime compatible content management utilities

import type {
  ExpertGuideContent,
  ContentMetadata,
  FAQItem,
  ContentSection,
  CategoryContent
} from '@/types/content';

// Embedded content data for Edge Runtime
const embeddedContent: Record<string, ExpertGuideContent> = {
  medical: {
    metadata: {
      title: 'Medical Expert Witnesses',
      description:
        'Comprehensive guide to medical expert witnesses and their role in legal proceedings',
      category: 'medical',
      lastUpdated: '2024-01-01T00:00:00.000Z',
      expertCount: 150
    },
    overview:
      'Medical expert witnesses play a crucial role in legal cases involving healthcare, personal injury, malpractice, and other medical-related disputes. These professionals provide specialized knowledge and testimony to help courts understand complex medical issues.',
    sections: [
      {
        id: 'section-1',
        title: 'Types of Medical Expert Witnesses',
        content:
          'Medical expert witnesses can specialize in various fields including:\n\n- **Forensic Psychiatry**: Mental health evaluations and competency assessments\n- **Cardiology**: Heart-related medical issues and treatments\n- **Orthopedics**: Bone and joint injuries and treatments\n- **Neurology**: Brain and nervous system disorders\n- **Emergency Medicine**: Acute care and trauma assessment\n- **Pathology**: Disease diagnosis and cause of death determination',
        order: 1
      },
      {
        id: 'section-2',
        title: 'Qualifications and Credentials',
        content:
          'Medical expert witnesses must possess:\n\n- Valid medical license in their state of practice\n- Board certification in their specialty\n- Active clinical practice or recent clinical experience\n- Experience in medical-legal consulting\n- Strong communication and testimony skills\n- Continuing education in their field',
        order: 2
      },
      {
        id: 'section-3',
        title: 'Role in Legal Proceedings',
        content:
          'Medical expert witnesses provide:\n\n- **Case Review**: Analysis of medical records and evidence\n- **Expert Opinions**: Professional assessment of medical issues\n- **Deposition Testimony**: Pre-trial sworn statements\n- **Trial Testimony**: Live testimony in court proceedings\n- **Report Writing**: Detailed written expert reports\n- **Cross-Examination**: Defense against opposing counsel questions',
        order: 3
      }
    ],
    faqs: [
      {
        id: 'faq-1',
        question:
          'What qualifications should I look for in a medical expert witness?',
        answer:
          'Look for board certification, active practice, relevant experience, and a track record of successful testimony. The expert should have specific experience in the medical issues relevant to your case.',
        order: 1
      },
      {
        id: 'faq-2',
        question: 'How much do medical expert witnesses typically cost?',
        answer:
          'Costs vary by specialty and experience, typically ranging from $300-$800 per hour for case review and $500-$1,500 per hour for testimony. Some experts charge flat rates for specific services.',
        order: 2
      },
      {
        id: 'faq-3',
        question: 'When should I hire a medical expert witness?',
        answer:
          'Hire early in case preparation to ensure proper case strategy. Medical experts can help identify key issues, review evidence, and prepare for depositions and trial testimony.',
        order: 3
      }
    ]
  },
  'medical/forensic-psychiatry': {
    metadata: {
      title: 'Forensic Psychiatry Expert Witnesses',
      description:
        'Specialized guide to forensic psychiatry expert witnesses for mental health and legal competency cases',
      category: 'medical',
      subcategory: 'forensic-psychiatry',
      lastUpdated: '2024-01-01T00:00:00.000Z',
      expertCount: 45
    },
    overview:
      'Forensic psychiatry expert witnesses specialize in the intersection of mental health and the legal system. They provide critical insights in cases involving competency, sanity, risk assessment, and mental health evaluations.',
    sections: [
      {
        id: 'section-1',
        title: 'Areas of Expertise',
        content:
          'Forensic psychiatrists specialize in:\n\n- **Competency Evaluations**: Assessing ability to stand trial or make legal decisions\n- **Insanity Defense**: Evaluating mental state at time of offense\n- **Risk Assessment**: Evaluating dangerousness and recidivism risk\n- **Child Custody**: Mental health evaluations for family court\n- **Personal Injury**: Psychological impact of trauma and injuries\n- **Workers Compensation**: Mental health aspects of workplace injuries',
        order: 1
      },
      {
        id: 'section-2',
        title: 'Evaluation Process',
        content:
          'Forensic psychiatric evaluations typically include:\n\n- Comprehensive clinical interview\n- Review of medical and legal records\n- Psychological testing when appropriate\n- Collateral interviews with family, friends, or professionals\n- Risk assessment using validated instruments\n- Detailed written report with findings and recommendations',
        order: 2
      },
      {
        id: 'section-3',
        title: 'Legal Applications',
        content:
          'Forensic psychiatrists provide expert testimony in:\n\n- Criminal cases (competency, insanity, sentencing)\n- Civil litigation (personal injury, malpractice)\n- Family court (custody, guardianship)\n- Administrative hearings (disability, employment)\n- Immigration cases (asylum, competency)\n- Workers compensation disputes',
        order: 3
      }
    ],
    faqs: [
      {
        id: 'faq-1',
        question:
          'What is the difference between a forensic psychiatrist and a regular psychiatrist?',
        answer:
          'Forensic psychiatrists have additional training in legal issues and courtroom procedures. They understand legal standards, can provide expert testimony, and are familiar with the intersection of mental health and law.',
        order: 1
      },
      {
        id: 'faq-2',
        question: 'How long does a forensic psychiatric evaluation take?',
        answer:
          'Evaluations typically take 4-8 hours of direct contact, plus time for record review and report writing. The entire process usually takes 2-4 weeks from initial contact to final report.',
        order: 2
      },
      {
        id: 'faq-3',
        question:
          'Can a forensic psychiatrist testify for both prosecution and defense?',
        answer:
          'Yes, forensic psychiatrists can work for either side. Their role is to provide objective, evidence-based opinions regardless of who retains them. However, they should disclose any conflicts of interest.',
        order: 3
      }
    ]
  },
  engineering: {
    metadata: {
      title: 'Engineering Expert Witnesses',
      description:
        'Comprehensive guide to engineering expert witnesses for technical and construction-related legal cases',
      category: 'engineering',
      lastUpdated: '2024-01-01T00:00:00.000Z',
      expertCount: 200
    },
    overview:
      'Engineering expert witnesses provide specialized technical knowledge in cases involving construction, product liability, accidents, and other engineering-related disputes. They help courts understand complex technical issues and determine liability.',
    sections: [
      {
        id: 'section-1',
        title: 'Engineering Specialties',
        content:
          'Engineering expert witnesses can specialize in:\n\n- **Civil Engineering**: Construction, structural analysis, infrastructure\n- **Mechanical Engineering**: Product design, machinery, equipment failure\n- **Electrical Engineering**: Electrical systems, electronics, power distribution\n- **Chemical Engineering**: Process safety, environmental issues, chemical exposure\n- **Industrial Engineering**: Workplace safety, ergonomics, efficiency\n- **Materials Engineering**: Material properties, failure analysis, corrosion',
        order: 1
      },
      {
        id: 'section-2',
        title: 'Common Case Types',
        content:
          'Engineering experts are involved in:\n\n- **Construction Defects**: Building failures, code violations, design errors\n- **Product Liability**: Defective products, design flaws, manufacturing issues\n- **Accident Reconstruction**: Vehicle accidents, workplace incidents, equipment failures\n- **Environmental Cases**: Pollution, contamination, regulatory compliance\n- **Patent Disputes**: Technical analysis of inventions and prior art\n- **Insurance Claims**: Damage assessment, cause analysis, cost estimation',
        order: 2
      },
      {
        id: 'section-3',
        title: 'Expert Services',
        content:
          'Engineering experts provide:\n\n- **Technical Analysis**: Detailed examination of evidence and documentation\n- **Failure Analysis**: Determining causes of accidents and failures\n- **Design Review**: Evaluating designs for safety and compliance\n- **Cost Estimation**: Calculating repair and replacement costs\n- **Expert Reports**: Comprehensive written technical reports\n- **Court Testimony**: Clear explanation of technical concepts to juries',
        order: 3
      }
    ],
    faqs: [
      {
        id: 'faq-1',
        question:
          'What qualifications should an engineering expert witness have?',
        answer:
          'Look for professional engineering license (PE), relevant experience, specialized knowledge in the case area, and experience providing expert testimony. Board certifications in specific engineering fields are also valuable.',
        order: 1
      },
      {
        id: 'faq-2',
        question: 'How do engineering experts determine the cause of failures?',
        answer:
          'They use systematic analysis including visual inspection, testing, computer modeling, review of documentation, and application of engineering principles. The process often involves multiple analysis methods.',
        order: 2
      },
      {
        id: 'faq-3',
        question: 'What is the typical cost for engineering expert services?',
        answer:
          'Rates vary by specialty and experience, typically $200-$600 per hour for analysis and $500-$1,200 per hour for testimony. Complex cases may require significant time for thorough analysis.',
        order: 3
      }
    ]
  }
};

/**
 * Maps URL segments to content keys
 */
function mapUrlToContentKey(
  categorySlug: string,
  subcategorySlug?: string
): string | null {
  const categoryMappings: Record<string, string> = {
    medical: 'medical',
    engineering: 'engineering',
    'accounting-finance': 'accounting-finance',
    'law-enforcement': 'law-enforcement',
    psychology: 'psychology',
    technology: 'technology',
    construction: 'construction',
    environmental: 'environmental'
  };

  const mappedCategory = categoryMappings[categorySlug];
  if (!mappedCategory) return null;

  if (subcategorySlug) {
    const subcategoryMappings: Record<string, string> = {
      'forensic-psychiatry': 'forensic-psychiatry',
      cardiology: 'cardiology',
      orthopedics: 'orthopedics',
      neurology: 'neurology'
    };

    const mappedSubcategory = subcategoryMappings[subcategorySlug];
    if (!mappedSubcategory) return null;

    return `${mappedCategory}/${mappedSubcategory}`;
  }

  return mappedCategory;
}

/**
 * Creates fallback content when specific content is not found
 */
function createFallbackContent(
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
      lastUpdated: new Date().toISOString(),
      expertCount: 0
    },
    overview: `Comprehensive guide to ${displayName.toLowerCase()} and their role in legal proceedings.`,
    sections: [],
    faqs: []
  };
}

/**
 * Loads expert guide content for Edge Runtime
 */
export async function loadExpertGuideContentEdge(
  category: string,
  subcategory?: string,
  forceFresh = false
): Promise<ExpertGuideContent> {
  try {
    const contentKey = mapUrlToContentKey(category, subcategory);

    if (!contentKey) {
      return createFallbackContent(category, subcategory);
    }

    const content = embeddedContent[contentKey];

    if (!content) {
      return createFallbackContent(category, subcategory);
    }

    return content;
  } catch (error) {
    console.error('Error loading expert guide content (Edge):', error);
    return createFallbackContent(category, subcategory);
  }
}

/**
 * Gets raw markdown content for Edge Runtime
 */
export function getRawMarkdownEdge(
  category: string,
  subcategory?: string
): string | null {
  try {
    const contentKey = mapUrlToContentKey(category, subcategory);

    if (!contentKey) {
      return null;
    }

    const content = embeddedContent[contentKey];

    if (!content) {
      return null;
    }

    // Convert structured content back to markdown format
    let markdown = `---\n`;
    markdown += `title: ${content.metadata.title}\n`;
    markdown += `description: ${content.metadata.description}\n`;
    markdown += `category: ${content.metadata.category}\n`;
    if (content.metadata.subcategory) {
      markdown += `subcategory: ${content.metadata.subcategory}\n`;
    }
    markdown += `expertCount: ${content.metadata.expertCount}\n`;
    markdown += `lastUpdated: ${content.metadata.lastUpdated}\n`;
    markdown += `---\n\n`;

    markdown += `${content.overview}\n\n`;

    content.sections.forEach((section) => {
      markdown += `## ${section.title}\n\n${section.content}\n\n`;
    });

    return markdown;
  } catch (error) {
    console.error('Error getting raw markdown (Edge):', error);
    return null;
  }
}
