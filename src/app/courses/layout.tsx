import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site';
import { courses } from '@/data/courses';

export const metadata: Metadata = {
  title: 'SSI Diving Courses',
  description:
    'SSI-certified diving courses in the Andamans — from Try Scuba and Open Water to Advanced, Rescue and specialty certifications.',
  alternates: { canonical: '/courses' },
  openGraph: {
    title: 'SSI Diving Courses | Blue Belong',
    description:
      'SSI-certified diving courses in the Andamans — from Try Scuba and Open Water to Advanced, Rescue and specialty certifications.',
    url: '/courses',
  },
};

const coursesJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: courses.map((course, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Course',
      name: course.title,
      description: course.description,
      provider: {
        '@type': 'Organization',
        name: siteConfig.name,
        sameAs: siteConfig.url,
      },
    },
  })),
};

export default function CoursesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(coursesJsonLd) }}
      />
      {children}
    </>
  );
}
