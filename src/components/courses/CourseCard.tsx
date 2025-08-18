'use client';

import { Clock, Waves, Award, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Course } from '@/data/courses';
import Badge from '@/components/ui/Badge';
import type { CSSProperties } from 'react';

interface Props {
  course: Course;
  onBook: (course: Course) => void;
  isHydrated: boolean;
  userPresent: boolean;
}

export default function CourseCard({ course, onBook, isHydrated, userPresent }: Props) {
  const tone = course.level === 'Beginner' || course.level === 'Kids'
    ? 'sky'
    : course.level === 'Intermediate' || course.level === 'Open Water'
    ? 'blue'
    : course.level === 'Advanced'
    ? 'indigo'
    : 'cyan';

  return (
    <motion.div
      className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.02 }}
    >
      {course.image && (
        <div
          className="h-40 w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${course.image})` }}
          aria-label={`${course.title} cover image`}
        />
      )}
      <div className="p-6 flex flex-col gap-3">
  <Badge tone={tone as 'sky' | 'blue' | 'indigo' | 'cyan'} className="mb-2">{course.level}</Badge>
        <h3 className="text-xl font-bold text-slate-800 mb-2">{course.title}</h3>
        <p
          className="text-slate-600 text-sm"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as CSSProperties['WebkitBoxOrient'],
            overflow: 'hidden',
          }}
        >
          {course.description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-slate-600 px-6">
        <div className="flex items-center"><Clock className="h-4 w-4 mr-2 text-sky-500" />{course.duration}</div>
        <div className="flex items-center"><Waves className="h-4 w-4 mr-2 text-sky-500" />{course.dives} dives</div>
        <div className="flex items-center"><Award className="h-4 w-4 mr-2 text-sky-500" />{course.certification}</div>
        <div className="flex items-center"><MapPin className="h-4 w-4 mr-2 text-sky-500" />Andaman Waters</div>
      </div>

      <div className="flex items-center justify-between px-6 pb-6 mt-auto">
        <div className="min-h-8 flex items-center text-2xl font-bold text-sky-600">{course.price}</div>
        <motion.button
          onClick={() => onBook(course)}
          className="btn-primary text-sm px-4 py-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isHydrated && !userPresent ? 'Login to Book' : 'Book Now'}
        </motion.button>
      </div>
    </motion.div>
  );
}
