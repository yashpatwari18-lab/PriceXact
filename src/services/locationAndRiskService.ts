import { Market, User, LocationVerificationQueueItem } from '../types';
import { ALL_SEEDED_MARKETS, calculateHaversineDistanceKm } from './mandiDatabase';

export interface UserDetectedLocation {
  state: string;
  district: string;
  locality?: string;
  lat: number;
  lng: number;
  source: 'geolocation' | 'ip_approximate' | 'manual';
  status: 'granted' | 'denied' | 'prompt' | 'manual';
  label: string;
}

// Default benchmark locations for India
export const PRESET_DEMO_LOCATIONS: UserDetectedLocation[] = [
  {
    state: 'West Bengal',
    district: 'Kolkata',
    locality: 'Central Kolkata (Bara Bazar / Sealdah)',
    lat: 22.5726,
    lng: 88.3639,
    source: 'geolocation',
    status: 'granted',
    label: 'Kolkata Central, West Bengal',
  },
  {
    state: 'West Bengal',
    district: 'Hooghly',
    locality: 'Bally',
    lat: 22.645,
    lng: 88.345,
    source: 'geolocation',
    status: 'granted',
    label: 'Bally, Hooghly, West Bengal',
  },
  {
    state: 'West Bengal',
    district: 'Purba Bardhaman',
    locality: 'Raina Block',
    lat: 23.05,
    lng: 87.9,
    source: 'geolocation',
    status: 'granted',
    label: 'Raina, Purba Bardhaman, West Bengal',
  },
  {
    state: 'Delhi',
    district: 'North Delhi',
    locality: 'Azadpur',
    lat: 28.7153,
    lng: 77.1784,
    source: 'geolocation',
    status: 'granted',
    label: 'North Delhi, Delhi (Azadpur)',
  },
  {
    state: 'Uttar Pradesh',
    district: 'Meerut',
    locality: 'Daurala',
    lat: 29.112,
    lng: 77.721,
    source: 'geolocation',
    status: 'granted',
    label: 'Daurala, Meerut, Uttar Pradesh',
  },
];

// Seeded Location Verification Queue for Admin
export const INITIAL_VERIFICATION_QUEUE: LocationVerificationQueueItem[] = [
  {
    id: 'queue_subhash_kolkata',
    userId: 'user_farmer_subhash_demo',
    userName: 'Subhash Chandra Mondal',
    declaredState: 'West Bengal',
    declaredDistrict: 'Purba Bardhaman',
    declaredVillage: 'Raina Gram Panchayat, Raina II Block',
    detectedRegion: 'Central Kolkata (Burrabazar / Sealdah), West Bengal',
    detectedState: 'West Bengal',
    detectedDistrict: 'Kolkata',
    detectedLocality: 'Burrabazar Posta',
    distanceKm: 114.5,
    riskReason:
      'Current login telemetry from urban commercial hub (Central Kolkata) does not match declared agricultural land coordinates (Purba Bardhaman). Temporary verification hold applied.',
    riskLevel: 'high',
    status: 'pending',
    flaggedAt: '2026-09-25T08:30:00Z',
    kccNumber: 'KCC-WB-BARD-2024-4109',
    khatianNumber: 'KH-142/RAINA-P7',
  },
  {
    id: 'queue_ramesh_delhi',
    userId: 'user_farmer_ramesh_test',
    userName: 'Rameshwar Singh Patel (Urban Login Test)',
    declaredState: 'Uttar Pradesh',
    declaredDistrict: 'Meerut',
    declaredVillage: 'Daurala Khurd',
    detectedRegion: 'Connaught Place, Central Delhi',
    detectedState: 'Delhi',
    detectedDistrict: 'New Delhi',
    distanceKm: 76.2,
    riskReason:
      'Frequent price reporting initiated 76 km away from registered farming perimeter without declared secondary wholesale transport trip.',
    riskLevel: 'medium',
    status: 'manual_review',
    flaggedAt: '2026-09-24T18:15:00Z',
    kccNumber: 'KCC-UP-MEE-2024-8921',
    khatianNumber: 'KH-892/14B',
  },
];

// Compute Nearby Markets with distance
export function getNearbyMarkets(
  userLat: number,
  userLng: number,
  markets: Market[] = ALL_SEEDED_MARKETS,
  maxDistanceKm: number = 300
): (Market & { calculatedDistanceKm: number })[] {
  return markets
    .map((m) => {
      const dist = calculateHaversineDistanceKm(userLat, userLng, m.lat, m.lng);
      return {
        ...m,
        calculatedDistanceKm: dist,
      };
    })
    .sort((a, b) => a.calculatedDistanceKm - b.calculatedDistanceKm);
}

// Evaluate location risk for a farmer
export function evaluateLocationRisk(
  declaredState: string,
  declaredDistrict: string,
  detectedLat?: number,
  detectedLng?: number,
  detectedState?: string,
  detectedDistrict?: string
): {
  isMismatch: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  reason?: string;
  distanceKm?: number;
} {
  if (!detectedState || !detectedDistrict) {
    return { isMismatch: false, riskLevel: 'low' };
  }

  // Exact district match
  if (
    declaredState.toLowerCase() === detectedState.toLowerCase() &&
    declaredDistrict.toLowerCase() === detectedDistrict.toLowerCase()
  ) {
    return { isMismatch: false, riskLevel: 'low' };
  }

  // Cross-district within same state
  if (declaredState.toLowerCase() === detectedState.toLowerCase()) {
    // Check if detected in a metro while farm is rural
    const isUrbanKolkata = detectedDistrict.toLowerCase().includes('kolkata');
    if (isUrbanKolkata && !declaredDistrict.toLowerCase().includes('kolkata')) {
      return {
        isMismatch: true,
        riskLevel: 'high',
        reason:
          'Your active login location (Kolkata Metro) is physically separated from your registered agricultural farmgate in ' +
          declaredDistrict +
          '. To maintain crowdsourced data integrity, additional verification is required.',
      };
    }

    return {
      isMismatch: true,
      riskLevel: 'medium',
      reason:
        'Detected login in ' +
        detectedDistrict +
        ' differs from registered farm district (' +
        declaredDistrict +
        ').',
    };
  }

  // Cross-state mismatch (e.g. Farm in UP, login in Kolkata)
  return {
    isMismatch: true,
    riskLevel: 'high',
    reason:
      'Current login detected in ' +
      detectedDistrict +
      ', ' +
      detectedState +
      ', which does not match your registered farming state (' +
      declaredState +
      ').',
  };
}
