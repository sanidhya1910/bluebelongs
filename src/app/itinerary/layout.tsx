import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Travel Itinerary',
  description:
    'How to reach Havelock Island, what to pack, local weather and a suggested itinerary for your diving trip with Blue Belong.',
  alternates: { canonical: '/itinerary' },
  openGraph: {
    title: 'Travel Itinerary | Blue Belong',
    description:
      'How to reach Havelock Island, what to pack, local weather and a suggested itinerary for your diving trip with Blue Belong.',
    url: '/itinerary',
  },
};

export default function ItineraryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
