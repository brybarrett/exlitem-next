import type { ExpertProfile } from '@/types';

export const mockExperts: ExpertProfile[] = [
  {
    uuid: '1',
    id: '1',
    name: 'Dr. Sarah Johnson, MD',
    title: 'Emergency Medicine & Trauma Surgery Expert',
    slug: 'dr-sarah-johnson-md',
    imageUrl:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    isVerified: true,
    status: 'Premium',
    practiceAreas: [
      'Medical Malpractice',
      'Emergency Medicine',
      'Trauma Surgery'
    ],
    location: { city: 'Boston', state: 'MA', country: 'US' },
    hourlyRate: 750,
    bio: 'Dr. Sarah Johnson is a board-certified emergency physician with over 15 years of experience in trauma surgery and emergency medicine. She has served as Chief of Emergency Medicine at Massachusetts General Hospital and has provided expert testimony in over 200 cases.',
    specialties: [
      'Emergency Medicine',
      'Trauma Surgery',
      'Critical Care',
      'Medical Malpractice'
    ],
    expertExperience: {
      totalCases: 234,
      cases: 180,
      depositions: 156,
      trials: 78
    },
    isAvailable: true,
    avgResponseTime: '2 hours',
    rating: 4.9,
    reviewCount: 127,
    languages: ['English'],
    gatekeeperDataAvailable: true,
    visibilitySettings: {
      showGatekeeperTeaser: true,
      showWorkExperience: true,
      showEducation: true,
      showPublications: true,
      showSocialMedia: true,
      showContactInfo: true,
      showCertifications: true,
      showLicenses: true,
      showAwards: true,
      showMedia: true
    },
    workExperience: [
      {
        title: 'Chief of Emergency Medicine',
        company: 'Massachusetts General Hospital',
        startDate: '2015',
        endDate: 'Present',
        description:
          'Leading emergency department operations and trauma care protocols'
      }
    ],
    education: [
      {
        degree: 'MD',
        institution: 'Harvard Medical School',
        year: 2005,
        field: 'Medicine'
      }
    ]
  },
  {
    uuid: '2',
    id: '2',
    name: 'Dr. Michael Chen, PE',
    title: 'Structural Engineering Expert',
    slug: 'dr-michael-chen-pe',
    imageUrl:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    isVerified: true,
    status: 'Verified',
    practiceAreas: [
      'Structural Engineering',
      'Construction Defects',
      'Building Codes'
    ],
    location: { city: 'Los Angeles', state: 'CA', country: 'US' },
    hourlyRate: 550,
    bio: 'Dr. Michael Chen is a licensed Professional Engineer with expertise in structural analysis and building failures. He has investigated over 300 construction defect cases and authored numerous technical publications.',
    specialties: [
      'Structural Engineering',
      'Construction Defects',
      'Seismic Design'
    ],
    expertExperience: {
      totalCases: 156,
      cases: 125,
      depositions: 89,
      trials: 45
    },
    isAvailable: true,
    avgResponseTime: '4 hours',
    rating: 4.7,
    reviewCount: 83,
    languages: ['English', 'Mandarin'],
    gatekeeperDataAvailable: true
  },
  {
    uuid: '3',
    id: '3',
    name: 'Dr. Emily Rodriguez, MD',
    title: 'Forensic Accounting Expert',
    slug: 'dr-emily-rodriguez-cpa',
    imageUrl:
      'https://images.unsplash.com/photo-1594824883303-383c5c5c5666?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    isVerified: true,
    status: 'Verified',
    practiceAreas: [
      'Forensic Accounting',
      'Economic Damages',
      'Business Valuation'
    ],
    location: { city: 'Chicago', state: 'IL', country: 'US' },
    hourlyRate: 650,
    bio: 'Dr. Emily Rodriguez is a CPA and CFF with over 12 years of experience in forensic accounting and economic damage analysis. She specializes in complex financial investigations and business valuation disputes.',
    specialties: [
      'Forensic Accounting',
      'Economic Damages',
      'Business Valuation',
      'Financial Analysis'
    ],
    expertExperience: {
      totalCases: 98,
      cases: 75,
      depositions: 62,
      trials: 28
    },
    isAvailable: true,
    avgResponseTime: '3 hours',
    rating: 4.8,
    reviewCount: 56,
    languages: ['English', 'Spanish'],
    gatekeeperDataAvailable: true
  },
  {
    uuid: '4',
    id: '4',
    name: 'John Smith, PhD',
    title: 'Automotive Safety Engineer',
    slug: 'john-smith-phd',
    imageUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    isVerified: false,
    status: 'Unclaimed',
    practiceAreas: [
      'Vehicle Design',
      'Accident Reconstruction',
      'Safety Systems'
    ],
    location: { city: 'Detroit', state: 'MI', country: 'US' },
    hourlyRate: 450,
    bio: 'Dr. John Smith is an automotive engineer with 20+ years at Ford Motor Company specializing in vehicle safety systems and crashworthiness analysis.',
    specialties: [
      'Automotive Engineering',
      'Accident Reconstruction',
      'Safety Systems'
    ],
    expertExperience: {
      totalCases: 67,
      cases: 45,
      depositions: 34,
      trials: 12
    },
    isAvailable: false,
    avgResponseTime: 'Unknown',
    rating: 4.5,
    reviewCount: 23,
    languages: ['English'],
    gatekeeperDataAvailable: false
  },
  {
    uuid: '5',
    id: '5',
    name: 'Dr. Lisa Park, MD',
    title: 'Neurology & Brain Injury Expert',
    slug: 'dr-lisa-park-md',
    imageUrl:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    isVerified: true,
    status: 'Premium',
    practiceAreas: ['Neurology', 'Brain Injury', 'Medical Malpractice'],
    location: { city: 'Houston', state: 'TX', country: 'US' },
    hourlyRate: 850,
    bio: 'Dr. Lisa Park is a board-certified neurologist specializing in traumatic brain injury and neurological disorders. She has over 18 years of clinical experience and extensive litigation support background.',
    specialties: [
      'Neurology',
      'Brain Injury',
      'Cognitive Assessment',
      'Rehabilitation Medicine'
    ],
    expertExperience: {
      totalCases: 189,
      cases: 142,
      depositions: 118,
      trials: 56
    },
    isAvailable: true,
    avgResponseTime: '1 hour',
    rating: 4.9,
    reviewCount: 94,
    languages: ['English', 'Korean'],
    gatekeeperDataAvailable: true,
    visibilitySettings: {
      showGatekeeperTeaser: true,
      showWorkExperience: true,
      showEducation: true,
      showPublications: true,
      showSocialMedia: true,
      showContactInfo: true,
      showCertifications: true,
      showLicenses: true,
      showAwards: true,
      showMedia: true
    }
  },
  {
    uuid: '6',
    id: '6',
    name: 'Robert Davis, PE',
    title: 'Civil Engineering Expert',
    slug: 'robert-davis-pe',
    imageUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    isVerified: true,
    status: 'Claimed',
    practiceAreas: ['Civil Engineering', 'Traffic Engineering', 'Road Design'],
    location: { city: 'Atlanta', state: 'GA', country: 'US' },
    hourlyRate: 425,
    bio: 'Robert Davis is a licensed Professional Engineer with expertise in traffic engineering and roadway design. He has investigated numerous traffic accident cases and infrastructure failures.',
    specialties: ['Civil Engineering', 'Traffic Engineering', 'Highway Safety'],
    expertExperience: { totalCases: 43, cases: 32, depositions: 24, trials: 8 },
    isAvailable: true,
    avgResponseTime: '6 hours',
    rating: 4.3,
    reviewCount: 18,
    languages: ['English'],
    gatekeeperDataAvailable: true
  },
  {
    uuid: '7',
    id: '7',
    name: 'Dr. Jennifer Williams, PhD',
    title: 'Chemical Engineering Expert',
    slug: 'dr-jennifer-williams-phd',
    imageUrl:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    isVerified: true,
    status: 'Verified',
    practiceAreas: [
      'Chemical Engineering',
      'Environmental Engineering',
      'Industrial Safety'
    ],
    location: { city: 'Denver', state: 'CO', country: 'US' },
    hourlyRate: 575,
    bio: 'Dr. Jennifer Williams is a chemical engineer with expertise in industrial processes and environmental safety. She has consulted on major environmental litigation and industrial accident cases.',
    specialties: [
      'Chemical Engineering',
      'Environmental Safety',
      'Process Design'
    ],
    expertExperience: {
      totalCases: 78,
      cases: 58,
      depositions: 45,
      trials: 19
    },
    isAvailable: true,
    avgResponseTime: '4 hours',
    rating: 4.6,
    reviewCount: 42,
    languages: ['English'],
    gatekeeperDataAvailable: true
  },
  {
    uuid: '8',
    id: '8',
    name: 'Mark Thompson, CPA',
    title: 'Economic Damages Expert',
    slug: 'mark-thompson-cpa',
    imageUrl:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    isVerified: false,
    status: 'Unclaimed',
    practiceAreas: ['Economic Damages', 'Lost Profits', 'Business Valuation'],
    location: { city: 'Phoenix', state: 'AZ', country: 'US' },
    hourlyRate: 400,
    bio: 'Mark Thompson is a CPA specializing in economic damage analysis and business valuation. He has over 15 years of experience in complex financial analysis for litigation support.',
    specialties: ['Economic Analysis', 'Lost Profits', 'Damage Quantification'],
    expertExperience: {
      totalCases: 52,
      cases: 38,
      depositions: 29,
      trials: 14
    },
    isAvailable: false,
    avgResponseTime: 'Unknown',
    rating: 4.4,
    reviewCount: 31,
    languages: ['English'],
    gatekeeperDataAvailable: false
  },
  {
    uuid: '9',
    id: '9',
    name: 'Dr. David Kim, MD',
    title: 'Orthopedic Surgery Expert',
    slug: 'dr-david-kim-md',
    imageUrl:
      'https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    isVerified: true,
    status: 'Verified',
    practiceAreas: ['Orthopedic Surgery', 'Sports Medicine', 'Personal Injury'],
    location: { city: 'Seattle', state: 'WA', country: 'US' },
    hourlyRate: 675,
    bio: 'Dr. David Kim is a board-certified orthopedic surgeon with subspecialty training in sports medicine. He has extensive experience in personal injury cases involving musculoskeletal trauma.',
    specialties: ['Orthopedic Surgery', 'Sports Medicine', 'Trauma Surgery'],
    expertExperience: {
      totalCases: 134,
      cases: 98,
      depositions: 76,
      trials: 42
    },
    isAvailable: true,
    avgResponseTime: '3 hours',
    rating: 4.7,
    reviewCount: 68,
    languages: ['English', 'Korean'],
    gatekeeperDataAvailable: true
  },
  {
    uuid: '10',
    id: '10',
    name: 'Susan Clark, PhD',
    title: 'Software Engineering Expert',
    slug: 'susan-clark-phd',
    imageUrl:
      'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    isVerified: true,
    status: 'Premium',
    practiceAreas: [
      'Software Engineering',
      'Cybersecurity',
      'Intellectual Property'
    ],
    location: { city: 'San Francisco', state: 'CA', country: 'US' },
    hourlyRate: 800,
    bio: 'Dr. Susan Clark is a software engineering expert with over 20 years in Silicon Valley. She specializes in patent disputes, trade secret litigation, and cybersecurity incidents.',
    specialties: [
      'Software Engineering',
      'Cybersecurity',
      'Patent Analysis',
      'Code Review'
    ],
    expertExperience: {
      totalCases: 167,
      cases: 128,
      depositions: 95,
      trials: 48
    },
    isAvailable: true,
    avgResponseTime: '2 hours',
    rating: 4.8,
    reviewCount: 85,
    languages: ['English'],
    gatekeeperDataAvailable: true,
    visibilitySettings: {
      showGatekeeperTeaser: true,
      showWorkExperience: true,
      showEducation: true,
      showPublications: true,
      showSocialMedia: true,
      showContactInfo: true,
      showCertifications: true,
      showLicenses: true,
      showAwards: true,
      showMedia: true
    }
  },
  {
    id: '11',
    name: 'Dr. Amanda Foster, JD, PhD',
    title: 'Environmental Law & Science Expert',
    slug: 'dr-amanda-foster-jd-phd',
    imageUrl:
      'https://images.unsplash.com/photo-1494790108755-2616b612b4e0?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    isVerified: true,
    status: 'Premium',
    practiceAreas: [
      'Environmental Law',
      'Environmental Science',
      'Toxic Torts'
    ],
    location: { city: 'Portland', state: 'OR', country: 'US' },
    hourlyRate: 725,
    bio: 'Dr. Amanda Foster holds both JD and PhD degrees and specializes in environmental litigation. She has testified in major environmental contamination cases and regulatory disputes.',
    specialties: [
      'Environmental Law',
      'Contamination Assessment',
      'Regulatory Compliance',
      'Groundwater Analysis'
    ],
    expertExperience: {
      totalCases: 201,
      cases: 156,
      depositions: 134,
      trials: 67
    },
    isAvailable: true,
    avgResponseTime: '90 minutes',
    rating: 4.9,
    reviewCount: 112,
    languages: ['English'],
    gatekeeperDataAvailable: true
  },
  {
    id: '12',
    name: 'Captain James Rodriguez',
    title: 'Fire Safety & Investigation Expert',
    slug: 'captain-james-rodriguez',
    imageUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop&crop=face&auto=format&q=80',
    isVerified: true,
    status: 'Verified',
    practiceAreas: [
      'Fire Investigation',
      'Arson Investigation',
      'Building Codes'
    ],
    location: { city: 'Miami', state: 'FL', country: 'US' },
    hourlyRate: 475,
    bio: 'Captain James Rodriguez is a retired fire chief with 25+ years in fire investigation. He is certified by the International Association of Arson Investigators.',
    specialties: [
      'Fire Investigation',
      'Arson Analysis',
      'Code Compliance',
      'Emergency Response'
    ],
    expertExperience: {
      totalCases: 89,
      cases: 67,
      depositions: 54,
      trials: 23
    },
    isAvailable: true,
    avgResponseTime: '4 hours',
    rating: 4.6,
    reviewCount: 47,
    languages: ['English', 'Spanish'],
    gatekeeperDataAvailable: true
  },
  {
    id: '13',
    name: 'Patricia Wong, Esq.',
    title: 'Intellectual Property Attorney',
    slug: 'patricia-wong-esq',
    imageUrl: '/experts/patricia-wong.jpg',
    isVerified: true,
    status: 'Claimed',
    practiceAreas: ['Intellectual Property', 'Patent Law', 'Trade Secrets'],
    location: { city: 'Austin', state: 'TX', country: 'US' },
    hourlyRate: 625,
    bio: 'Patricia Wong is a registered patent attorney with expertise in technology patent disputes. She has handled numerous trade secret and IP litigation matters.',
    specialties: [
      'Patent Analysis',
      'Trade Secret Protection',
      'Technology Licensing',
      'IP Valuation'
    ],
    expertExperience: {
      totalCases: 76,
      cases: 58,
      depositions: 42,
      trials: 19
    },
    isAvailable: true,
    avgResponseTime: '5 hours',
    rating: 4.5,
    reviewCount: 34,
    languages: ['English', 'Mandarin'],
    gatekeeperDataAvailable: true
  },
  {
    id: '14',
    name: 'Detective Frank Miller (Ret.)',
    title: 'Financial Crime Investigation Expert',
    slug: 'detective-frank-miller-ret',
    imageUrl: '/experts/frank-miller.jpg',
    isVerified: false,
    status: 'Unclaimed',
    practiceAreas: [
      'Financial Crime',
      'Fraud Investigation',
      'Digital Forensics'
    ],
    location: { city: 'Las Vegas', state: 'NV', country: 'US' },
    hourlyRate: 375,
    bio: 'Detective Frank Miller (Ret.) spent 20 years investigating financial crimes and fraud cases. He specializes in complex financial fraud and digital evidence analysis.',
    specialties: [
      'Financial Fraud',
      'Digital Forensics',
      'Money Laundering',
      'Evidence Analysis'
    ],
    expertExperience: {
      totalCases: 45,
      cases: 32,
      depositions: 26,
      trials: 9
    },
    isAvailable: false,
    avgResponseTime: 'Unknown',
    rating: 4.2,
    reviewCount: 19,
    languages: ['English'],
    gatekeeperDataAvailable: false
  },
  {
    id: '15',
    name: 'Dr. Maria Gonzalez, PE',
    title: 'Maritime Engineering Expert',
    slug: 'dr-maria-gonzalez-pe',
    imageUrl: '/experts/maria-gonzalez.jpg',
    isVerified: true,
    status: 'Premium',
    practiceAreas: ['Maritime Engineering', 'Ship Design', 'Marine Accidents'],
    location: { city: 'New Orleans', state: 'LA', country: 'US' },
    hourlyRate: 695,
    bio: 'Dr. Maria Gonzalez is a maritime engineer with expertise in ship design and marine accident investigation. She has worked on major vessel casualty cases worldwide.',
    specialties: [
      'Maritime Engineering',
      'Vessel Design',
      'Marine Safety',
      'Offshore Structures'
    ],
    expertExperience: {
      totalCases: 123,
      cases: 89,
      depositions: 72,
      trials: 38
    },
    isAvailable: true,
    avgResponseTime: '3 hours',
    rating: 4.8,
    reviewCount: 71,
    languages: ['English', 'Spanish'],
    gatekeeperDataAvailable: true
  },
  {
    id: '16',
    name: 'Captain William Thompson',
    title: 'Aviation Safety Expert',
    slug: 'captain-william-thompson',
    imageUrl: '/experts/william-thompson.jpg',
    isVerified: true,
    status: 'Verified',
    practiceAreas: ['Aviation Safety', 'Pilot Training', 'Aircraft Accidents'],
    location: { city: 'Dallas', state: 'TX', country: 'US' },
    hourlyRate: 525,
    bio: 'Captain William Thompson is a former airline pilot with 30+ years of experience. He specializes in aviation accident investigation and pilot performance analysis.',
    specialties: [
      'Aviation Safety',
      'Accident Investigation',
      'Flight Operations',
      'Pilot Performance'
    ],
    expertExperience: {
      totalCases: 67,
      cases: 48,
      depositions: 37,
      trials: 16
    },
    isAvailable: true,
    avgResponseTime: '6 hours',
    rating: 4.7,
    reviewCount: 29,
    languages: ['English'],
    gatekeeperDataAvailable: true
  },
  {
    id: '17',
    name: 'Thomas Anderson, MAI',
    title: 'Real Estate Appraisal Expert',
    slug: 'thomas-anderson-mai',
    imageUrl: '/experts/thomas-anderson.jpg',
    isVerified: true,
    status: 'Claimed',
    practiceAreas: [
      'Real Estate Appraisal',
      'Property Valuation',
      'Commercial Real Estate'
    ],
    location: { city: 'Nashville', state: 'TN', country: 'US' },
    hourlyRate: 450,
    bio: 'Thomas Anderson is a MAI-designated appraiser with expertise in complex commercial and residential property valuations. He specializes in litigation support and damage assessment.',
    specialties: [
      'Property Valuation',
      'Market Analysis',
      'Damage Assessment',
      'Eminent Domain'
    ],
    expertExperience: {
      totalCases: 92,
      cases: 71,
      depositions: 56,
      trials: 24
    },
    isAvailable: true,
    avgResponseTime: '8 hours',
    rating: 4.4,
    reviewCount: 38,
    languages: ['English'],
    gatekeeperDataAvailable: true
  },
  {
    id: '18',
    name: 'Dr. Rachel Green, PhD',
    title: 'Toxicology & Environmental Health Expert',
    slug: 'dr-rachel-green-phd',
    imageUrl: '/experts/rachel-green.jpg',
    isVerified: true,
    status: 'Verified',
    practiceAreas: ['Toxicology', 'Environmental Health', 'Product Liability'],
    location: { city: 'Minneapolis', state: 'MN', country: 'US' },
    hourlyRate: 615,
    bio: 'Dr. Rachel Green is a board-certified toxicologist with expertise in chemical exposure assessment and environmental health risks. She has worked on major product liability and toxic tort cases.',
    specialties: [
      'Toxicology',
      'Chemical Exposure',
      'Risk Assessment',
      'Product Safety'
    ],
    expertExperience: {
      totalCases: 145,
      cases: 112,
      depositions: 89,
      trials: 41
    },
    isAvailable: true,
    avgResponseTime: '2 hours',
    rating: 4.8,
    reviewCount: 67,
    languages: ['English'],
    gatekeeperDataAvailable: true
  }
];

export function getExpertBySlug(slug: string): ExpertProfile | undefined {
  return mockExperts.find((expert) => expert.slug === slug);
}

export function searchExperts(filters: {
  practiceArea?: string;
  location?: string;
  feeRange?: { min: number; max: number };
  availability?: boolean;
  query?: string;
}) {
  let filtered = [...mockExperts];

  if (filters.query) {
    const query = filters.query.toLowerCase();
    filtered = filtered.filter(
      (expert) =>
        expert.name.toLowerCase().includes(query) ||
        expert.title?.toLowerCase().includes(query) ||
        expert.specialties?.some((s) => s.toLowerCase().includes(query)) ||
        expert.practiceAreas?.some((p) => p.toLowerCase().includes(query))
    );
  }

  if (filters.practiceArea) {
    filtered = filtered.filter((expert) =>
      expert.practiceAreas?.includes(filters.practiceArea!)
    );
  }

  if (filters.location) {
    filtered = filtered.filter(
      (expert) => expert.location?.state === filters.location
    );
  }

  if (filters.feeRange) {
    filtered = filtered.filter(
      (expert) =>
        expert.hourlyRate &&
        expert.hourlyRate >= filters.feeRange!.min &&
        expert.hourlyRate <= filters.feeRange!.max
    );
  }

  if (filters.availability) {
    filtered = filtered.filter((expert) => expert.isAvailable);
  }

  return filtered;
}
