
'use client';
import { CompareForm } from '@/components/compare/compare-form';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';

export default function ComparePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground flex items-center justify-center gap-4">
            <Scale className="h-12 w-12 text-primary" /> Website Comparison
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Analyze two websites side-by-side to compare their performance, technology, and security.
          </p>
        </motion.div>
        <CompareForm />
        <p className="mt-4 text-sm text-muted-foreground">
          Enter two URLs to see who comes out on top.
        </p>
      </div>
    </div>
  );
}
