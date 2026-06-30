import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, Clock, User, ArrowLeft } from 'lucide-react';
import { blogPosts } from '@/data/blogs';

// Static export: pre-render one page per known post; unknown ids 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return blogPosts.map((post) => ({ id: post.id }));
}

function getPost(id: string) {
  return blogPosts.find((post) => post.id === id);
}

function formatDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const post = getPost(id);
  if (!post) {
    return { title: 'Article Not Found - Blue Belong' };
  }
  return {
    title: `${post.title} - Blue Belong Diving Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      images: [{ url: post.image }],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = getPost(id);
  if (!post) {
    notFound();
  }

  const related = blogPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 3);

  const paragraphs = post.content
    ? post.content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
    : [];

  return (
    <div className="min-h-screen sand-section">
      {/* Hero */}
      <section className="relative h-[42vh] min-h-[320px] w-full overflow-hidden">
        <Image
          src={post.image}
          alt={post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-6 pb-10">
            <Link
              href="/blogs"
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-sky-200 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all articles
            </Link>
            <span className="mb-3 inline-block rounded-full bg-sky-500/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {post.category}
            </span>
            <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white md:text-4xl">
              {post.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="container mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-slate-200 pb-6 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2">
            <User className="h-4 w-4 text-sky-600" aria-hidden="true" />
            {post.author}
          </span>
          <span className="inline-flex items-center gap-2">
            <Calendar className="h-4 w-4 text-sky-600" aria-hidden="true" />
            {formatDate(post.date)}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-sky-600" aria-hidden="true" />
            {post.readTime}
          </span>
        </div>

        <p className="mb-6 text-lg font-medium leading-relaxed text-slate-700">{post.excerpt}</p>

        {paragraphs.length > 0 ? (
          <div className="space-y-5 text-base leading-relaxed text-slate-700">
            {paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-sky-100 bg-sky-50/70 p-6 text-slate-600">
            <p className="mb-3">
              The full version of this article is on its way. In the meantime, our team is happy to
              answer any questions about {post.category.toLowerCase()} and diving in the Andamans.
            </p>
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 font-semibold text-sky-700 hover:text-sky-900"
            >
              Get in touch
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        )}
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="border-t border-slate-200 bg-white/60">
          <div className="container mx-auto max-w-5xl px-6 py-12">
            <h2 className="mb-6 text-xl font-bold text-slate-800">More on {post.category}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blogs/${rel.id}`}
                  className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
                >
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={rel.image}
                      alt={rel.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-2 font-semibold text-slate-800 group-hover:text-sky-700">
                      {rel.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">{rel.readTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
