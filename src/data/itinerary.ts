import type { ReactNode } from 'react';

export type Weather = {
  temp: number | null;
  wind: number | null;
  code: number | null;
};

export const islandCoords = {
  havelock: { name: 'Havelock (Swaraj Dweep)', lat: 11.957, lon: 93.0 },
  neil: { name: 'Neil (Shaheed Dweep)', lat: 11.83, lon: 93.03 },
};

export type TransportOption = {
  icon: ReactNode;
  title: string;
  description: string;
  details: string[];
  tips: string;
};

export const transportOptions: TransportOption[] = [
  {
    icon: null,
    title: 'By Air (Recommended)',
    description: 'Fly directly to Port Blair from major Indian cities',
    details: [
      'Direct flights from Delhi, Mumbai, Chennai, Kolkata, Bangalore',
      'Flight duration: 2-5 hours depending on origin',
      'Airlines: Air India, IndiGo, SpiceJet, Vistara',
      'Book in advance for better prices',
    ],
    tips: 'Most convenient option. Airport is well-connected to the city center.',
  },
  {
    icon: null,
    title: 'By Sea',
    description: 'Ferry services from Chennai, Kolkata, and Visakhapatnam',
    details: [
      'MV Akbar from Chennai (3-4 days)',
      'MV Nancowry from Kolkata (3-4 days)',
      'MV Harsha Vardhana from Visakhapatnam (2-3 days)',
      'Book tickets well in advance',
    ],
    tips: 'Adventure option but takes longer. Subject to weather conditions.',
  },
];

export type ItineraryDay = {
  day: string;
  title: string;
  activities: string[];
};

export const itineraryDays: ItineraryDay[] = [
  {
    day: 'Day 1',
    title: 'Arrival in Port Blair',
    activities: [
      'Arrive at Veer Savarkar International Airport',
      'Check into accommodation',
      'Visit Cellular Jail Light & Sound Show (evening)',
      'Rest and prepare for diving adventures',
    ],
  },
  {
    day: 'Day 2',
    title: 'Diving Course Begins',
    activities: [
      'Meet at Blue Belongs Diving Center',
      'Complete medical forms and equipment fitting',
      'Theory sessions and pool training',
      'First confined water dives',
    ],
  },
  {
    day: 'Day 3-4',
    title: 'Open Water Training',
    activities: [
      'Open water dives at pristine locations',
      'Marine life exploration',
      'Skill development and safety training',
      'Underwater photography opportunities',
    ],
  },
  {
    day: 'Day 5',
    title: 'Certification & Exploration',
    activities: [
      'Final skills assessment',
      'Receive SSI certification',
      'Explore Ross Island or North Bay',
      'Celebration dinner',
    ],
  },
];

export const essentialInfo = [
  { title: 'Best Time to Visit', content: 'October to May (dry season with calm waters)' },
  { title: 'Currency', content: 'Indian Rupee (INR). ATMs available in Port Blair' },
  { title: 'Language', content: 'Hindi, English, Bengali, and Tamil widely spoken' },
  { title: 'Climate', content: 'Tropical climate, 23-30°C year-round' },
];

export const packingList: string[] = [
  'Valid government photo ID (mandatory)',
  'Swimwear and comfortable clothing',
  'Sunscreen (reef-safe recommended)',
  'Sunglasses and hat',
  'Water bottle',
  'Personal medications',
  'Underwater camera (optional)',
  'Light jacket for air-conditioned spaces',
];
