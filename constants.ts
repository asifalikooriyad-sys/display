
import { AppSettings, ServiceItem, ThemeConfig } from './types';

export const THEMES: Record<string, ThemeConfig> = {
  wood: {
    name: 'Executive Wood',
    bgClass: 'bg-gradient-to-br from-amber-900 via-stone-900 to-black',
    accentClass: 'text-amber-400 border-amber-500/30'
  },
  galaxy: {
    name: 'Deep Galaxy',
    bgClass: 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900',
    accentClass: 'text-cyan-400 border-cyan-500/30'
  },
  nebula: {
    name: 'Cosmic Nebula',
    bgClass: 'bg-gradient-to-br from-indigo-900 via-fuchsia-900 to-black',
    accentClass: 'text-fuchsia-400 border-fuchsia-500/30'
  },
  flow: {
    name: 'Ocean Flow',
    bgClass: 'bg-gradient-to-br from-teal-900 via-emerald-900 to-black',
    accentClass: 'text-emerald-400 border-emerald-500/30'
  },
  custom: {
    name: 'Custom Brand',
    bgClass: 'bg-black', // Will be overlaid by dynamic background
    accentClass: 'text-custom border-custom'
  }
};

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'wood',
  customColor: '#d97706', // Default amber
  slideDuration: 12,
  showTicker: true,
  tickerText: 'Welcome to Excellent Typing & Travels. We specialize in Visa Processing, Emirates ID, Medical Typing, and Flight Tickets. Fast & Reliable Service.',
  tickerSpeed: 25,
  
  companyName: 'EXCELLENT TYPING & TRAVELS',
  companyNameAr: 'أكسلنت للطباعة والسفريات',
  contactPhone: '+971 52 134 4487',
  contactWhatsapp: '02 886 8690',
  contactEmail: 'excellenttypingm11@gmail.com',
  location: 'Mustafa h shabiya m.11 near crispy chicken',
  logo: null,
  
  showDate: true,
  clockFormat: '12h',
  overlayOpacity: 0.6,
  
  transitionEffect: 'fade',
  navDockMode: 'auto',
  
  hideCursor: true,
  showProgressBar: true,
  slideShuffle: false,
  
  // NEW DEFAULTS
  enableParticles: true,
  enableBlurEffects: true,
  showHeroCTA: false,

  contentOverrides: {},

  enabledServices: [
    // Logical Order for Auto-Rotation
    'hero', 
    'golden-visa', 
    'emirates-id', 
    'family-visa', 
    'tourist-visa', 
    'medical-typing', 
    'flights', 
    'business-setup', 
    'pro-services', 
    'labor-services', 
    'tax-services', 
    'customs',
    'translation', 
    'attestation', 
    'embassy-services',
    'traffic-services', 
    'insurance', 
    'ejari-services', 
    'police-clearance', 
    'partners', 
    'reviews', 
    'contact'
  ]
};

export const SERVICES: ServiceItem[] = [
  // --- 1. HERO ---
  {
    id: 'hero',
    title: 'Welcome',
    description: 'Your Gateway to Government Services',
    icon: 'Home',
    imageKeyword: 'luxury',
    background: 'https://images.unsplash.com/photo-1512453979798-5ea904ac6605?q=80&w=1920&auto=format&fit=crop', // Dubai Abstract
    features: [],
    type: 'hero'
  },

  // --- 2. VISA & RESIDENCY ---
  {
    id: 'golden-visa',
    title: 'UAE Golden Visa',
    description: 'Secure your future with a 10-Year Residency. Available for Investors, Professionals, and Skilled Talent.',
    icon: 'Star',
    imageKeyword: 'dubai,skyscraper',
    background: 'https://images.unsplash.com/photo-1546412414-e1885259563a?q=80&w=1920&auto=format&fit=crop', // Dubai Skyline Gold
    features: [
      '10-Year Self-Sponsorship', 
      'Real Estate Investors (2M+)', 
      'Doctors & Scientists', 
      'Creative Professionals',
      'Skilled Employees (Salary 30k+)',
      'Family & Parent Sponsorship',
      'High School Top Achievers'
    ],
    details: {
      requirements: [
        'Passport Copy & Visa Copy',
        'Personal Photo (White Background)',
        'Property Deed (If Investor)',
        'Salary Certificate & Bank Statement (If Employee)',
        'University Degree (Attested)',
        'Health Insurance'
      ],
      processingTime: '5 - 10 Working Days',
      additionalInfo: 'Nomination approval may be required for specific categories.'
    },
    type: 'golden'
  },
  {
    id: 'emirates-id',
    title: 'Emirates ID Services',
    description: 'Complete assistance for Federal Authority for Identity and Citizenship services.',
    icon: 'IdCard',
    imageKeyword: 'technology,fingerprint',
    customImage: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1920&auto=format&fit=crop', // VALID IMAGE URL
    background: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1920&auto=format&fit=crop', // Cyber/Tech Abstract
    features: [
      'New ID Application', 
      'ID Card Renewal', 
      'Lost / Damaged Replacement', 
      'Update Mobile Number',
      'Update Personal Details',
      'Biometric Appointments',
      'Fine Payments & Appeals'
    ],
    details: {
      requirements: [
        'Original Passport',
        'Current Visa / Residency',
        'Personal Photo (Soft Copy)',
        'Previous Emirates ID (For Renewal)'
      ],
      processingTime: '24 Hours (Typing)',
      additionalInfo: 'Biometric fingerprinting may be required for new applicants.'
    },
    type: 'standard'
  },
  {
    id: 'family-visa',
    title: 'Family & Dependent Visa',
    description: 'Sponsor your spouse, children, and parents with our hassle-free typing services.',
    icon: 'Users',
    imageKeyword: 'family,happy',
    background: 'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?q=80&w=1920&auto=format&fit=crop', // Happy Family
    features: [
      'File Opening & Assessment', 
      'Wife & Children Visa', 
      'Parents Sponsorship', 
      'Visa Stamping Application',
      'Status Change (In-Country)',
      'UID Merge / Unification',
      'Hold Family Visa'
    ],
    details: {
      requirements: [
        'Sponsor Passport, Visa & EID',
        'Salary Certificate / Labor Contract',
        'Tenancy Contract (Ejari)',
        'Marriage Certificate (Attested)',
        'Birth Certificate for Children'
      ],
      processingTime: '2 - 3 Working Days',
      additionalInfo: 'Minimum salary of AED 4,000 required for sponsorship.'
    },
    type: 'kids'
  },
  {
    id: 'tourist-visa',
    title: 'Tourist & Visit Visa',
    description: 'Explore the UAE. We provide fast-track tourist visas for all nationalities.',
    icon: 'MapPin', 
    imageKeyword: 'travel,tourism',
    background: 'https://images.unsplash.com/photo-1597659840241-37e2b9c2f55f?q=80&w=1920&auto=format&fit=crop', // Desert Safari/Travel
    features: [
      '30 Days Single/Multiple', 
      '60 Days Single/Multiple', 
      '90 Days Visit Visa',
      'Airport-to-Airport Change', 
      'Inside Country Extension', 
      'Travel Insurance Included',
      'Dubai & Abu Dhabi Visas'
    ],
    details: {
      requirements: [
        'Clear Passport Copy (6 Months Validity)',
        'Passport Size Photo',
        'Guarantor Details (If applicable)'
      ],
      processingTime: '12 - 24 Hours',
      additionalInfo: 'Processing time may vary for certain nationalities.'
    },
    type: 'standard'
  },

  // --- 3. TRAVEL & MEDICAL ---
  {
    id: 'medical-typing',
    title: 'Medical Application',
    description: 'Official typing center for DOH and MOH medical fitness applications.',
    icon: 'Activity',
    imageKeyword: 'medical,doctor',
    background: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?q=80&w=1920&auto=format&fit=crop', // Medical Science
    features: [
      'DOH Abu Dhabi Screening', 
      'MOH Medical Application', 
      'Visa Renewal Screening', 
      'New Visa Screening',
      'VIP Fast Track Service',
      'Occupational Health Card',
      'Hepatitis B Vaccination Info'
    ],
    details: {
      requirements: [
        'Passport Copy',
        'Visa Copy / Offer Letter',
        '2 Passport Size Photos',
        'Emirates ID (If Renewal)'
      ],
      processingTime: 'Instant Typing',
      additionalInfo: 'Results typically available within 24-48 hours via SMS.'
    },
    type: 'standard'
  },
  {
    id: 'flights',
    title: 'Flights & Travel',
    description: 'Best deals on air tickets and worldwide travel packages.',
    icon: 'Plane',
    imageKeyword: 'airplane,airport',
    background: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=1920&auto=format&fit=crop', // Airplane Wing
    features: [
      'International Air Tickets', 
      'Worldwide Tourist Visas', 
      'Schengen / USA / UK Visa Assist',
      'Holiday Packages', 
      'Hotel Booking', 
      'Airport Transfers',
      'Ok To Board (OTB)'
    ],
    details: {
      requirements: [
        'Passport Copy',
        'Travel Dates',
        'Destination Details',
        'Visa (If applicable)'
      ],
      processingTime: 'Instant Booking',
      additionalInfo: 'Prices subject to availability at time of booking.'
    },
    type: 'standard'
  },
  {
    id: 'embassy-services',
    title: 'Embassies & Consulates',
    description: 'Assistance with passport renewal and consular services for various countries.',
    icon: 'Globe',
    imageKeyword: 'flag,diplomacy',
    background: 'https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?q=80&w=1920&auto=format&fit=crop', // Flags
    features: [
      'Passport Renewal (India, Philippines, etc.)',
      'Outpass / Emergency Certificate',
      'NOC Issuance',
      'Birth Registration',
      'Affidavits & Attestation',
      'Appointment Scheduling'
    ],
    details: {
      requirements: [
        'Current Passport Copy',
        'Visa Copy',
        'Passport Photos',
        'Application Form'
      ],
      processingTime: 'Varies by Embassy',
      additionalInfo: 'We assist with online forms and appointment booking.'
    },
    type: 'standard'
  },

  // --- 4. CORPORATE & BUSINESS ---
  {
    id: 'business-setup',
    title: 'Business Setup',
    description: 'Start your dream company in UAE. We handle everything from license to office.',
    icon: 'Briefcase',
    imageKeyword: 'office,meeting',
    background: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1920&auto=format&fit=crop', // Modern Building
    features: [
      'New Trade License Issuance', 
      'License Renewal', 
      'LLC & Sole Establishment', 
      'Local Sponsor Arrangement',
      'Office Space / Ejari', 
      'VAT Registration',
      'Bank Account Assistance'
    ],
    details: {
      requirements: [
        'Passport Copies of Partners',
        'Proposed Trade Names',
        'Initial Approval Certificate',
        'Tenancy Contract (Ejari)',
        'MOA (Memorandum of Association)'
      ],
      processingTime: '3 - 5 Working Days',
      additionalInfo: 'Timelines depend on DED approvals and activity type.'
    },
    type: 'standard'
  },
  {
    id: 'pro-services',
    title: 'PRO Services',
    description: 'Corporate document clearing and government liaison services.',
    icon: 'Cog', 
    imageKeyword: 'documents,signing',
    background: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1920&auto=format&fit=crop', // Business/Finance
    features: [
      'Company Immigration Card', 
      'Quota Approval / Modification', 
      'Investor Visa Processing', 
      'Municipality Approvals',
      'Civil Defense Certification',
      'Economic Dept Updates',
      'Document Attestation'
    ],
    details: {
      requirements: [
        'Trade License Copy',
        'Immigration Card Copy',
        'Authorized Signatory Details'
      ],
      processingTime: 'Varies by Service',
      additionalInfo: 'Monthly retainer packages available for companies.'
    },
    type: 'standard'
  },
  {
    id: 'labor-services',
    title: 'MOHRE & Labor',
    description: 'Expert handling of Ministry of Human Resources & Emiratisation services.',
    icon: 'Building',
    imageKeyword: 'worker,construction',
    background: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=1920&auto=format&fit=crop', // Construction/Labor
    features: [
      'New Work Permit (Labor Card)', 
      'Labor Contract Modification', 
      'Cancellation (Inside/Outside)', 
      'Domestic Worker Services',
      'Tadbeer Services',
      'Salary Complaints (WPS)',
      'Absconding Reports'
    ],
    details: {
      requirements: [
        'Company Trade License',
        'Employee Passport & Visa',
        'Photo',
        'E-Signature Card'
      ],
      processingTime: '24 - 48 Hours',
      additionalInfo: 'Company quota must be available for new permits.'
    },
    type: 'standard'
  },
  {
    id: 'tax-services',
    title: 'Tax & VAT Services',
    description: 'Expert assistance with Corporate Tax registration and VAT filing compliance.',
    icon: 'Calculator',
    imageKeyword: 'finance,calculator',
    background: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=1920&auto=format&fit=crop', // Finance/Accounting
    features: [
      'Corporate Tax Registration',
      'VAT Registration (TRN)',
      'Quarterly VAT Filing',
      'Tax De-Registration',
      'Accounting & Bookkeeping',
      'Financial Audit Reports'
    ],
    details: {
      requirements: [
        'Trade License Copy',
        'MOA / Power of Attorney',
        'Passport & EID of Owners',
        'Financial Statements / Bank Records'
      ],
      processingTime: '3 - 5 Working Days',
      additionalInfo: 'Penalties apply for late filing. Ensure timely submission.'
    },
    type: 'standard'
  },
  {
    id: 'customs',
    title: 'Customs Services',
    description: 'Import/Export code registration and customs clearance documentation.',
    icon: 'Ship',
    imageKeyword: 'shipping,cargo',
    background: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1920&auto=format&fit=crop', // Container Ship
    features: [
      'Import / Export Code Registration',
      'Customs Code Renewal',
      'Mirsal 2 Registration',
      'Goods Clearance Support',
      'Vehicle Clearance Certificate',
      'Inspection Booking'
    ],
    details: {
      requirements: [
        'Trade License Copy',
        'Passport & EID of Owner',
        'Office Tenancy Contract'
      ],
      processingTime: '1 - 2 Working Days',
      additionalInfo: 'Required for any trading business importing goods.'
    },
    type: 'standard'
  },

  // --- 5. LEGAL & DOCUMENTS ---
  {
    id: 'translation',
    title: 'Legal Translation',
    description: 'Certified translation for official use in courts and ministries.',
    icon: 'FileText',
    imageKeyword: 'documents,writing',
    background: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=1920&auto=format&fit=crop', // Documents/Signing
    features: [
      'Legal Translation (Arabic/English)', 
      'Birth & Marriage Certificates', 
      'Driving License Translation',
      'MOFA Attestation', 
      'Embassy Attestation',
      'Power of Attorney',
      'Educational Certificates'
    ],
    details: {
      requirements: [
        'Original Document',
        'Passport Copy (For name verification)'
      ],
      processingTime: '1 - 2 Days',
      additionalInfo: 'Attestation requires stamps from originating country.'
    },
    type: 'standard'
  },
  {
    id: 'attestation',
    title: 'Certificate Attestation',
    description: 'Global attestation services for educational and personal documents.',
    icon: 'Stamp',
    imageKeyword: 'stamp,paper',
    background: 'https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=1920&auto=format&fit=crop', // Signing/Stamp
    features: [
      'Degree / Diploma Attestation',
      'Marriage / Birth Certificate',
      'MOFA UAE Attestation',
      'Embassy Attestation (UAE/Home Country)',
      'Apostille Services',
      'Translation & Notary'
    ],
    details: {
      requirements: [
        'Original Certificate',
        'Passport Copy',
        'Visa Copy'
      ],
      processingTime: '3 - 7 Working Days',
      additionalInfo: 'Courier pickup and delivery available.'
    },
    type: 'standard'
  },

  // --- 6. PERSONAL, HOUSING & VEHICLE ---
  {
    id: 'traffic-services',
    title: 'Traffic & Vehicle Services',
    description: 'Comprehensive solutions for vehicle licensing, driving licenses, and fines.',
    icon: 'Car',
    imageKeyword: 'car,traffic',
    background: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=1920&auto=format&fit=crop', // Driving
    features: [
      'Vehicle Registration Renewal', 
      'Driving License Renewal', 
      'Ownership Transfer', 
      'Export Certificate',
      'Lost Plate Number',
      'Traffic File Opening',
      'Fine Payment & Clearance'
    ],
    details: {
      requirements: [
        'Emirates ID',
        'Vehicle Mulkiya (Registration Card)',
        'Vehicle Insurance Policy',
        'Eye Test Result (For License Renewal)'
      ],
      processingTime: 'Instant Service',
      additionalInfo: 'Vehicle inspection (Passing) required for registration renewal.'
    },
    type: 'standard'
  },
  {
    id: 'insurance',
    title: 'Insurance Services',
    description: 'Protect yourself and your assets with our range of insurance partners.',
    icon: 'Shield',
    imageKeyword: 'shield,protection',
    background: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1920&auto=format&fit=crop', // Planning/Insurance
    features: [
      'Health Insurance (Daman/Thiqa)', 
      'Vehicle Insurance (Comprehensive/3rd Party)', 
      'Travel Insurance (Covid Cover)', 
      'Family Medical Insurance',
      'Workers Compensation',
      'Property Insurance'
    ],
    details: {
      requirements: [
        'Emirates ID / Passport Copy',
        'Visa Copy',
        'Vehicle Registration (For Car Insurance)'
      ],
      processingTime: '1 Hour',
      additionalInfo: 'We compare quotes from multiple providers.'
    },
    type: 'standard'
  },
  {
    id: 'ejari-services',
    title: 'Ejari & Housing',
    description: 'Official registration and management of tenancy contracts in the UAE.',
    icon: 'Key',
    imageKeyword: 'house,keys',
    background: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1920&auto=format&fit=crop', // Real Estate/Keys
    features: [
      'Ejari Registration',
      'Tenancy Contract Attestation',
      'Contract Cancellation',
      'Title Deed Updates',
      'Move-in Permits',
      'Property Management Assist'
    ],
    details: {
      requirements: [
        'Tenant Passport & Visa Copy',
        'Emirates ID Copy',
        'Landlord Passport/ID Copy',
        'Title Deed Copy',
        'DEWA Bill (Recent)'
      ],
      processingTime: 'Instant - 24 Hours',
      additionalInfo: 'Required for visa renewal and family sponsorship.'
    },
    type: 'standard'
  },
  {
    id: 'police-clearance',
    title: 'Police Clearance',
    description: 'Good Conduct Certificates for employment, immigration, or visa purposes.',
    icon: 'Badge',
    imageKeyword: 'security,police',
    background: 'https://images.unsplash.com/photo-1555529733-14637d7a4563?q=80&w=1920&auto=format&fit=crop', // Security/Lock
    features: [
      'Good Conduct Certificate (PCC)',
      'Certificate for Employment',
      'Certificate for Immigration',
      'Lost Item Certificates',
      'Traffic Accident Reports',
      'Fingerprint Services'
    ],
    details: {
      requirements: [
        'Emirates ID (Active)',
        'Active UAE Mobile Number (Linked to EID)',
        'Email Address'
      ],
      processingTime: '24 - 48 Hours',
      additionalInfo: 'Issued via MOI or Dubai Police app.'
    },
    type: 'standard'
  },

  // --- 7. FOOTER ---
  {
    id: 'partners',
    title: 'Government Partners',
    description: 'Official Abu Dhabi Government Services',
    icon: 'Globe',
    imageKeyword: 'abudhabi,government',
    background: 'https://images.unsplash.com/photo-1599373672049-756d11f75745?q=80&w=1920&auto=format&fit=crop', // UAE Flag/Government
    features: [],
    type: 'partners'
  },
  {
    id: 'reviews',
    title: 'Customer Stories',
    description: 'What our clients say about us',
    icon: 'Heart',
    imageKeyword: 'handshake,smile',
    background: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1920&auto=format&fit=crop', // People Meeting
    features: [],
    type: 'reviews'
  },
  {
    id: 'contact',
    title: 'Visit Us',
    description: 'We are ready to help you',
    icon: 'Phone',
    imageKeyword: 'map,store',
    background: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1920&auto=format&fit=crop', // Modern Office
    features: [],
    type: 'contact'
  }
];
