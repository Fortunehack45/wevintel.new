
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, LogIn } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isWelcomePage = pathname === '/';
  const isAppPage = ['/dashboard', '/compare', '/leaderboard', '/history', '/settings'].some(route => pathname.startsWith(route));

  if (!mounted) {
    return <header className="p-4 flex justify-between items-center border-b h-[60px]" />;
  }

  if (isMobile && isAppPage) {
    return null; // The sidebar is present on mobile for app pages, no header needed.
  }
  
  return (
    <header className={cn("p-4 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-lg z-40 h-[60px]")}>
      <Link href="/" className="flex items-center gap-2 font-bold text-lg">
        <Compass className="h-6 w-6 text-primary" />
        <span className="text-foreground">WebIntel</span>
      </Link>
      
      <div className="flex items-center gap-2">
        {isWelcomePage && (
          <Button asChild>
            <Link href="/dashboard">
              Get Started
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}
