import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Answers to common questions about diving courses, safety, medical requirements, and planning your trip with Blue Belong in the Andamans.',
  alternates: { canonical: '/faq' },
  openGraph: {
    title: 'Frequently Asked Questions | Blue Belong',
    description:
      'Answers to common questions about diving courses, safety, medical requirements, and planning your trip with Blue Belong.',
    url: '/faq',
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
