import type { PropsWithChildren } from 'react';

interface BadgeProps extends PropsWithChildren {
  tone?: 'sky' | 'blue' | 'indigo' | 'cyan';
  className?: string;
}

export default function Badge({ tone = 'sky', className = '', children }: BadgeProps) {
  const tones: Record<string, string> = {
    sky: 'bg-sky-100 text-sky-800',
    blue: 'bg-blue-100 text-blue-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    cyan: 'bg-cyan-100 text-cyan-800',
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${tones[tone]} ${className}`}>
      {children}
    </span>
  );
}
