'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Compass, Menu, Bot } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/history', label: 'History' },
    { href: '/smart-tracker', label: 'Smart Tracker' },
    { href: '/about', label: 'About' },
];

export function Header() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isSheetOpen, setSheetOpen] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <header className="p-4 flex justify-between items-center border-b h-[69px]" />;
  }

  const NavContent = () => (
    <nav className={cn("flex items-center gap-2", isMobile && 'flex-col items-start gap-4')}>
        {navLinks.map(link => (
            <Button
                key={link.href}
                variant={pathname === link.href ? "secondary" : "ghost"}
                asChild
                className={cn(isMobile && "justify-start w-full")}
                onClick={() => setSheetOpen(false)}
            >
                <Link href={link.href}>{link.label}</Link>
            </Button>
        ))}
    </nav>
  );


  return (
    <header className="p-4 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-lg z-50">
      <Link href="/" className="flex items-center gap-2 font-bold text-lg">
        <Compass className="h-6 w-6 text-primary" />
        <span className="text-foreground">WebIntel</span>
      </Link>

      {isMobile ? (
        <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-background/90 w-[250px]">
            <div className='p-4'>
              <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-8" onClick={() => setSheetOpen(false)}>
                <Compass className="h-6 w-6 text-primary" />
                <span className="text-foreground">WebIntel</span>
              </Link>
              <NavContent />
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <NavContent />
      )}
    </header>
  );
}
