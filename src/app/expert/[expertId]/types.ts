import type { ExpertProfile } from '@/types';

export type ExpertStatus = 'Unclaimed' | 'Claimed' | 'Verified' | 'Premium';

export interface ProfileVisibilitySettings {
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
}

export interface ProfileVariantProps {
  expert: ExpertProfile;
}
