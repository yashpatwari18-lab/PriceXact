import { ActivityTimeframe, LiveUserMetrics, ActivityPoint } from '../types';

// Pre-seeded consistent demo activity histories for college presentation
// Realistic diurnal curves (peaks during morning mandi auction hours 5am-10am and evening 5pm-8pm)
const DEMO_ACTIVITY_SERIES: Record<ActivityTimeframe, ActivityPoint[]> = {
  '1h': [
    { timestamp: '12:00', label: '12:00', activeUsers: 342, farmers: 198, consumers: 114, traders: 30 },
    { timestamp: '12:10', label: '12:10', activeUsers: 358, farmers: 205, consumers: 121, traders: 32 },
    { timestamp: '12:20', label: '12:20', activeUsers: 374, farmers: 216, consumers: 125, traders: 33 },
    { timestamp: '12:30', label: '12:30', activeUsers: 391, farmers: 228, consumers: 130, traders: 33 },
    { timestamp: '12:40', label: '12:40', activeUsers: 415, farmers: 242, consumers: 138, traders: 35 },
    { timestamp: '12:50', label: '12:50', activeUsers: 428, farmers: 250, consumers: 142, traders: 36 },
    { timestamp: '13:00', label: '13:00', activeUsers: 436, farmers: 254, consumers: 146, traders: 36 },
  ],
  '6h': [
    { timestamp: '07:00', label: '07:00 AM', activeUsers: 580, farmers: 390, consumers: 140, traders: 50 },
    { timestamp: '08:00', label: '08:00 AM', activeUsers: 642, farmers: 425, consumers: 165, traders: 52 },
    { timestamp: '09:00', label: '09:00 AM', activeUsers: 590, farmers: 380, consumers: 162, traders: 48 },
    { timestamp: '10:00', label: '10:00 AM', activeUsers: 495, farmers: 305, consumers: 150, traders: 40 },
    { timestamp: '11:00', label: '11:00 AM', activeUsers: 420, farmers: 245, consumers: 140, traders: 35 },
    { timestamp: '12:00', label: '12:00 PM', activeUsers: 385, farmers: 220, consumers: 135, traders: 30 },
    { timestamp: '13:00', label: '01:00 PM', activeUsers: 436, farmers: 254, consumers: 146, traders: 36 },
  ],
  '12h': [
    { timestamp: '01:00', label: '01:00 AM', activeUsers: 45, farmers: 28, consumers: 12, traders: 5 },
    { timestamp: '03:00', label: '03:00 AM', activeUsers: 180, farmers: 135, consumers: 25, traders: 20 },
    { timestamp: '05:00', label: '05:00 AM', activeUsers: 490, farmers: 360, consumers: 85, traders: 45 },
    { timestamp: '07:00', label: '07:00 AM', activeUsers: 620, farmers: 410, consumers: 160, traders: 50 },
    { timestamp: '09:00', label: '09:00 AM', activeUsers: 585, farmers: 375, consumers: 165, traders: 45 },
    { timestamp: '11:00', label: '11:00 AM', activeUsers: 420, farmers: 245, consumers: 140, traders: 35 },
    { timestamp: '13:00', label: '01:00 PM', activeUsers: 436, farmers: 254, consumers: 146, traders: 36 },
  ],
  '24h': [
    { timestamp: 'Yesterday', label: '13:00', activeUsers: 410, farmers: 240, consumers: 135, traders: 35 },
    { timestamp: '17:00', label: '17:00', activeUsers: 530, farmers: 280, consumers: 210, traders: 40 },
    { timestamp: '21:00', label: '21:00', activeUsers: 340, farmers: 160, consumers: 155, traders: 25 },
    { timestamp: '01:00', label: '01:00', activeUsers: 45, farmers: 28, consumers: 12, traders: 5 },
    { timestamp: '05:00', label: '05:00', activeUsers: 490, farmers: 360, consumers: 85, traders: 45 },
    { timestamp: '09:00', label: '09:00', activeUsers: 585, farmers: 375, consumers: 165, traders: 45 },
    { timestamp: 'Today', label: '13:00', activeUsers: 436, farmers: 254, consumers: 146, traders: 36 },
  ],
  '7d': [
    { timestamp: 'Sat', label: 'Sat (19 Sep)', activeUsers: 2450, farmers: 1520, consumers: 780, traders: 150 },
    { timestamp: 'Sun', label: 'Sun (20 Sep)', activeUsers: 2890, farmers: 1680, consumers: 1040, traders: 170 },
    { timestamp: 'Mon', label: 'Mon (21 Sep)', activeUsers: 3420, farmers: 2190, consumers: 1020, traders: 210 },
    { timestamp: 'Tue', label: 'Tue (22 Sep)', activeUsers: 3560, farmers: 2280, consumers: 1060, traders: 220 },
    { timestamp: 'Wed', label: 'Wed (23 Sep)', activeUsers: 3610, farmers: 2310, consumers: 1080, traders: 220 },
    { timestamp: 'Thu', label: 'Thu (24 Sep)', activeUsers: 3720, farmers: 2390, consumers: 1100, traders: 230 },
    { timestamp: 'Fri', label: 'Fri (25 Sep)', activeUsers: 3840, farmers: 2460, consumers: 1140, traders: 240 },
  ],
};

export function getLiveUserMetrics(timeframe: ActivityTimeframe = '24h'): LiveUserMetrics {
  const history = DEMO_ACTIVITY_SERIES[timeframe] || DEMO_ACTIVITY_SERIES['24h'];
  const latest = history[history.length - 1];

  return {
    currentActiveUsers: latest.activeUsers,
    farmersOnline: latest.farmers,
    consumersOnline: latest.consumers,
    tradersOnline: latest.traders,
    timeframe,
    history,
    isDemoData: true,
    dataStatus: 'SAMPLE_DEMO',
  };
}
