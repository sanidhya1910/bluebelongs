'use client';

import type { ReactNode } from 'react';

interface InfoCardProps {
  title: string;
  children: ReactNode;
  align?: 'left' | 'center';
}

export default function InfoCard({ title, children, align = 'center' }: InfoCardProps) {
  return (
    <div className={`card ${align === 'center' ? 'text-center' : ''}`}>
      <h3 className="font-semibold text-slate-800 mb-2">{title}</h3>
      <div className="text-sm text-slate-600">{children}</div>
    </div>
  );
}
