
'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { topSites } from '@/lib/top-sites';
import { cn } from '@/lib/utils';

const suggestions = topSites.map(site => site.name).slice(0, 15);

export function ScrollingSuggestions({ isVisible, onSuggestionChange }: { isVisible: boolean, onSuggestionChange: (index: number) => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % suggestions.length);
    }, 3000); // Wait for 3 seconds before showing the next suggestion

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    onSuggestionChange(index);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);


  return (
    <div
      className={cn(
        'absolute inset-0 flex items-center z-0 pointer-events-none transition-opacity duration-300 overflow-hidden',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="absolute left-4 text-muted-foreground/50 text-base font-medium whitespace-nowrap"
        >
          {suggestions[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
