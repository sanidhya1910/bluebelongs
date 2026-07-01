import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diving Safety',
  description:
    'Diving safety guidelines, emergency contacts (DAN, local services) and certification requirements for diving with Blue Belong.',
  alternates: { canonical: '/safety' },
  openGraph: {
    title: 'Diving Safety | Blue Belong',
    description:
      'Diving safety guidelines, emergency contacts and certification requirements for diving with Blue Belong.',
    url: '/safety',
  },
};

export default function SafetyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
