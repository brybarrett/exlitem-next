export interface ExpertProfile {
  uuid?: string;
  id: string;
  name: string;
  title?: string;
  first_name?: string;
  last_name?: string;
  middle_name?: string;
  salutation?: string;
  personal_suffix?: string;
  professional_suffix?: string;
  profile_introduction?: string;
  slug?: string;
  currentPosition?: string;
  imageUrl?: string;
  isVerified: boolean;
  bio?: string;
  status?: 'Unclaimed' | 'Claimed' | 'Verified' | 'Premium';
  practiceAreas?: string[];
  hourlyRate?: number;
  isAvailable?: boolean;
  avgResponseTime?: string;
  rating?: number;
  reviewCount?: number;
  profile_type?: string;
  visibilitySettings?: {
    showGatekeeperTeaser: boolean;
    showWorkExperience: boolean;
    showEducation: boolean;
    showPublications: boolean;
    showSocialMedia: boolean;
    showContactInfo: boolean;
    showCertifications: boolean;
    showLicenses: boolean;
    showAwards: boolean;
    showMedia: boolean;
  };
  gatekeeperDataAvailable?: boolean;
  location?: {
    city: string;
    state: string;
    country: string;
  };
  specialties?: string[];
  expertExperience?: {
    totalCases: number;
    cases: number;
    depositions: number;
    trials: number;
  };
  workExperience?: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }>;
  education?: Array<{
    degree: string;
    institution: string;
    year: number;
    field: string;
  }>;
  licenses?: Array<{
    name: string;
    issuer: string;
    year: number;
    state: string;
    number: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    year: number;
    expiryDate?: string;
  }>;
  publications?: Array<{
    title: string;
    journal: string;
    year: number;
    url?: string;
  }>;
  media?: Array<{
    type: 'video' | 'image';
    url: string;
    title: string;
    description?: string;
  }>;
  languages?: string[];
  availability?: {
    isAvailable: boolean;
    nextAvailable?: string;
  };
  similarExperts?: Array<{
    id: string;
    name: string;
    title?: string;
    imageUrl?: string;
    specialties?: string[];
  }>;
  socialMedia?: Array<{
    platform: string;
    username: string;
    url: string;
  }>;
  awards?: Array<{
    title: string;
    issuer: string;
    date: string;
    description?: string;
  }>;
}
