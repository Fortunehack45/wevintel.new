
'use client';
import { motion } from 'framer-motion';
import { topSites } from '@/lib/top-sites';
import { cn } from '@/lib/utils';

const suggestions = topSites.map(site => site.name).slice(0, 15);

export function ScrollingSuggestions({ isVisible }: { isVisible: boolean }) {
  const marqueeVariants = {
    animate: {
      x: [0, -1035],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: 'loop',
          duration: 30,
          ease: 'linear',
        },
      },
    },
  };

  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center z-0 pointer-events-none transition-opacity duration-300',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <motion.div
        className="flex"
        variants={marqueeVariants}
        animate="animate"
      >
        {[...suggestions, ...suggestions].map((name, index) => (
          <span
            key={index}
            className="text-muted-foreground/50 text-base font-medium whitespace-nowrap px-4"
          >
            {name}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
