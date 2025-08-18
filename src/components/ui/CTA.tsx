'use client';
import type { ReactNode } from 'react';

interface CTAProps {
  title: string;
  description: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

export default function CTA({ title, description, primary, secondary, iconLeft, iconRight }: CTAProps) {
  return (
    <div className="card bg-gradient-to-r from-sky-50 to-cyan-50 border-sky-200 text-center">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">{title}</h2>
      <p className="text-slate-600 mb-6">{description}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a href={primary.href} className="btn-primary">
          {iconLeft}
          {primary.label}
        </a>
        {secondary && (
          <a href={secondary.href} className="btn-secondary">
            {iconRight}
            {secondary.label}
          </a>
        )}
      </div>
    </div>
  );
}
