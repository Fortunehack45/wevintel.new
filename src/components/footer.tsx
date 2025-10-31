
'use client';

import Link from 'next/link';
import { Compass } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthContext } from '@/firebase/provider';
import { useAuth } from '@/firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
=======
>>>>>>> 4e7a013 (Remove the love emoji. Also don't let the footer show in the mobile mode)

export function Footer() {
  const currentYear = new Date().getFullYear();
  const isMobile = useIsMobile();
<<<<<<< HEAD
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const auth = useAuthContext();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    setMounted(true);
    if (auth) {
      const unsubscribe = useAuth(setUser);
      return () => unsubscribe();
    }
  }, [auth]);


  // Do not render footer on auth pages on desktop
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  if (!mounted || isMobile || isAuthPage) {
=======

  if (isMobile) {
>>>>>>> 4e7a013 (Remove the love emoji. Also don't let the footer show in the mobile mode)
    return null;
  }
  
  return (
    <footer className="border-t bg-background/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl">
                <Compass className="h-7 w-7 text-primary" />
                <span className="text-foreground">WebIntel</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm">
              Instantly uncover the secrets of any website. Get in-depth intelligence on performance, security, technology, and more.
            </p>
          </div>

          {/* Navigation Column */}
          {user && (
            <div>
              <h4 className="font-semibold text-foreground mb-4">Navigate</h4>
              <ul className="space-y-3 text-sm">
                <li><Link href="/compare" className="text-muted-foreground hover:text-primary transition-colors">Compare</Link></li>
                <li><Link href="/leaderboard" className="text-muted-foreground hover:text-primary transition-colors">Leaderboard</Link></li>
                <li><Link href="/history" className="text-muted-foreground hover:text-primary transition-colors">History</Link></li>
              </ul>
            </div>
          )}

          {/* Legal Column */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} WebIntel. All Rights Reserved.</p>
          <p className="mt-1">
            Developed by <a href="https://wa.me/2349167689200" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">
              Fortune
            </a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
