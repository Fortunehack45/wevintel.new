'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Mountain, Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';

export function Header() {
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <header className="p-4 flex justify-between items-center border-b border-border/40 h-[69px]" />;
  }

  return (
    <header className="p-4 flex justify-between items-center border-b border-border/40">
      <Link href="/" className="flex items-center gap-2 font-bold text-lg">
        <Mountain className="h-6 w-6 text-primary" />
        <span>Web Insights</span>
      </Link>

      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
            <div className='p-4'>
              <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-8">
                <Mountain className="h-6 w-6 text-primary" />
                <span>Web Insights</span>
              </Link>
              <nav className="flex flex-col gap-4">
                <Button variant="ghost" asChild className="justify-start">
                  <Link href="/tracker">Tracker Generator</Link>
                </Button>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <nav className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/tracker">Tracker Generator</Link>
          </Button>
        </nav>
      )}
    </header>
  );
}
