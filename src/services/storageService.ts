import {
  User,
  Crop,
  Market,
  PriceSubmission,
  GovernmentScheme,
  ExpertQuestion,
  NotificationItem,
  Reward,
  TraderListing,
  ModerationReport,
  SellerProfile,
  PriceAlert,
  WeatherData,
} from '../types';
import { calculateTrimmedStats, normalizePriceToPerKg } from './calculationEngine';

const STORAGE_KEY = 'pricexact_app_state_v1';

export const INITIAL_CROPS: Crop[] = [
  {
    id: 'crop_wheat',
    name: 'Wheat (Sharbati & Lokwan)',
    hindiName: 'गेहूं (शरबती एवं लोकवान)',
    bengaliName: 'গম',
    category: 'cereal',
    icon: '🌾',
    defaultUnit: '₹/quintal',
    baseReferencePrice: 24.5,
    season: 'Rabi',
    description: 'High-protein grain staple. High demand across central and northern India.',
  },
  {
    id: 'crop_rice',
    name: 'Basmati & Non-Basmati Paddy',
    hindiName: 'धान (बासमती व साधारण)',
    bengaliName: 'ধান ও চাল',
    category: 'cereal',
    icon: '🍚',
    defaultUnit: '₹/quintal',
    baseReferencePrice: 22.0,
    season: 'Kharif',
    description: 'Key dietary staple. Major production in eastern, southern, and northern river basins.',
  },
  {
    id: 'crop_potato',
    name: 'Potato (Jyoti & Pukhraj)',
    hindiName: 'आलू (ज्योति व पुखराज)',
    bengaliName: 'আলু',
    category: 'vegetable',
    icon: '🥔',
    defaultUnit: '₹/kg',
    baseReferencePrice: 16.0,
    season: 'Year-round',
    description: 'Essential kitchen tuber. Sensitive to cold-storage arrival volumes and logistics.',
  },
  {
    id: 'crop_tomato',
    name: 'Tomato (Hybrid & Desi)',
    hindiName: 'टमाटर (हाइब्रिड व देशी)',
    bengaliName: 'টমেটো',
    category: 'vegetable',
    icon: '🍅',
    defaultUnit: '₹/kg',
    baseReferencePrice: 24.0,
    season: 'Year-round',
    description: 'Perishable crop with frequent price volatility driven by monsoon and harvest cycles.',
  },
  {
    id: 'crop_onion',
    name: 'Onion (Nashik Red & White)',
    hindiName: 'प्याज (नासिक लाल व सफेद)',
    bengaliName: 'পেঁয়াজ',
    category: 'vegetable',
    icon: '🧅',
    defaultUnit: '₹/kg',
    baseReferencePrice: 26.0,
    season: 'Rabi / Late Kharif',
    description: 'Strategic kitchen commodity with heavy trading in Lasalgaon and Pimpalgaon mandis.',
  },
  {
    id: 'crop_maize',
    name: 'Maize (Corn)',
    hindiName: 'मक्का',
    bengaliName: 'ভুট্টা',
    category: 'cereal',
    icon: '🌽',
    defaultUnit: '₹/quintal',
    baseReferencePrice: 19.5,
    season: 'Kharif / Rabi',
    description: 'High industrial and feed demand in poultry, starch, and biofuel sectors.',
  },
  {
    id: 'crop_mustard',
    name: 'Mustard Seeds',
    hindiName: 'सरसों / राई',
    bengaliName: 'সর্ষে',
    category: 'oilseed',
    icon: '🌼',
    defaultUnit: '₹/quintal',
    baseReferencePrice: 52.0,
    season: 'Rabi',
    description: 'Primary edible oilseed of North and West India with minimum support price benchmark.',
  },
  {
    id: 'crop_green_chilli',
    name: 'Green Chilli (G4 & Teja)',
    hindiName: 'हरी मिर्च',
    bengaliName: 'কাঁচা লঙ্কা',
    category: 'vegetable',
    icon: '🌶️',
    defaultUnit: '₹/kg',
    baseReferencePrice: 42.0,
    season: 'Year-round',
    description: 'High value spicy crop with consistent consumer and hospitality consumption.',
  },
];

export const INITIAL_MARKETS: Market[] = [
  {
    id: 'mkt_azadpur',
    name: 'Azadpur Mandi (APMC)',
    district: 'North Delhi',
    state: 'Delhi',
    type: 'apmc',
    distanceKm: 8.5,
    lat: 28.7153,
    lng: 77.1784,
    address: 'APMC Market Yard, GT Karnal Road, Azadpur, Delhi - 110033',
  },
  {
    id: 'mkt_aadhya',
    name: 'Aadhya Rural Aggregation Center',
    district: 'Meerut',
    state: 'Uttar Pradesh',
    type: 'farmer_market',
    distanceKm: 14.2,
    lat: 28.9845,
    lng: 77.7064,
    address: 'Sector 4 Bypass, Near Kisan Bhawan, Meerut, UP - 250001',
  },
  {
    id: 'mkt_lasalgaon',
    name: 'Lasalgaon APMC Market Yard',
    district: 'Nashik',
    state: 'Maharashtra',
    type: 'apmc',
    distanceKm: 24.0,
    lat: 20.1455,
    lng: 74.2272,
    address: 'Lasalgaon APMC, Niphad Taluka, Nashik, Maharashtra - 422306',
  },
  {
    id: 'mkt_vashi',
    name: 'Vashi APMC Wholesale Market',
    district: 'Navi Mumbai',
    state: 'Maharashtra',
    type: 'apmc',
    distanceKm: 18.0,
    lat: 19.0760,
    lng: 73.0076,
    address: 'Sector 19, Vashi, Navi Mumbai, Maharashtra - 400703',
  },
  {
    id: 'mkt_burdwan',
    name: 'Burdwan Krishak Bazar Mandi',
    district: 'Purba Bardhaman',
    state: 'West Bengal',
    type: 'cooperative',
    distanceKm: 12.0,
    lat: 23.2324,
    lng: 87.8615,
    address: 'Near Sadar Station, Burdwan, West Bengal - 713101',
  },
  {
    id: 'mkt_khanna',
    name: 'Khanna Grain Market (Asia’s Largest)',
    district: 'Ludhiana',
    state: 'Punjab',
    type: 'mandi',
    distanceKm: 32.5,
    lat: 30.7064,
    lng: 76.2185,
    address: 'Grand Trunk Road, Khanna, Punjab - 141401',
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user_farmer_ramesh',
    name: 'Rameshwar Singh Patel',
    email: 'ramesh.farmer@pricexact.org',
    mobile: '+91 98765 43210',
    role: 'farmer',
    location: {
      state: 'Uttar Pradesh',
      district: 'Meerut',
      villageOrTown: 'Daurala Khurd',
      lat: 29.112,
      lng: 77.721,
    },
    verificationStatus: 'verified',
    trustScore: 92,
    accuracyRate: 98.4,
    contributionsCount: 38,
    kccId: 'KCC-UP-MEE-2024-8921',
    khatianNumber: 'KH-892/14B',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-08-12T09:00:00Z',
    badges: ['Trust Champion', 'Smart Farmer', 'Price Verifier'],
  },
  {
    id: 'user_consumer_priya',
    name: 'Priya Mukherjee',
    email: 'priya.m@gmail.com',
    mobile: '+91 98123 45678',
    role: 'consumer',
    location: {
      state: 'Delhi',
      district: 'South Delhi',
      villageOrTown: 'Saket',
      lat: 28.524,
      lng: 77.206,
    },
    verificationStatus: 'verified',
    trustScore: 78,
    accuracyRate: 94.0,
    contributionsCount: 22,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    createdAt: '2025-09-01T14:30:00Z',
    badges: ['Community Contributor', 'Price Verifier'],
  },
  {
    id: 'user_trader_gupta',
    name: 'Gupta Agro Trading Corp',
    email: 'contact@guptaagro.com',
    mobile: '+91 98334 11223',
    role: 'trader',
    businessName: 'Gupta Agri Logistics & Wholesale',
    location: {
      state: 'Delhi',
      district: 'North Delhi',
      villageOrTown: 'Azadpur',
      lat: 28.715,
      lng: 77.178,
    },
    verificationStatus: 'verified',
    trustScore: 88,
    accuracyRate: 96.5,
    contributionsCount: 45,
    createdAt: '2025-06-15T11:00:00Z',
    badges: ['Verified Trader', 'Reliable Contributor'],
  },
  {
    id: 'user_expert_sharma',
    name: 'Dr. Virendra K. Sharma',
    email: 'vks.agri@icar.gov.in',
    mobile: '+91 94123 88990',
    role: 'expert',
    location: {
      state: 'Uttar Pradesh',
      district: 'Meerut',
      villageOrTown: 'Modipuram Agronomy Wing',
    },
    verificationStatus: 'verified',
    trustScore: 99,
    accuracyRate: 100,
    contributionsCount: 64,
    createdAt: '2025-04-10T10:00:00Z',
    badges: ['Agri Specialist', 'ICAR Certified', 'Trust Champion'],
  },
  {
    id: 'user_admin_super',
    name: 'PriceXact System Admin',
    email: 'admin@pricexact.org',
    mobile: '+91 99999 00000',
    role: 'admin',
    location: {
      state: 'National Capital Territory',
      district: 'New Delhi',
      villageOrTown: 'Central Hub',
    },
    verificationStatus: 'verified',
    trustScore: 100,
    accuracyRate: 100,
    contributionsCount: 150,
    createdAt: '2025-01-01T00:00:00Z',
    badges: ['System Administrator', 'Moderation Head'],
  },
];

export const INITIAL_SUBMISSIONS: PriceSubmission[] = [
  // Farmer Wheat submissions (incorporating the project paper dataset demonstration values: 6, 5, 5, 5, 7, 9, 8, 9, 10, 11, 14, 14, 15, 12, 10)
  // Scaled & aligned to realistic kg numbers
  {
    id: 'sub_f_wheat_1',
    cropId: 'crop_wheat',
    cropName: 'Wheat (Sharbati & Lokwan)',
    submitterId: 'user_farmer_ramesh',
    submitterName: 'Rameshwar Singh Patel',
    submitterRole: 'farmer',
    submitterTrustScore: 92,
    submitterVerification: 'verified',
    marketId: 'mkt_aadhya',
    marketName: 'Aadhya Rural Aggregation Center',
    district: 'Meerut',
    state: 'Uttar Pradesh',
    originalPrice: 2450,
    originalUnit: '₹/quintal',
    normalizedPricePerKg: 24.50,
    quantity: 50,
    transactionType: 'sell',
    date: '2026-09-24',
    notes: 'Grade A Lokwan variety, dry moisture level 11.2%. Direct farmgate sale.',
    confirmationsCount: 14,
    flagsCount: 0,
    confirmedByUserIds: ['user_consumer_priya', 'user_trader_gupta'],
    flaggedByUserIds: [],
    isVerified: true,
    createdAt: '2026-09-24T07:15:00Z',
  },
  {
    id: 'sub_c_wheat_1',
    cropId: 'crop_wheat',
    cropName: 'Wheat (Sharbati & Lokwan)',
    submitterId: 'user_consumer_priya',
    submitterName: 'Priya Mukherjee',
    submitterRole: 'consumer',
    submitterTrustScore: 78,
    submitterVerification: 'verified',
    marketId: 'mkt_azadpur',
    marketName: 'Azadpur Mandi (APMC)',
    district: 'North Delhi',
    state: 'Delhi',
    originalPrice: 34,
    originalUnit: '₹/kg',
    normalizedPricePerKg: 34.00,
    quantity: 10,
    transactionType: 'buy',
    date: '2026-09-24',
    notes: 'Purchased packaged 10kg Sharbati atta from local retail grocer.',
    confirmationsCount: 8,
    flagsCount: 0,
    confirmedByUserIds: ['user_farmer_ramesh'],
    flaggedByUserIds: [],
    isVerified: true,
    createdAt: '2026-09-24T08:30:00Z',
  },
  // Potato submissions
  {
    id: 'sub_f_potato_1',
    cropId: 'crop_potato',
    cropName: 'Potato (Jyoti & Pukhraj)',
    submitterId: 'user_farmer_ramesh',
    submitterName: 'Rameshwar Singh Patel',
    submitterRole: 'farmer',
    submitterTrustScore: 92,
    submitterVerification: 'verified',
    marketId: 'mkt_aadhya',
    marketName: 'Aadhya Rural Aggregation Center',
    district: 'Meerut',
    state: 'Uttar Pradesh',
    originalPrice: 1800,
    originalUnit: '₹/quintal',
    normalizedPricePerKg: 18.00,
    quantity: 120,
    transactionType: 'sell',
    date: '2026-09-23',
    notes: 'Freshly dug Jyoti variety from cold storage facility.',
    confirmationsCount: 11,
    flagsCount: 0,
    confirmedByUserIds: ['user_trader_gupta'],
    flaggedByUserIds: [],
    isVerified: true,
    createdAt: '2026-09-23T09:40:00Z',
  },
  {
    id: 'sub_c_potato_1',
    cropId: 'crop_potato',
    cropName: 'Potato (Jyoti & Pukhraj)',
    submitterId: 'user_consumer_priya',
    submitterName: 'Priya Mukherjee',
    submitterRole: 'consumer',
    submitterTrustScore: 78,
    submitterVerification: 'verified',
    marketId: 'mkt_azadpur',
    marketName: 'Azadpur Mandi (APMC)',
    district: 'North Delhi',
    state: 'Delhi',
    originalPrice: 28,
    originalUnit: '₹/kg',
    normalizedPricePerKg: 28.00,
    quantity: 5,
    transactionType: 'buy',
    date: '2026-09-24',
    notes: 'Bought at neighborhood vegetable stand, good medium size.',
    confirmationsCount: 9,
    flagsCount: 0,
    confirmedByUserIds: [],
    flaggedByUserIds: [],
    isVerified: true,
    createdAt: '2026-09-24T06:50:00Z',
  },
  // Tomato submissions (Demonstrating farmer vs consumer gap)
  {
    id: 'sub_f_tomato_1',
    cropId: 'crop_tomato',
    cropName: 'Tomato (Hybrid & Desi)',
    submitterId: 'user_farmer_ramesh',
    submitterName: 'Rameshwar Singh Patel',
    submitterRole: 'farmer',
    submitterTrustScore: 92,
    submitterVerification: 'verified',
    marketId: 'mkt_aadhya',
    marketName: 'Aadhya Rural Aggregation Center',
    district: 'Meerut',
    state: 'Uttar Pradesh',
    originalPrice: 20,
    originalUnit: '₹/kg',
    normalizedPricePerKg: 20.00,
    quantity: 80,
    transactionType: 'sell',
    date: '2026-09-24',
    notes: 'Red ripe hybrid tomato, crated in 25kg wooden boxes.',
    confirmationsCount: 16,
    flagsCount: 0,
    confirmedByUserIds: ['user_consumer_priya'],
    flaggedByUserIds: [],
    isVerified: true,
    createdAt: '2026-09-24T06:10:00Z',
  },
  {
    id: 'sub_c_tomato_1',
    cropId: 'crop_tomato',
    cropName: 'Tomato (Hybrid & Desi)',
    submitterId: 'user_consumer_priya',
    submitterName: 'Priya Mukherjee',
    submitterRole: 'consumer',
    submitterTrustScore: 78,
    submitterVerification: 'verified',
    marketId: 'mkt_azadpur',
    marketName: 'Azadpur Mandi (APMC)',
    district: 'North Delhi',
    state: 'Delhi',
    originalPrice: 42,
    originalUnit: '₹/kg',
    normalizedPricePerKg: 42.00,
    quantity: 2,
    transactionType: 'buy',
    date: '2026-09-24',
    notes: 'Retail price in residential market. Noticeable 110% markup from farmgate.',
    confirmationsCount: 15,
    flagsCount: 0,
    confirmedByUserIds: ['user_farmer_ramesh'],
    flaggedByUserIds: [],
    isVerified: true,
    createdAt: '2026-09-24T07:45:00Z',
  },
  // Onion submissions
  {
    id: 'sub_f_onion_1',
    cropId: 'crop_onion',
    cropName: 'Onion (Nashik Red & White)',
    submitterId: 'user_farmer_ramesh',
    submitterName: 'Rameshwar Singh Patel',
    submitterRole: 'farmer',
    submitterTrustScore: 92,
    submitterVerification: 'verified',
    marketId: 'mkt_lasalgaon',
    marketName: 'Lasalgaon APMC Market Yard',
    district: 'Nashik',
    state: 'Maharashtra',
    originalPrice: 2200,
    originalUnit: '₹/quintal',
    normalizedPricePerKg: 22.00,
    quantity: 150,
    transactionType: 'sell',
    date: '2026-09-23',
    notes: 'Medium red size onion lot, well dried.',
    confirmationsCount: 20,
    flagsCount: 0,
    confirmedByUserIds: [],
    flaggedByUserIds: [],
    isVerified: true,
    createdAt: '2026-09-23T11:00:00Z',
  },
  {
    id: 'sub_c_onion_1',
    cropId: 'crop_onion',
    cropName: 'Onion (Nashik Red & White)',
    submitterId: 'user_consumer_priya',
    submitterName: 'Priya Mukherjee',
    submitterRole: 'consumer',
    submitterTrustScore: 78,
    submitterVerification: 'verified',
    marketId: 'mkt_vashi',
    marketName: 'Vashi APMC Wholesale Market',
    district: 'Navi Mumbai',
    state: 'Maharashtra',
    originalPrice: 38,
    originalUnit: '₹/kg',
    normalizedPricePerKg: 38.00,
    quantity: 5,
    transactionType: 'buy',
    date: '2026-09-24',
    notes: 'Purchased retail in grocery chain.',
    confirmationsCount: 12,
    flagsCount: 0,
    confirmedByUserIds: [],
    flaggedByUserIds: [],
    isVerified: true,
    createdAt: '2026-09-24T08:10:00Z',
  },
];

export const INITIAL_SCHEMES: GovernmentScheme[] = [
  {
    id: 'scheme_pm_kisan',
    name: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    hindiName: 'प्रधानमंत्री किसान सम्मान निधि',
    bengaliName: 'প্রধানমন্ত্রী কিষাণ সম্মান নিধি',
    category: 'credit',
    benefits: 'Direct financial benefit of ₹6,000 per year paid in three equal 4-monthly installments of ₹2,000 directly into bank accounts.',
    eligibility: [
      'All landholding farmer families having cultivable land in their names',
      'Small and marginal farmers across all States/UTs',
      'Valid Aadhaar linked with operational bank account',
    ],
    requiredDocs: ['Aadhaar Card', 'Land Ownership Records (Khatian / Jamabandi)', 'Active Bank Passbook', 'Kisan Credit Card (if available)'],
    officialUrl: 'https://pmkisan.gov.in',
    applicationDeadline: 'Continuous Enrollment',
    isDemo: false,
  },
  {
    id: 'scheme_pmfby',
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    hindiName: 'प्रधानमंत्री फसल बीमा योजना',
    bengaliName: 'প্রধানমন্ত্রী ফসল বীমা যোজনা',
    category: 'insurance',
    benefits: 'Comprehensive crop insurance coverage against non-preventable natural risks (drought, flood, pest attack). Very low premium: 2% Kharif, 1.5% Rabi, 5% horticultural crops.',
    eligibility: [
      'All farmers growing notified crops in notified areas including sharecroppers and tenant farmers',
      'Both loanee and non-loanee farmers eligible',
    ],
    requiredDocs: ['Crop Sowing Certificate / Patwari Report', 'Land Possession Document / Khatian', 'Aadhaar Card', 'Bank Account Details'],
    officialUrl: 'https://pmfby.gov.in',
    applicationDeadline: 'Rabi Season: Dec 31, 2026',
    isDemo: false,
  },
  {
    id: 'scheme_enam',
    name: 'National Agriculture Market (e-NAM)',
    hindiName: 'राष्ट्रीय कृषि बाजार (ई-नाम)',
    bengaliName: 'জাতীয় কৃষি বাজার (ই-ন্যাম)',
    category: 'infrastructure',
    benefits: 'Pan-India electronic trading portal integrating existing APMC mandis to create a unified national market for agricultural commodities with transparent online bidding.',
    eligibility: [
      'Registered farmers wishing to sell quality-tested produce across mandis nationwide',
      'Traders and Commission Agents registered in participating APMCs',
    ],
    requiredDocs: ['Identity Proof (Aadhaar / Voter ID)', 'Bank Account Proof', 'APMC Mandi Registration Number'],
    officialUrl: 'https://enam.gov.in',
    isDemo: false,
  },
  {
    id: 'scheme_aif',
    name: 'Agriculture Infrastructure Fund (AIF)',
    hindiName: 'कृषि अवसंरचना कोष (AIF)',
    bengaliName: 'কৃষি অবকাঠামো তহবিল',
    category: 'infrastructure',
    benefits: 'Medium-to-long term debt financing for investment in viable projects for post-harvest management infrastructure and community farming assets. 3% interest subvention up to ₹2 Crore loan for 7 years.',
    eligibility: [
      'Primary Agricultural Credit Societies (PACS)',
      'Farmer Producer Organizations (FPOs)',
      'Agri-entrepreneurs and Startups',
      'Individual Farmers and Self Help Groups',
    ],
    requiredDocs: ['Detailed Project Report (DPR)', 'Entity Registration / PAN', 'Land Records / Lease Agreement', 'Bank Credit Assessment'],
    officialUrl: 'https://agriinfra.dac.gov.in',
    isDemo: false,
  },
];

export const INITIAL_SELLERS: SellerProfile[] = [
  {
    id: 'sel_ramesh',
    userId: 'user_farmer_ramesh',
    name: 'Rameshwar Singh Patel',
    verified: true,
    trustScore: 92,
    approxLocation: 'Meerut Rural Belt, UP (Near Daurala)',
    distanceKm: 4.8,
    phoneMasked: '+91 98765 •••••',
    directPickupAvailable: true,
    cropsAvailable: [
      { cropName: 'Wheat (Lokwan)', variety: 'Grade A', pricePerKg: 25.0, quantityAvailableKg: 1800 },
      { cropName: 'Potato (Jyoti)', variety: 'Fresh harvest', pricePerKg: 18.5, quantityAvailableKg: 950 },
    ],
  },
  {
    id: 'sel_baldev',
    userId: 'user_farmer_baldev',
    name: 'Baldev Singh Gill',
    verified: true,
    trustScore: 89,
    approxLocation: 'Ludhiana Perimeter, Punjab',
    distanceKm: 8.2,
    phoneMasked: '+91 98140 •••••',
    directPickupAvailable: true,
    cropsAvailable: [
      { cropName: 'Basmati Paddy', variety: 'PB-1121', pricePerKg: 38.0, quantityAvailableKg: 4200 },
      { cropName: 'Mustard Seeds', variety: 'Pusa Bold', pricePerKg: 53.0, quantityAvailableKg: 1200 },
    ],
  },
  {
    id: 'sel_suresh',
    userId: 'user_farmer_suresh',
    name: 'Suresh Patil',
    verified: false,
    trustScore: 71,
    approxLocation: 'Nashik Eastern Border, Maharashtra',
    distanceKm: 12.5,
    phoneMasked: '+91 97660 •••••',
    directPickupAvailable: false,
    cropsAvailable: [
      { cropName: 'Onion (Red)', variety: 'Export grade', pricePerKg: 24.0, quantityAvailableKg: 3000 },
      { cropName: 'Tomato (Hybrid)', variety: 'Abhinav', pricePerKg: 22.0, quantityAvailableKg: 800 },
    ],
  },
];

export const INITIAL_QUESTIONS: ExpertQuestion[] = [
  {
    id: 'q_1',
    userId: 'user_farmer_ramesh',
    userName: 'Rameshwar Singh Patel',
    userRole: 'farmer',
    category: 'market',
    title: 'When should I release stored potato stock to avoid sudden mandi price drops?',
    question: 'I have approximately 40 quintals of Jyoti potatoes stored in a local cold facility. Wholesale rates are oscillating between ₹17 and ₹19 per kg. Should I hold till mid October or offload now before new arrivals from South?',
    status: 'answered',
    createdAt: '2026-09-22T10:15:00Z',
    answers: [
      {
        id: 'ans_1',
        expertId: 'user_expert_sharma',
        expertName: 'Dr. Virendra K. Sharma',
        expertTitle: 'Agronomy & Agri-Marketing Advisor, ICAR',
        text: 'Reviewing current cold storage inventory in UP & Punjab, offloading 40% of your Jyoti stock in staggered tranches over the next 10-12 days at ₹18-19/kg is advisable. Southern Kharif arrivals in Hasan & Belagavi are tracking slightly early due to normal monsoons.',
        createdAt: '2026-09-22T14:40:00Z',
        isAiAssisted: false,
        upvotes: 18,
      },
    ],
  },
  {
    id: 'q_2',
    userId: 'user_consumer_priya',
    userName: 'Priya Mukherjee',
    userRole: 'consumer',
    category: 'quality',
    title: 'How can retail consumers check if wheat flour contains excessive bran or moisture?',
    question: 'When buying wheat directly in 50kg bags from farmers or local flour mills, what are simple physical tests to check moisture and freshness before milling?',
    status: 'answered',
    createdAt: '2026-09-21T09:00:00Z',
    answers: [
      {
        id: 'ans_2',
        expertId: 'user_expert_sharma',
        expertName: 'Dr. Virendra K. Sharma',
        expertTitle: 'Agronomy & Agri-Marketing Advisor, ICAR',
        text: 'A quick field check: press a grain between teeth; it should snap with a crisp crack sound rather than feeling gummy (which indicates >13% moisture). Fresh Sharbati grains are translucent with a lustrous amber tint.',
        createdAt: '2026-09-21T12:20:00Z',
        isAiAssisted: false,
        upvotes: 12,
      },
    ],
  },
];

export const INITIAL_WEATHER: WeatherData = {
  city: 'Meerut / Western UP Hub',
  district: 'Meerut',
  state: 'Uttar Pradesh',
  temp: 29.4,
  humidity: 68,
  rainProbability: 25,
  windSpeed: 11.2,
  condition: 'Partly Cloudy',
  icon: '⛅',
  agriculturalAdvisory: 'Favorable conditions for land preparation for early Rabi mustard. Spraying operations can proceed during morning hours before winds exceed 14 km/h.',
  forecast7Days: [
    { day: 'Thu (Today)', tempMax: 32, tempMin: 24, condition: 'Partly Cloudy', rainProb: 25 },
    { day: 'Fri (Tomorrow)', tempMax: 33, tempMin: 23, condition: 'Sunny', rainProb: 15 },
    { day: 'Sat', tempMax: 31, tempMin: 22, condition: 'Scattered Clouds', rainProb: 20 },
    { day: 'Sun', tempMax: 30, tempMin: 22, condition: 'Light Rain', rainProb: 65 },
    { day: 'Mon', tempMax: 29, tempMin: 21, condition: 'Cloudy', rainProb: 40 },
    { day: 'Tue', tempMax: 31, tempMin: 22, condition: 'Sunny', rainProb: 10 },
    { day: 'Wed', tempMax: 32, tempMin: 23, condition: 'Clear', rainProb: 10 },
  ],
};

export const INITIAL_REWARDS: Reward[] = [
  {
    id: 'rew_1',
    title: 'ICAR Regional Field Research Visit',
    description: 'Fully sponsored one-day educational tour and field workshop at the ICAR Regional Experimental Station.',
    pointsCost: 150,
    category: 'visit',
    provider: 'National Agri Research Initiative',
    imageUrl: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'rew_2',
    title: 'Certified Bio-Fertilizer & Micronutrient Kit (10kg)',
    description: 'Government lab tested organic soil nutrient package shipped directly to your registered village address.',
    pointsCost: 100,
    category: 'sample',
    provider: 'Kisan Soil Health Mission',
    imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'rew_3',
    title: 'Krishi Mela 2026 VIP Delegate Pass',
    description: 'Complimentary priority entry to the National Agricultural Machinery & Modern Farming Expo.',
    pointsCost: 80,
    category: 'event',
    provider: 'AgriTech India Council',
    imageUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=300&auto=format&fit=crop&q=80',
  },
];

export const INITIAL_TRADERS: TraderListing[] = [
  {
    id: 'trd_1',
    traderId: 'user_trader_gupta',
    businessName: 'Gupta Agri Logistics & Wholesale',
    contactName: 'Sanjay Gupta',
    phone: '+91 98334 11223',
    email: 'contact@guptaagro.com',
    state: 'Delhi',
    district: 'North Delhi',
    address: 'Shop No. 44, Shed D, Azadpur Mandi, Delhi - 110033',
    cropsHandled: ['Wheat', 'Potato', 'Onion', 'Rice'],
    verifiedBadge: true,
    subscriptionTier: 'enterprise',
    rating: 4.8,
    reviewsCount: 36,
  },
  {
    id: 'trd_2',
    traderId: 'trader_kisan_link',
    businessName: 'Maharashtra Kisan Link Co.',
    contactName: 'Nitin Deshmukh',
    phone: '+91 98221 44556',
    email: 'kisanlink@mhagro.com',
    state: 'Maharashtra',
    district: 'Nashik',
    address: 'APMC Complex, Gate 2, Lasalgaon, Nashik - 422306',
    cropsHandled: ['Onion', 'Tomato', 'Grapes'],
    verifiedBadge: true,
    subscriptionTier: 'pro',
    rating: 4.6,
    reviewsCount: 28,
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    userId: 'user_farmer_ramesh',
    type: 'price_rise',
    title: '📈 Wheat Price Rising at Aadhya Market',
    message: 'Local farmgate wheat prices rose by +5.3% over the past 48 hours to ₹24.50/kg.',
    date: '2026-09-24T08:00:00Z',
    isRead: false,
    link: '/prices?crop=crop_wheat',
  },
  {
    id: 'notif_2',
    userId: 'user_farmer_ramesh',
    type: 'reward',
    title: '🏆 +10 Trust Points Earned!',
    message: 'Your recent wheat price submission has been verified by 14 community members.',
    date: '2026-09-24T07:30:00Z',
    isRead: false,
    link: '/leaderboard',
  },
  {
    id: 'notif_3',
    userId: 'user_consumer_priya',
    type: 'price_drop',
    title: '📉 Potato Price Moderating',
    message: 'Wholesale arrivals lowered Delhi potato rates by 8% this morning.',
    date: '2026-09-24T09:15:00Z',
    isRead: false,
    link: '/prices?crop=crop_potato',
  },
];

export const INITIAL_ALERTS: PriceAlert[] = [
  {
    id: 'alt_1',
    userId: 'user_farmer_ramesh',
    cropId: 'crop_wheat',
    cropName: 'Wheat (Sharbati & Lokwan)',
    marketId: 'mkt_aadhya',
    marketName: 'Aadhya Rural Aggregation Center',
    targetPrice: 25.0,
    condition: 'above',
    status: 'active',
    notifyMethod: 'in-app',
    createdAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'alt_2',
    userId: 'user_consumer_priya',
    cropId: 'crop_potato',
    cropName: 'Potato (Jyoti & Pukhraj)',
    marketId: 'mkt_azadpur',
    marketName: 'Azadpur Mandi (APMC)',
    targetPrice: 20.0,
    condition: 'below',
    status: 'active',
    notifyMethod: 'in-app',
    createdAt: '2026-09-21T12:00:00Z',
  },
];

export const INITIAL_MODERATION: ModerationReport[] = [
  {
    id: 'mod_1',
    submissionId: 'sub_demo_anomaly',
    submitterName: 'Rohan Sharma (Unverified)',
    submitterId: 'usr_temp_901',
    reportedBy: 'Rameshwar Singh Patel',
    reason: 'Suspiciously high price entry: Reported Tomato at ₹180/kg when prevailing market is ₹24-40/kg.',
    cropName: 'Tomato',
    priceReported: 180,
    marketName: 'Azadpur Mandi',
    date: '2026-09-23',
    status: 'pending',
    createdAt: '2026-09-23T16:20:00Z',
  },
];

export interface AppState {
  users: User[];
  crops: Crop[];
  markets: Market[];
  submissions: PriceSubmission[];
  schemes: GovernmentScheme[];
  questions: ExpertQuestion[];
  weather: WeatherData;
  rewards: Reward[];
  traders: TraderListing[];
  notifications: NotificationItem[];
  alerts: PriceAlert[];
  moderationReports: ModerationReport[];
  sellers: SellerProfile[];
  currentUserId: string;
}

class StorageService {
  private state: AppState;

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): AppState {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not read from localStorage, using initial mock data', e);
    }

    return {
      users: INITIAL_USERS,
      crops: INITIAL_CROPS,
      markets: INITIAL_MARKETS,
      submissions: INITIAL_SUBMISSIONS,
      schemes: INITIAL_SCHEMES,
      questions: INITIAL_QUESTIONS,
      weather: INITIAL_WEATHER,
      rewards: INITIAL_REWARDS,
      traders: INITIAL_TRADERS,
      notifications: INITIAL_NOTIFICATIONS,
      alerts: INITIAL_ALERTS,
      moderationReports: INITIAL_MODERATION,
      sellers: INITIAL_SELLERS,
      currentUserId: 'user_farmer_ramesh', // default demo user
    };
  }

  private saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.error('Failed to write to localStorage', e);
    }
  }

  public getState(): AppState {
    return this.state;
  }

  public resetToDefault() {
    localStorage.removeItem(STORAGE_KEY);
    this.state = this.loadState();
    return this.state;
  }

  // --- Users & Auth ---
  public getCurrentUser(): User {
    const user = this.state.users.find((u) => u.id === this.state.currentUserId);
    return user || this.state.users[0];
  }

  public setCurrentUser(userId: string) {
    const user = this.state.users.find((u) => u.id === userId);
    if (user) {
      this.state.currentUserId = userId;
      this.saveState();
    }
  }

  public registerUser(userData: Omit<User, 'id' | 'trustScore' | 'accuracyRate' | 'contributionsCount' | 'createdAt' | 'badges'>): User {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      trustScore: userData.verificationStatus === 'verified' ? 80 : 50,
      accuracyRate: 100,
      contributionsCount: 0,
      badges: userData.role === 'farmer' ? ['New Farmer'] : ['New Consumer'],
      createdAt: new Date().toISOString(),
    };

    this.state.users.push(newUser);
    this.state.currentUserId = newUser.id;

    // Welcome notification
    this.addNotification({
      userId: newUser.id,
      type: 'reward',
      title: '🎉 Welcome to PriceXact!',
      message: `Your account has been registered with status: ${newUser.verificationStatus.toUpperCase()}. Start checking fair market rates.`,
    });

    this.saveState();
    return newUser;
  }

  public updateUserProfile(userId: string, updates: Partial<User>) {
    this.state.users = this.state.users.map((u) => (u.id === userId ? { ...u, ...updates } : u));
    this.saveState();
  }

  // --- Price Submissions & Engine Operations ---
  public getSubmissions(): PriceSubmission[] {
    return this.state.submissions;
  }

  public addSubmission(params: {
    cropId: string;
    marketId: string;
    originalPrice: number;
    originalUnit: any;
    quantity: number;
    transactionType: 'sell' | 'buy';
    notes?: string;
    photoUrl?: string;
    district?: string;
    state?: string;
  }): PriceSubmission {
    const currentUser = this.getCurrentUser();
    const crop = this.state.crops.find((c) => c.id === params.cropId);
    const market = this.state.markets.find((m) => m.id === params.marketId);

    const normalized = normalizePriceToPerKg(params.originalPrice, params.originalUnit, crop?.category);

    const newSub: PriceSubmission = {
      id: `sub_${Date.now()}`,
      cropId: params.cropId,
      cropName: crop ? crop.name : 'Agricultural Produce',
      submitterId: currentUser.id,
      submitterName: currentUser.name,
      submitterRole: currentUser.role,
      submitterTrustScore: currentUser.trustScore,
      submitterVerification: currentUser.verificationStatus,
      marketId: params.marketId,
      marketName: market ? market.name : 'Local Market',
      district: params.district || market?.district || currentUser.location.district,
      state: params.state || market?.state || currentUser.location.state,
      originalPrice: params.originalPrice,
      originalUnit: params.originalUnit,
      normalizedPricePerKg: normalized,
      quantity: params.quantity,
      transactionType: params.transactionType,
      date: new Date().toISOString().split('T')[0],
      notes: params.notes,
      photoUrl: params.photoUrl,
      confirmationsCount: 1,
      flagsCount: 0,
      confirmedByUserIds: [currentUser.id],
      flaggedByUserIds: [],
      isVerified: currentUser.verificationStatus === 'verified',
      createdAt: new Date().toISOString(),
    };

    this.state.submissions.unshift(newSub);

    // Gamification: Reward contributor with Trust Score (+10 for accurate contribution)
    this.state.users = this.state.users.map((u) => {
      if (u.id === currentUser.id) {
        const newScore = Math.min(100, u.trustScore + 10);
        const newCount = u.contributionsCount + 1;
        const newBadges = [...u.badges];
        if (newCount >= 5 && !newBadges.includes('Active Contributor')) {
          newBadges.push('Active Contributor');
        }
        if (newScore >= 90 && !newBadges.includes('Trust Champion')) {
          newBadges.push('Trust Champion');
        }
        return {
          ...u,
          trustScore: newScore,
          contributionsCount: newCount,
          badges: newBadges,
        };
      }
      return u;
    });

    // Add notification
    this.addNotification({
      userId: currentUser.id,
      type: 'reward',
      title: '🌾 Price Data Submitted (+10 Trust Points)',
      message: `Your submission for ${newSub.cropName} at ₹${newSub.normalizedPricePerKg}/kg is now live in community price intelligence.`,
    });

    // Check if any price alerts are triggered
    this.checkPriceAlerts(newSub);

    this.saveState();
    return newSub;
  }

  public confirmSubmission(submissionId: string): boolean {
    const currentUser = this.getCurrentUser();
    let updated = false;

    this.state.submissions = this.state.submissions.map((sub) => {
      if (sub.id === submissionId && !sub.confirmedByUserIds.includes(currentUser.id)) {
        updated = true;
        const updatedConfirmations = sub.confirmationsCount + 1;
        
        // Award points to submitter (+3)
        this.state.users = this.state.users.map((u) => {
          if (u.id === sub.submitterId) {
            return { ...u, trustScore: Math.min(100, u.trustScore + 3) };
          }
          if (u.id === currentUser.id) {
            // Award +1 to verifier for participating
            return { ...u, trustScore: Math.min(100, u.trustScore + 1) };
          }
          return u;
        });

        return {
          ...sub,
          confirmationsCount: updatedConfirmations,
          confirmedByUserIds: [...sub.confirmedByUserIds, currentUser.id],
        };
      }
      return sub;
    });

    if (updated) {
      this.saveState();
    }
    return updated;
  }

  public flagSubmission(submissionId: string, reason: string): boolean {
    const currentUser = this.getCurrentUser();
    const sub = this.state.submissions.find((s) => s.id === submissionId);
    if (!sub) return false;

    if (!sub.flaggedByUserIds.includes(currentUser.id)) {
      sub.flagsCount += 1;
      sub.flaggedByUserIds.push(currentUser.id);

      // Add to moderation queue
      this.state.moderationReports.unshift({
        id: `mod_${Date.now()}`,
        submissionId: sub.id,
        submitterName: sub.submitterName,
        submitterId: sub.submitterId,
        reportedBy: currentUser.name,
        reason: reason || 'Suspicious or inaccurate price data',
        cropName: sub.cropName,
        priceReported: sub.normalizedPricePerKg,
        marketName: sub.marketName,
        date: sub.date,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      this.saveState();
      return true;
    }
    return false;
  }

  // --- Moderation & Verification by Admin ---
  public verifyFarmer(userId: string) {
    this.state.users = this.state.users.map((u) => {
      if (u.id === userId) {
        const badges = [...u.badges];
        if (!badges.includes('Smart Farmer')) badges.push('Smart Farmer');
        return {
          ...u,
          verificationStatus: 'verified' as const,
          trustScore: Math.min(100, u.trustScore + 20),
          badges,
        };
      }
      return u;
    });

    this.addNotification({
      userId,
      type: 'reward',
      title: '🟢 Farmer Verification Approved!',
      message: 'Your Kisan Credit Card (KCC) and land record details have been validated by admin. You now carry the Verified Farmer badge.',
    });

    this.saveState();
  }

  public resolveModerationReport(reportId: string, action: 'dismiss' | 'warn' | 'remove_submission' | 'penalize') {
    const report = this.state.moderationReports.find((r) => r.id === reportId);
    if (!report) return;

    if (action === 'dismiss') {
      report.status = 'dismissed';
    } else if (action === 'warn') {
      report.status = 'resolved';
      this.addNotification({
        userId: report.submitterId,
        type: 'warning',
        title: '⚠️ Moderation Notice: Review your price submissions',
        message: `A community report was filed regarding your submission for ${report.cropName}. Please ensure accurate prevailing mandi rates are reported.`,
      });
    } else if (action === 'remove_submission') {
      report.status = 'resolved';
      this.state.submissions = this.state.submissions.filter((s) => s.id !== report.submissionId);
      this.state.users = this.state.users.map((u) => {
        if (u.id === report.submitterId) {
          return { ...u, trustScore: Math.max(10, u.trustScore - 10) };
        }
        return u;
      });
    } else if (action === 'penalize') {
      report.status = 'banned';
      this.state.submissions = this.state.submissions.filter((s) => s.id !== report.submissionId);
      this.state.users = this.state.users.map((u) => {
        if (u.id === report.submitterId) {
          return {
            ...u,
            trustScore: Math.max(0, u.trustScore - 25),
            verificationStatus: 'flagged' as const,
          };
        }
        return u;
      });
    }

    this.saveState();
  }

  // --- Alerts ---
  public addPriceAlert(alert: Omit<PriceAlert, 'id' | 'createdAt' | 'status'>): PriceAlert {
    const newAlert: PriceAlert = {
      ...alert,
      id: `alt_${Date.now()}`,
      status: 'active',
      createdAt: new Date().toISOString(),
    };
    this.state.alerts.unshift(newAlert);
    this.saveState();
    return newAlert;
  }

  public deletePriceAlert(id: string) {
    this.state.alerts = this.state.alerts.filter((a) => a.id !== id);
    this.saveState();
  }

  private checkPriceAlerts(sub: PriceSubmission) {
    this.state.alerts.forEach((alert) => {
      if (alert.status === 'active' && alert.cropId === sub.cropId) {
        const triggered =
          (alert.condition === 'below' && sub.normalizedPricePerKg <= alert.targetPrice) ||
          (alert.condition === 'above' && sub.normalizedPricePerKg >= alert.targetPrice);

        if (triggered) {
          alert.status = 'triggered';
          alert.triggeredAt = new Date().toISOString();
          this.addNotification({
            userId: alert.userId,
            type: alert.condition === 'below' ? 'price_drop' : 'price_rise',
            title: `🔔 Price Alert Triggered for ${alert.cropName}!`,
            message: `Latest price reported at ₹${sub.normalizedPricePerKg}/kg in ${sub.marketName} (Target was ${alert.condition} ₹${alert.targetPrice}/kg).`,
            link: `/prices?crop=${alert.cropId}`,
          });
        }
      }
    });
  }

  // --- Expert Questions ---
  public addExpertQuestion(data: { title: string; question: string; category: any }): ExpertQuestion {
    const user = this.getCurrentUser();
    const newQ: ExpertQuestion = {
      id: `q_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      category: data.category,
      title: data.title,
      question: data.question,
      status: 'open',
      createdAt: new Date().toISOString(),
      answers: [],
    };
    this.state.questions.unshift(newQ);
    this.saveState();
    return newQ;
  }

  public answerExpertQuestion(questionId: string, answerText: string) {
    const user = this.getCurrentUser();
    const q = this.state.questions.find((x) => x.id === questionId);
    if (!q) return;

    q.answers.push({
      id: `ans_${Date.now()}`,
      expertId: user.id,
      expertName: user.name,
      expertTitle: user.role === 'expert' ? 'Agricultural Specialist' : 'Community Verifier',
      text: answerText,
      createdAt: new Date().toISOString(),
      isAiAssisted: false,
      upvotes: 1,
    });
    q.status = 'answered';

    this.addNotification({
      userId: q.userId,
      type: 'market_update',
      title: '💬 Expert Answered Your Question',
      message: `${user.name} posted an advisory response to your query "${q.title.slice(0, 40)}..."`,
      link: '/expert',
    });

    this.saveState();
  }

  // --- Rewards & Gamification ---
  public redeemReward(rewardId: string): boolean {
    const user = this.getCurrentUser();
    const reward = this.state.rewards.find((r) => r.id === rewardId);
    if (!reward || user.trustScore < reward.pointsCost) return false;

    // Deduct points
    this.state.users = this.state.users.map((u) => {
      if (u.id === user.id) {
        return { ...u, trustScore: u.trustScore - reward.pointsCost };
      }
      return u;
    });

    reward.isRedeemed = true;
    reward.voucherCode = `PX-${Math.random().toString(36).substring(2, 8).toUpperCase()}-2026`;

    this.addNotification({
      userId: user.id,
      type: 'reward',
      title: '🎁 Reward Redeemed Successfully!',
      message: `You redeemed "${reward.title}". Voucher Code: ${reward.voucherCode}. Instructions dispatched.`,
    });

    this.saveState();
    return true;
  }

  // --- Notifications Helper ---
  public addNotification(item: Omit<NotificationItem, 'id' | 'date' | 'isRead'>) {
    const notif: NotificationItem = {
      ...item,
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      date: new Date().toISOString(),
      isRead: false,
    };
    this.state.notifications.unshift(notif);
  }

  public markNotificationAsRead(id: string) {
    this.state.notifications = this.state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    this.saveState();
  }

  public markAllNotificationsAsRead(userId: string) {
    this.state.notifications = this.state.notifications.map((n) => (n.userId === userId ? { ...n, isRead: true } : n));
    this.saveState();
  }
}

export const storage = new StorageService();
