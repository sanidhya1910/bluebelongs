'use client';

import { motion } from 'framer-motion';
import type { PropsWithChildren, ReactNode } from 'react';

interface SectionProps extends PropsWithChildren {
  title?: string;
  subtitle?: string;
  headerRight?: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function Section({ title, subtitle, headerRight, className = '', containerClassName = '', children }: SectionProps) {
  return (
    <section className={`py-12 ${className}`}>
      <div className={`container mx-auto px-4 ${containerClassName}`}>
        {(title || subtitle || headerRight) && (
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              {title && (
                <motion.h2
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="text-3xl md:text-4xl font-bold text-slate-800 underwater-text"
                >
                  {title}
                </motion.h2>)
              }
              {subtitle && (
                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.05 }}
                  className="text-slate-600 mt-2"
                >
                  {subtitle}
                </motion.p>)
              }
            </div>
            {headerRight}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}

export default Section;
