
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { Home, Scale, Trophy, History, Settings } from 'lucide-react';
=======
import { Home, Compass, Info, Send } from 'lucide-react';
>>>>>>> b4e6b96 (The dashboard page should not show a button navigation bar on the mobile)
=======
import { Home, Scale, Trophy, History } from 'lucide-react';
>>>>>>> 5813a0a (Use button navigation bar for mobile view please)
=======
import { Home, Scale, Trophy, History, Settings } from 'lucide-react';
>>>>>>> 2cc806b (Also introduced the header for the mobile view back)
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
<<<<<<< HEAD
<<<<<<< HEAD
import { useAuth, useAuthContext } from '@/firebase/provider';
import type { User } from 'firebase/auth';
=======
>>>>>>> 70f81c5 (Try fixing this error: `Runtime Error: Error: useState is not defined. E)
=======
import { useAuth, useAuthContext } from '@/firebase/provider';
import type { User } from 'firebase/auth';
>>>>>>> 16edf83 (When the login or sing up page is loading on the mobile view it's showin)

const navLinks = [
<<<<<<< HEAD
<<<<<<< HEAD
  { href: '/dashboard', label: 'Home', icon: Home },
=======
  { href: '/dashboard', label: 'Dashboard', icon: Home },
>>>>>>> 376e771 (No... The welcome page is the page before the home page)
  { href: '/compare', label: 'Compare', icon: Scale },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/history', label: 'History', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
<<<<<<< HEAD
=======
  { href: '/dashboard', label: 'Home', icon: Home },
<<<<<<< HEAD
  { href: '/about', label: 'About', icon: Info },
  { href: '/contact', label: 'Contact', icon: Send },
>>>>>>> b4e6b96 (The dashboard page should not show a button navigation bar on the mobile)
=======
  { href: '/compare', label: 'Compare', icon: Scale },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/history', label: 'History', icon: History },
>>>>>>> 5813a0a (Use button navigation bar for mobile view please)
=======
>>>>>>> 2cc806b (Also introduced the header for the mobile view back)
];

export function BottomNav() {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
<<<<<<< HEAD
<<<<<<< HEAD
  const auth = useAuthContext();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setMounted(true);
    if (auth) {
        const unsubscribe = useAuth(setUser);
        return () => unsubscribe();
    }
  }, [auth]);

  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const shouldShow = mounted && isMobile && user && !isAuthPage;
=======
=======
  const auth = useAuthContext();
  const [user, setUser] = useState<User | null>(null);
>>>>>>> 16edf83 (When the login or sing up page is loading on the mobile view it's showin)

  useEffect(() => {
    setMounted(true);
    if (auth) {
        const unsubscribe = useAuth(setUser);
        return () => unsubscribe();
    }
  }, [auth]);

<<<<<<< HEAD
  const shouldShow = mounted && isMobile && navLinks.some(link => pathname.startsWith(link.href) || pathname.startsWith('/analysis'));
>>>>>>> 5813a0a (Use button navigation bar for mobile view please)
=======
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  const shouldShow = mounted && isMobile && user && !isAuthPage;
>>>>>>> 16edf83 (When the login or sing up page is loading on the mobile view it's showin)


  if (!shouldShow) {
    return null;
  }

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-lg border-t md:hidden z-50"
    >
      <nav className="flex h-full items-center justify-around">
        {navLinks.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center justify-center w-full h-full transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label={link.label}
            >
              <link.icon className="h-6 w-6" />
            </Link>
          );
        })}
      </nav>
    </motion.div>
  );
}
