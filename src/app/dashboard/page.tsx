
'use client';

import { UrlForm } from '@/components/url-form';
import { HistoryClient } from '@/components/history-client';
import { motion } from 'framer-motion';
import { useAuth, useAuthContext } from '@/firebase/provider';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { LoadingOverlay } from '@/components/loading-overlay';

export default function DashboardPage() {
  const auth = useAuthContext();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (auth) {
      const unsubscribe = useAuth((user) => {
        if (user) {
          setUser(user);
          setIsLoading(false);
        } else {
          router.push('/login');
        }
      });
      return () => unsubscribe();
    } else {
        // If auth isn't ready, maybe it's still loading, but if it's null, we should redirect.
        // A brief delay to see if auth context loads.
        const timer = setTimeout(() => {
            if (!auth) {
                router.push('/login');
            }
        }, 500);
        return () => clearTimeout(timer);
    }
  }, [auth, router]);

  if (isLoading || !user) {
    return <LoadingOverlay isVisible={true} />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center text-center pb-24 md:pb-8">
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
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

      <div className="w-full max-w-5xl mt-24">
        <h2 className="text-3xl font-bold mb-6 text-left">Recent Analyses</h2>
        <HistoryClient limit={6} />
      </div>
    </div>
  );
}
