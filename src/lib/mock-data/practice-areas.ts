export const practiceAreas = [
  {
    id: 'medical',
    name: 'Medical',
    subcategories: [
      'Medical Malpractice',
      'Personal Injury',
      'Trauma Surgery',
      'Emergency Medicine',
      'Forensic Medicine',
      'Nursing Standards',
      'Radiology',
      'Orthopedic Surgery',
      'Neurology',
      'Cardiology'
    ]
  },
  {
    id: 'engineering',
    name: 'Engineering',
    subcategories: [
      'Civil Engineering',
      'Mechanical Engineering',
      'Electrical Engineering',
      'Structural Engineering',
      'Chemical Engineering',
      'Industrial Engineering',
      'Environmental Engineering',
      'Aerospace Engineering',
      'Safety Engineering',
      'Traffic Engineering'
    ]
  },
  {
    id: 'financial',
    name: 'Financial',
    subcategories: [
      'Forensic Accounting',
      'Economic Damages',
      'Business Valuation',
      'Securities Litigation',
      'Insurance Claims',
      'Intellectual Property',
      'Tax Disputes',
      'Bankruptcy',
      'Real Estate Valuation',
      'Lost Profits Analysis'
    ]
  },
  {
    id: 'construction',
    name: 'Construction',
    subcategories: [
      'Construction Defects',
      'Delay Claims',
      'Cost Overruns',
      'Safety Violations',
      'Building Codes',
      'Contract Disputes',
      'Project Management',
      'Scheduling',
      'Quality Control',
      'Material Defects'
    ]
  },
  {
    id: 'automotive',
    name: 'Automotive',
    subcategories: [
      'Vehicle Design',
      'Accident Reconstruction',
      'Manufacturing Defects',
      'Safety Systems',
      'Mechanical Failures',
      'Tire Analysis',
      'Airbag Systems',
      'Recalls',
      'Crashworthiness',
      'Human Factors'
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    subcategories: [
      'Software Engineering',
      'Cybersecurity',
      'Data Analysis',
      'Patent Disputes',
      'Trade Secrets',
      'Digital Forensics',
      'Network Security',
      'Mobile Technology',
      'Cloud Computing',
      'Artificial Intelligence'
    ]
  }
];

export const locations = [
  {
    state: 'CA',
    name: 'California',
    cities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento']
  },
  {
    state: 'NY',
    name: 'New York',
    cities: ['New York City', 'Albany', 'Buffalo', 'Rochester']
  },
  {
    state: 'TX',
    name: 'Texas',
    cities: ['Houston', 'Dallas', 'Austin', 'San Antonio']
  },
  {
    state: 'FL',
    name: 'Florida',
    cities: ['Miami', 'Tampa', 'Orlando', 'Jacksonville']
  },
  {
    state: 'IL',
    name: 'Illinois',
    cities: ['Chicago', 'Springfield', 'Rockford', 'Peoria']
  },
  {
    state: 'PA',
    name: 'Pennsylvania',
    cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie']
  },
  {
    state: 'OH',
    name: 'Ohio',
    cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo']
  },
  {
    state: 'GA',
    name: 'Georgia',
    cities: ['Atlanta', 'Augusta', 'Columbus', 'Macon']
  },
  {
    state: 'NC',
    name: 'North Carolina',
    cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham']
  },
  {
    state: 'MI',
    name: 'Michigan',
    cities: ['Detroit', 'Grand Rapids', 'Warren', 'Sterling Heights']
  }
];

export const feeRanges = [
  { id: 'budget', label: 'Budget ($200-400/hr)', min: 200, max: 400 },
  { id: 'standard', label: 'Standard ($400-600/hr)', min: 400, max: 600 },
  { id: 'premium', label: 'Premium ($600-800/hr)', min: 600, max: 800 },
  { id: 'elite', label: 'Elite ($800+/hr)', min: 800, max: 2000 }
];
