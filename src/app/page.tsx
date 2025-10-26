'use client';

import { UrlForm } from '@/components/url-form';
import { HistoryClient } from '@/components/history-client';
import { motion } from 'framer-motion';


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[calc(100vh-200px)] -mt-16">
      <div className="max-w-3xl w-full">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight gradient-text">
            WebIntel
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Know everything about any website. Instantly uncover the secrets of any URL.
          </p>
        </motion.div>
        <UrlForm />
        <p className="mt-4 text-sm text-muted-foreground">
          Get insights on performance, security, SEO, and more.
        </p>
      </div>

      <div className="w-full max-w-5xl mt-20">
          <h2 className="text-2xl font-bold mb-4">Recent Analyses</h2>
          <HistoryClient />
      </div>

    </div>
  );
}
