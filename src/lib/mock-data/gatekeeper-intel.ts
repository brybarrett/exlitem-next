export interface GatekeeperChallenge {
  id: string;
  case: string;
  court: string;
  date: string;
  outcome: 'admitted' | 'excluded' | 'limited';
  reason: string;
  details: string;
  opposingAttorney?: string;
  judge?: string;
}

export interface GatekeeperData {
  expertId: string;
  expertName: string;
  overallScore: number;
  totalChallenges: number;
  admittedCount: number;
  excludedCount: number;
  limitedCount: string;
  successRate: number;
  commonChallengeReasons: string[];
  recentChallenges: GatekeeperChallenge[];
  strengthAreas: string[];
  weaknessAreas: string[];
  caseHistory: {
    totalCases: number;
    asPlaintiffExpert: number;
    asDefenseExpert: number;
    avgCaseValue: string;
  };
  peerComparison: {
    rank: string;
    percentile: number;
    averageInField: number;
  };
  publicRecords: {
    disciplinaryActions: number;
    malpracticeClaims: number;
    licensingIssues: number;
  };
}

export const mockGatekeeperData: Record<string, GatekeeperData> = {
  '1': {
    expertId: '1',
    expertName: 'Dr. Sarah Johnson, MD',
    overallScore: 92,
    totalChallenges: 23,
    admittedCount: 19,
    excludedCount: 2,
    limitedCount: '2',
    successRate: 91.3,
    commonChallengeReasons: ['Methodology', 'Qualification', 'Relevance'],
    recentChallenges: [
      {
        id: 'ch1',
        case: 'Smith v. Memorial Hospital',
        court: 'Superior Court of California, Los Angeles County',
        date: '2024-03-15',
        outcome: 'admitted',
        reason: 'Qualification, Methodology',
        details:
          "Court found expert's methodology reliable and conclusions within scope of expertise. Testimony admitted without limitation.",
        opposingAttorney: 'Johnson & Associates',
        judge: 'Hon. Patricia Williams'
      },
      {
        id: 'ch2',
        case: 'Davis v. City Medical Center',
        court: 'U.S. District Court, District of Massachusetts',
        date: '2024-01-22',
        outcome: 'limited',
        reason: 'Relevance, Legal Conclusion',
        details:
          'Expert permitted to testify on standard of care but limited on future medical cost projections due to insufficient economic analysis background.',
        opposingAttorney: 'Miller Defense Group',
        judge: 'Hon. Robert Chen'
      },
      {
        id: 'ch3',
        case: 'Rodriguez v. General Hospital',
        court: 'Supreme Court of New York, New York County',
        date: '2023-11-08',
        outcome: 'admitted',
        reason: 'Qualification challenge',
        details:
          "Defense challenged expert's qualifications in emergency medicine. Court found extensive ER experience and board certification sufficient.",
        opposingAttorney: 'White & Partners',
        judge: 'Hon. Sarah Martinez'
      }
    ],
    strengthAreas: [
      'Emergency medicine standards',
      'Trauma care protocols',
      'Hospital liability issues',
      'Medical record analysis'
    ],
    weaknessAreas: ['Economic damage calculations', 'Long-term care planning'],
    caseHistory: {
      totalCases: 234,
      asPlaintiffExpert: 156,
      asDefenseExpert: 78,
      avgCaseValue: '$2.3M'
    },
    peerComparison: {
      rank: 'Top 10%',
      percentile: 92,
      averageInField: 78
    },
    publicRecords: {
      disciplinaryActions: 0,
      malpracticeClaims: 0,
      licensingIssues: 0
    }
  },
  '2': {
    expertId: '2',
    expertName: 'Dr. Michael Chen, PE',
    overallScore: 87,
    totalChallenges: 18,
    admittedCount: 15,
    excludedCount: 1,
    limitedCount: '2',
    successRate: 88.9,
    commonChallengeReasons: [
      'Calculation methodology',
      'Industry standards application',
      'Site investigation adequacy'
    ],
    recentChallenges: [
      {
        id: 'ch4',
        case: 'Greenfield Development v. ABC Construction',
        court: 'Los Angeles Superior Court',
        date: '2024-02-28',
        outcome: 'admitted',
        reason: 'Methodology challenge on structural analysis',
        details:
          "Expert's finite element analysis methods accepted as reliable. Testimony on building failure causes admitted.",
        opposingAttorney: 'Construction Defense LLC',
        judge: 'Hon. David Kim'
      },
      {
        id: 'ch5',
        case: 'Riverside Plaza v. Steel Corp',
        court: 'Superior Court of California, Riverside County',
        date: '2024-01-10',
        outcome: 'excluded',
        reason: 'Insufficient foundation for opinions',
        details:
          'Court found expert did not conduct adequate site investigation. Opinions on causation excluded for lack of sufficient foundation.',
        opposingAttorney: 'Industrial Law Group',
        judge: 'Hon. Maria Gonzalez'
      }
    ],
    strengthAreas: [
      'Structural failure analysis',
      'Building code compliance',
      'Construction defect investigation',
      'Seismic design standards'
    ],
    weaknessAreas: ['Site investigation protocols', 'Geotechnical analysis'],
    caseHistory: {
      totalCases: 156,
      asPlaintiffExpert: 89,
      asDefenseExpert: 67,
      avgCaseValue: '$1.8M'
    },
    peerComparison: {
      rank: 'Top 15%',
      percentile: 87,
      averageInField: 74
    },
    publicRecords: {
      disciplinaryActions: 0,
      malpracticeClaims: 0,
      licensingIssues: 0
    }
  },
  '5': {
    expertId: '5',
    expertName: 'Dr. Lisa Park, MD',
    overallScore: 95,
    totalChallenges: 31,
    admittedCount: 28,
    excludedCount: 1,
    limitedCount: '2',
    successRate: 93.5,
    commonChallengeReasons: [
      'Causation methodology',
      'Neuropsychological testing validity',
      'Future care projections'
    ],
    recentChallenges: [
      {
        id: 'ch6',
        case: 'Thompson v. Metro Transit',
        court: 'Harris County District Court, Texas',
        date: '2024-04-02',
        outcome: 'admitted',
        reason: 'Daubert challenge on TBI causation',
        details:
          "Court accepted expert's methodology linking traumatic brain injury to specific cognitive deficits. Testimony on causation and prognosis admitted.",
        opposingAttorney: 'Transit Defense Counsel',
        judge: 'Hon. James Rodriguez'
      },
      {
        id: 'ch7',
        case: 'Wilson v. Construction Co.',
        court: 'U.S. District Court, Southern District of Texas',
        date: '2024-02-18',
        outcome: 'limited',
        reason: 'Scope limitation on vocational impact',
        details:
          'Expert permitted to testify on neurological injuries but limited on vocational rehabilitation opinions due to lack of vocational expertise.',
        opposingAttorney: 'Industrial Defense Group',
        judge: 'Hon. Angela Thompson'
      }
    ],
    strengthAreas: [
      'Traumatic brain injury assessment',
      'Neurological damage evaluation',
      'Cognitive testing interpretation',
      'Medical causation analysis'
    ],
    weaknessAreas: ['Vocational rehabilitation', 'Economic impact assessment'],
    caseHistory: {
      totalCases: 189,
      asPlaintiffExpert: 142,
      asDefenseExpert: 47,
      avgCaseValue: '$3.1M'
    },
    peerComparison: {
      rank: 'Top 5%',
      percentile: 95,
      averageInField: 81
    },
    publicRecords: {
      disciplinaryActions: 0,
      malpracticeClaims: 0,
      licensingIssues: 0
    }
  }
};

export function getGatekeeperData(expertId: string): GatekeeperData | null {
  return mockGatekeeperData[expertId] || null;
}
