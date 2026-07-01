import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diving Blog',
  description:
    'Stories, tips and guides from the Blue Belong team — marine conservation, dive spots around Havelock, techniques and trip planning.',
  alternates: { canonical: '/blogs' },
  openGraph: {
    title: 'Diving Blog | Blue Belong',
    description:
      'Stories, tips and guides from the Blue Belong team — marine conservation, dive spots around Havelock, techniques and trip planning.',
    url: '/blogs',
  },
};

export default function BlogsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
