import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/site';
import { blogPosts } from '@/data/blogs';

export const dynamic = 'force-static';

// trailingSlash is enabled, so URLs end with "/".
function url(path: string) {
  return `${siteConfig.url}${path === '/' ? '/' : `${path}/`}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['/', '/about', '/courses', '/marine-life', '/blogs', '/faq', '/safety', '/itinerary', '/medical-form', '/login'];

  const staticEntries = staticRoutes.map((route) => ({
    url: url(route),
    changeFrequency: 'monthly' as const,
    priority: route === '/' ? 1 : 0.7,
  }));

  const blogEntries = blogPosts.map((post) => ({
    url: url(`/blogs/${post.id}`),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...staticEntries, ...blogEntries];
}
