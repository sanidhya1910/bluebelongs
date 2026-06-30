import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marine Life',
  description:
    'Explore the marine life of the Andaman Sea — turtles, reef fish, rays, and more you can encounter while diving with Blue Belong.',
  alternates: { canonical: '/marine-life' },
  openGraph: {
    title: 'Marine Life of the Andaman Sea',
    description:
      'Explore the marine life of the Andaman Sea — turtles, reef fish, rays, and more you can encounter while diving with Blue Belong.',
    url: '/marine-life',
  },
};

export default function MarineLifeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
