'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Fish, Award, Anchor, ChevronDown } from 'lucide-react';
import type { Course, CourseCategory as TCourseCategory } from '@/data/courses';
import CourseCard from '@/components/courses/CourseCard';

function IconById({ id }: { id: 'fish' | 'award' | 'anchor' }) {
  const map = {
    fish: Fish,
    award: Award,
    anchor: Anchor,
  } as const;
  const Cmp = map[id];
  return <Cmp className="h-8 w-8" />;
}

interface Props {
  category: TCourseCategory;
  courses: Course[];
  expanded: boolean;
  onToggle: (id: string) => void;
  onBook: (course: Course) => void;
  isHydrated: boolean;
  userPresent: boolean;
}

export default function CourseCategory({ category, courses, expanded, onToggle, onBook, isHydrated, userPresent }: Props) {
  return (
    <motion.div
      className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        className={`bg-gradient-to-r ${category.color} p-6 cursor-pointer`}
        onClick={() => onToggle(category.id)}
        whileHover={{ scale: 1.01 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <div className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
              <IconById id={category.iconId} />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold">{category.name}</h2>
              <p className="text-white/90">{category.description}</p>
            </div>
          </div>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <ChevronDown className="h-6 w-6" />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onBook={onBook}
                  isHydrated={isHydrated}
                  userPresent={userPresent}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
