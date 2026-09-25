export type UserRole = 'farmer' | 'consumer' | 'expert' | 'trader' | 'admin';

export type VerificationStatus = 'verified' | 'temporary' | 'flagged' | 'banned';

export type DataStatus = 'VERIFIED' | 'SAMPLE_DEMO' | 'COMMUNITY_SUBMITTED' | 'OFFICIAL' | 'UNAVAILABLE';

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  role: UserRole;
  location: {
    state: string;
    district: string;
    villageOrTown: string;
    locality?: string;
    lat?: number;
    lng?: number;
  };
  currentDetectedLocation?: {
    state: string;
    district: string;
    locality?: string;
    lat?: number;
    lng?: number;
    source?: 'geolocation' | 'ip_approximate' | 'manual';
    detectedAt?: string;
  };
  locationRisk?: 'low' | 'medium' | 'high';
  manualReviewRequired?: boolean;
  locationMismatchReason?: string;
  verificationStatus: VerificationStatus;
  trustScore: number;
  accuracyRate: number;
  contributionsCount: number;
  kccId?: string;
  khatianNumber?: string;
  businessName?: string;
  employeeId?: string;
  isAnonymousLeaderboard?: boolean;
  avatar?: string;
  createdAt: string;
  badges: string[];
}

export type CropCategory = 'cereal' | 'vegetable' | 'pulse' | 'fruit' | 'oilseed' | 'spice';

export interface Crop {
  id: string;
  name: string;
  hindiName: string;
  bengaliName: string;
  category: CropCategory;
  icon: string;
  variety?: string;
  defaultUnit: string;
  baseReferencePrice: number; // in Rs/kg
  minPrice?: number;
  maxPrice?: number;
  modalPrice?: number;
  season: string;
  description: string;
  dataStatus?: DataStatus;
}

export type MarketType = 'mandi' | 'apmc' | 'retail' | 'cooperative' | 'farmer_market' | 'wholesale';

export interface Market {
  id: string;
  name: string;
  district: string;
  state: string;
  locality?: string;
  type: MarketType;
  distanceKm?: number;
  lat: number;
  lng: number;
  address: string;
  dataStatus: DataStatus;
  lastUpdated: string;
  availableCrops?: string[];
  contactPerson?: string;
  openingHours?: string;
  modalPriceSummary?: Record<string, number>; // cropId -> modal price in Rs/kg
}

export type UnitType = '₹/kg' | '₹/quintal' | '₹/ton' | '₹/piece' | '₹/litre';

export interface PriceSubmission {
  id: string;
  cropId: string;
  cropName: string;
  submitterId: string;
  submitterName: string;
  submitterRole: UserRole;
  submitterTrustScore: number;
  submitterVerification: VerificationStatus;
  marketId: string;
  marketName: string;
  district: string;
  state: string;
  originalPrice: number;
  originalUnit: UnitType;
  normalizedPricePerKg: number;
  quantity: number;
  transactionType: 'sell' | 'buy';
  date: string;
  notes?: string;
  photoUrl?: string;
  confirmationsCount: number;
  flagsCount: number;
  confirmedByUserIds: string[];
  flaggedByUserIds: string[];
  isVerified: boolean;
  createdAt: string;
}

export interface PriceObservation {
  cropId: string;
  cropName: string;
  marketId: string;
  marketName: string;
  farmerPriceAvg: number;
  consumerPriceAvg: number;
  wholesalePriceAvg: number;
  retailPriceAvg: number;
  officialRefPrice: number;
  priceDifference: number;
  percentageDifference: number;
  rawSampleCount: number;
  trimmedSampleCount: number;
  stdDev: number;
  fluctuationPercent: number;
  trend: 'up' | 'down' | 'stable';
  confidenceScore: 'High' | 'Medium' | 'Low';
  lastUpdated: string;
}

export interface PriceHistoryPoint {
  date: string;
  farmerPrice: number;
  consumerPrice: number;
  wholesalePrice?: number;
}

export interface ForecastPoint {
  date: string;
  predictedPrice: number;
  upperConfidence: number;
  lowerConfidence: number;
  isHistorical?: boolean;
  actualPrice?: number;
}

export interface ForecastResult {
  cropId: string;
  cropName: string;
  marketId: string;
  marketName: string;
  predictedPrice: number;
  trendDirection: 'increasing' | 'decreasing' | 'stable';
  forecastDays: number;
  historicalAverage: number;
  dataPointsUsed: number;
  confidenceIndicator: 'High' | 'Medium' | 'Low';
  slope: number;
  points: ForecastPoint[];
  methodNote: string;
}

export interface PriceAlert {
  id: string;
  userId: string;
  cropId: string;
  cropName: string;
  marketId: string;
  marketName: string;
  targetPrice: number;
  condition: 'below' | 'above';
  status: 'active' | 'triggered' | 'paused';
  notifyMethod: 'in-app' | 'push' | 'sms';
  createdAt: string;
  triggeredAt?: string;
}

export interface WeatherData {
  city: string;
  district: string;
  state: string;
  temp: number;
  humidity: number;
  rainProbability: number;
  windSpeed: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Cloudy' | 'Light Rain' | 'Heavy Rain' | 'Clear';
  icon: string;
  agriculturalAdvisory: string;
  forecast7Days: {
    day: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    rainProb: number;
  }[];
}

export interface GovernmentScheme {
  id: string;
  name: string;
  hindiName: string;
  bengaliName: string;
  category: 'subsidy' | 'credit' | 'insurance' | 'infrastructure' | 'irrigation';
  benefits: string;
  eligibility: string[];
  requiredDocs: string[];
  officialUrl: string;
  applicationDeadline?: string;
  isDemo: boolean;
}

export interface ExpertAnswer {
  id: string;
  expertId: string;
  expertName: string;
  expertTitle: string;
  text: string;
  createdAt: string;
  isAiAssisted?: boolean;
  upvotes: number;
}

export interface ExpertQuestion {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  category: 'crop' | 'market' | 'quality' | 'farming' | 'buying' | 'storage' | 'general';
  title: string;
  question: string;
  audioSimulated?: boolean;
  imageUrl?: string;
  status: 'open' | 'answered';
  createdAt: string;
  answers: ExpertAnswer[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'price_alert' | 'weather_alert' | 'scheme_alert' | 'price_drop' | 'price_rise' | 'market_update' | 'reward' | 'warning';
  title: string;
  message: string;
  date: string;
  isRead: boolean;
  link?: string;
}

export interface Reward {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: 'visit' | 'sample' | 'voucher' | 'event' | 'certificate';
  provider: string;
  imageUrl?: string;
  isRedeemed?: boolean;
  voucherCode?: string;
}

export interface TraderListing {
  id: string;
  traderId: string;
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  state: string;
  district: string;
  address: string;
  cropsHandled: string[];
  verifiedBadge: boolean;
  subscriptionTier: 'free' | 'pro' | 'enterprise';
  rating: number;
  reviewsCount: number;
}

export interface ModerationReport {
  id: string;
  submissionId: string;
  submitterName: string;
  submitterId: string;
  reportedBy: string;
  reason: string;
  cropName: string;
  priceReported: number;
  marketName: string;
  date: string;
  status: 'pending' | 'dismissed' | 'resolved' | 'banned';
  createdAt: string;
}

export interface SellerProfile {
  id: string;
  userId: string;
  name: string;
  verified: boolean;
  trustScore: number;
  approxLocation: string;
  distanceKm: number;
  cropsAvailable: {
    cropName: string;
    variety?: string;
    pricePerKg: number;
    quantityAvailableKg: number;
  }[];
  phoneMasked: string;
  directPickupAvailable: boolean;
}

export type ActivityTimeframe = '1h' | '6h' | '12h' | '24h' | '7d';

export interface ActivityPoint {
  timestamp: string;
  label: string;
  activeUsers: number;
  farmers: number;
  consumers: number;
  traders: number;
}

export interface LiveUserMetrics {
  currentActiveUsers: number;
  farmersOnline: number;
  consumersOnline: number;
  tradersOnline: number;
  timeframe: ActivityTimeframe;
  history: ActivityPoint[];
  isDemoData: boolean;
  dataStatus: DataStatus;
}

export interface LocationVerificationQueueItem {
  id: string;
  userId: string;
  userName: string;
  declaredState: string;
  declaredDistrict: string;
  declaredVillage: string;
  detectedRegion: string;
  detectedState: string;
  detectedDistrict: string;
  detectedLocality?: string;
  distanceKm: number;
  riskReason: string;
  riskLevel: 'medium' | 'high';
  status: 'pending' | 'verified' | 'dismissed' | 'manual_review';
  flaggedAt: string;
  kccNumber?: string;
  khatianNumber?: string;
}

export interface StateDistrictHierarchy {
  state: string;
  districts: {
    district: string;
    localities?: string[];
  }[];
}
