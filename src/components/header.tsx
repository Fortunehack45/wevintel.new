
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, Menu, Bot, Moon, Sun } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/history', label: 'History' },
    { href: '/about', label: 'About' },
];

function ThemeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

export function Header() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <header className="p-4 flex justify-between items-center border-b h-[69px]" />;
  }

  const NavContent = () => (
    <nav className="hidden md:flex items-center gap-2">
        {navLinks.map(link => (
            <Button
                key={link.href}
                variant={pathname === link.href ? "secondary" : "ghost"}
                asChild
                onClick={() => {}}
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

      <div className="flex items-center gap-2">
        <NavContent />
        <ThemeToggle />
      </div>
    </header>
  );
}
