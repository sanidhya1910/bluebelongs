import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Meet the team behind Blue Belong — an SSI-certified dive school in Havelock guiding divers to reconnect with the ocean.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About Blue Belong',
    description:
      'Meet the team behind Blue Belong — an SSI-certified dive school in Havelock guiding divers to reconnect with the ocean.',
    url: '/about',
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
