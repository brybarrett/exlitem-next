// Work Experience Types
export type Position = {
  title: string;
  organization: string;
  period: string;
  description: string;
};

export type WorkExperienceData = {
  positions: Position[];
  lockedCount: number;
};

// Education Types
export type Degree = {
  degree: string;
  institution: string;
  period: string;
  details: string;
};

export type EducationData = {
  degrees: Degree[];
  lockedCount: number;
};

// Credentials Types
export type License = {
  name: string;
  details: string;
  expires: string;
  status: string;
};

export type Certification = {
  name: string;
  issuer: string;
  renewed: string;
  status: string;
};

export type CredentialsData = {
  licenses: License[];
  certifications: Certification[];
  lockedCount: number;
};

// Memberships Types
export type Organization = {
  name: string;
  status: string;
  since: string;
};

export type MembershipsData = {
  organizations: Organization[];
  lockedCount: number;
};

// Awards Types
export type Honor = {
  name: string;
  organization: string;
  year: string;
  description: string;
};

export type AwardsData = {
  honors: Honor[];
  lockedCount: number;
};

// Networking Types
export type NetworkingEvent = {
  name: string;
  location: string;
  date: string;
  role: string;
  month: string;
  day: string;
};

export type NetworkingData = {
  events: NetworkingEvent[];
  lockedCount: number;
};

// Intellectual Property Types
export type Patent = {
  name: string;
  number: string;
  issued: string;
  description: string;
  status: string;
};

export type IntellectualPropertyData = {
  patents: Patent[];
  lockedCount: number;
};

// Contact Information Types
export type EmailAddress = {
  is_primary: boolean;
  expert_email: string;
  type: string;
};

export type AreaOfExpertise = {
  area_of_expertise: string;
  is_primary: boolean;
  id: number;
};

export type Address = {
  is_primary: boolean;
  city: string;
  state: string;
  state_detail: {
    label: string;
    id: string;
  };
  country: string;
  zip: string;
  street: string;
  type: string;
};

export type PhoneAddress = {
  is_primary: boolean;
  phone: string;
  type: string;
};

// Challenges Types
export type Challenge = {
  case: string;
  caseSource: string;
  caseCaption: string;
  docketNumber: string;
  groundsOfChallenge: string;
  areaOfLaw: string;
  jurisdiction: string;
  state: string;
  court: string;
  retainedBy: string;
  outcome: string;
  year: number;
  date: string;
  disposition: string;
  challengeType: string;
  supportingDocuments: any[];
  isBookmarked?: boolean;
  plaintiffAttorneys?: string[];
  defenseAttorneys?: string[];
  judges?: string[];
  summaryOfInvolvement?: string;
};

export type ChallengesData = {
  description: string;
  items: Challenge[];
  lockedCount: number;
};

// Other Cases Types
export type OtherCase = {
  case: string;
  caseCaption: string;
  year: number;
  date: string;
  court: string;
  type: string;
  representation: string;
  documents: number;
  isBookmarked: boolean;
};

export type OtherCasesData = {
  description: string;
  items: OtherCase[];
  lockedCount: number;
};

// Personal Litigation Types
export type PersonalLitigationCase = {
  case: string;
  caseCaption: string;
  date: string;
  areaOfLaw: string;
  court: string;
  involvementType: string | undefined;
  status: string | undefined;
  description: string;
  documents: number;
  isBookmarked: boolean;
  outcome?: string;
  role?: string;
};

export type PersonalLitigationData = {
  description: string;
  cases: PersonalLitigationCase[];
  lockedCount: number;
};

// Disciplinary Actions Types
export type DisciplinaryAction = {
  authority: string;
  date: string;
  type: string;
  outcome: string;
  description: string;
};

export type DisciplinaryActionsData = {
  actions: DisciplinaryAction[];
  lockedCount: number;
};

// Publications Types
export type Publication = {
  title: string;
  journal: string;
  year: string;
  authors: string;
  doi: string;
  publicationType: string;
  citations: number;
  url: string;
};

export type PublicationsData = {
  papers: Publication[];
  lockedCount: number;
};

// References Types
export type Reference = {
  name: string;
  title: string;
  organization: string;
  relationship: string;
  initials: string;
  quote: string;
  email: string;
  phone: string;
  relationshipDuration: string;
  type: string;
  date: string;
  isVerified: boolean;
};

export type ReferencesData = {
  testimonials: Reference[];
  lockedCount: number;
};

// Industry Payments Types
export type IndustryPayment = {
  company: string;
  amount: number;
  purpose: string;
  date: string;
  category: string;
  details: string;
};

export type IndustryPaymentsData = {
  description: string;
  payments: IndustryPayment[];
  totalReportedAmount: number;
  lockedCount: number;
};

// Relationships Types
export type Attorney = {
  name: string;
  firm: string;
  cases: number;
  mostRecent: string;
};

export type LawFirm = {
  name: string;
  cases: number;
  mostRecent: string;
};

export type Judge = {
  name: string;
  court: string;
  cases: number;
  mostRecent: string;
};

export type ExpertWitness = {
  name: string;
  specialty: string;
  cases: number;
  mostRecent: string;
};

export type Party = {
  name: string;
  type: string;
  cases: number;
  mostRecent: string;
};

// Web Media Types
export type WebMediaItem = {
  type: string;
  title: string;
  platform: string;
  url: string;
  year: string;
  description: string;
};

export type WebMediaData = {
  featured: WebMediaItem[];
  lockedCount: number;
};

// Metrics Types
export type Document = {
  id: number;
  caseCaption: string;
  documentTitle: string;
  previewUrl: string;
};

export type Metrics = {
  depositions: {
    count: number;
    documents: Document[];
  };
  reports: {
    count: number;
    documents: Document[];
  };
  resumes: {
    count: number;
    documents: Document[];
  };
};

// Update Dates Type
export type UpdateDates = {
  expertise: string;
  bio: string;
  contributions: string;
  webMedia: string;
  awards: string;
  challenges: string;
  education: string;
  intellectual: string;
  industryPayments: string;
  litigation: string;
  memberships: string;
  networking: string;
  publications: string;
  references: string;
  relationships: string;
  workExperience: string;
  financialFilings: string;
  otherCasesData: string;
};

// Main Expert Info Type
export type ExpertInfo = {
  first_name: string;
  name: string;
  last_name: string;
  middle_name: string;
  salutation: string;
  profile_image: string;
  full_name: string;
  title: string;
  specialty: string;
  organization: string;
  location: string;
  experience: string;
  cases: string;
  education: string;
  expertBio: string;
  profileImage: string;
  expert_address: Address[];
  expert_area_of_expertise: AreaOfExpertise[];
  updateDates: UpdateDates;
  metrics: Metrics;
  contributions: ContributionsData;
  challenges: ChallengesData;
  otherCasesData: OtherCasesData;
  personalLitigationData: PersonalLitigationData;
  disciplinaryActions: DisciplinaryActionsData;
  experienceData: WorkExperienceData;
  educationData: EducationData;
  credentials: CredentialsData;
  publicationsData: PublicationsData;
  references: ReferencesData;
  memberships: MembershipsData;
  awards: AwardsData;
  industryPayments: IndustryPaymentsData;
  relationships: RelationshipsData;
  networking: NetworkingData;
  intellectual: IntellectualPropertyData;
  webMedia: WebMediaData;
  financialFilings: FinancialFilingsData;
  emailAddress: EmailAddress[];
  expert_email: EmailAddress[];
  address: Address[];
  expert_phone: PhoneAddress[];
  bio?: string;
  profile_introduction?: string;
  contact_detail_updated_on?: string;
};

export type BasicExpertInfo = {
  first_name: string;
  last_name: string;
  middle_name: string;
  salutation: string;
  profile_image: string;
  full_name: string;
  discipline: string;
  address: string;
  name: string;
  organization: string;
  bio?: string;
};

// Chart Data Types
export type ChartDataItem = {
  name: string;
  value: number;
};

export type RetainedByData = {
  plaintiff: number;
  defense: number;
  unknown: number;
};

export type DispositionData = {
  granted: number;
  denied: number;
  withdrawn: number;
};

export type GroundsOfChallengeData = {
  [key: string]: number;
};

export interface Relationship {
  id?: string;
  name: string;
  firm?: string;
  court?: string;
  specialty?: string;
  cases?: string[] | number;
  type?: string;
  description?: string;
  jurisdictions?: string[];
  partyType?: string;
  interactionType?: string;
  organization?: string;
  role?: string;
  frequency?: string;
  opposingSide?: boolean;
  caseCount?: number;
  lastInteraction?: string;
  firstInteraction?: string;
  mostRecent?: string;
}

export interface RelationshipsData {
  description: string;
  attorneys: Relationship[];
  lawFirms: Relationship[];
  judges: Relationship[];
  expertWitnesses: Relationship[];
  parties: Relationship[];
  lockedCount: number;
}

interface Contribution {
  date: string;
  amount?: number;
  recipient?: string;
  type?: string;
  source?: string;
  description?: string;
  url?: string;
}

export interface ContributionsData {
  items: Contribution[];
  lockedCount: number;
}

export interface FinancialFiling {
  type: string;
  title: string;
  date: string;
  jurisdiction: string;
  status: string;
  caseNumber: string;
  description: string;
  amount?: number;
  url?: string;
}

export interface FinancialFilingsData {
  items: FinancialFiling[];
  lockedCount: number;
}
