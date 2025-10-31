
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, Menu, Bot, Moon, Sun, Scale, Settings, LogIn, User as UserIcon, LogOut, Laptop } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { getAuth, onAuthStateChanged, type User, signOut } from 'firebase/auth';
import { useAuthContext } from '@/firebase/provider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/compare', label: 'Compare' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/history', label: 'History' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
];


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

  const isWelcomePage = pathname === '/';

  if (!mounted) {
    return <header className="p-4 flex justify-between items-center border-b h-[69px]" />;
  }

  // Mobile header is handled by bottom nav, so this is mainly for desktop and the welcome page.
  if (isMobile && !isWelcomePage) {
    return null;
  }
  
  return (
    <header className={cn("p-4 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-lg z-50", !isWelcomePage && "md:hidden")}>
      <Link href="/" className="flex items-center gap-2 font-bold text-lg">
        <Compass className="h-6 w-6 text-primary" />
        <span className="text-foreground">WebIntel</span>
      </Link>
      
      <div className="flex items-center gap-2">
        <Button variant={isWelcomePage ? "outline" : "default"} asChild>
            <Link href="/dashboard">Dashboard</Link>
        </Button>
        {!user &&
            <Button asChild>
                <Link href="/login">
                    <LogIn className="mr-2 h-4 w-4" />
                    Login
                </Link>
            </Button>
        }
      </div>
    </header>
  );
}
