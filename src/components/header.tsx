
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, Menu, Bot, Moon, Sun, Scale, Settings, LogIn } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { app } from '@/firebase/config';
import { useAuthContext } from '@/firebase/provider';

const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/compare', label: 'Compare' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/history', label: 'History' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
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
  const auth = useAuthContext();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);


  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <header className="p-4 flex justify-between items-center border-b h-[69px]" />;
  }

  if (isMobile) {
      return (
        <header className="p-4 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-lg z-50">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                <Compass className="h-6 w-6 text-primary" />
                <span className="text-foreground">WebIntel</span>
            </Link>
            <ThemeToggle />
        </header>
      )
  }

  const NavContent = () => (
    <nav className="hidden md:flex items-center gap-2">
        {navLinks.map(link => (
            <Button
                key={link.href}
                variant={pathname.startsWith(link.href) && (link.href !== '/' || pathname === '/') ? "secondary" : "ghost"}
                asChild
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
        {user ? (
            <Button asChild variant="outline">
                <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                </Link>
            </Button>
        ) : (
             <Button asChild>
                <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                </Link>
            </Button>
        )}
      </div>
    </header>
  );
}
