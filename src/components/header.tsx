
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, LogIn, User, Settings, LogOut, ChevronDown, History, Scale, Trophy, Contact, Info, Home } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth, useAuthContext } from '@/firebase/provider';
import { signOut, type User as FirebaseUser } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { motion } from 'framer-motion';


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
  const { toast } = useToast();
  const router = useRouter();

  const auth = useAuthContext();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    setMounted(true);
    if (auth) {
      const unsubscribe = useAuth(setUser);
      return () => unsubscribe();
    }
  }, [auth]);

  const handleLogout = async () => {
    if (!auth) return;
    try {
        await signOut(auth);
        toast({ title: "Logged Out", description: "You have been successfully logged out." });
        router.push('/login');
    } catch (error: any) {
        toast({ title: "Logout Failed", description: error.message, variant: "destructive" });
    }
  }
  
  if (!mounted) {
    return <header className="p-4 flex justify-between items-center border-b h-16" />;
  }
  
  const desktopNavLinks = user 
    ? navLinks 
    : navLinks.filter(link => ['/dashboard', '/about', '/contact'].includes(link.href));
  
  // Mobile Header
  if(isMobile) {
      return (
        <header className={cn(
            "p-4 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-lg z-40 h-16",
        )}>
          <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 font-bold text-lg">
              <Compass className="h-7 w-7 text-primary" />
              <span className="text-foreground text-xl">WebIntel</span>
          </Link>
          
          {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-0 h-10 w-10 rounded-full">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                            <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            ) : (
              <Button asChild>
                <Link href="/login">
                  <LogIn className='mr-2' /> Login
                </Link>
              </Button>
            )}
        </header>
      )
  }

  // Desktop Header
  return (
    <header className={cn(
        "px-6 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-lg z-40 h-16",
    )}>
      {/* Left Section */}
      <div className="flex items-center gap-6">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 font-bold text-lg">
          <Compass className="h-7 w-7 text-primary" />
          <span className="text-foreground text-xl">WebIntel</span>
        </Link>
      </div>

      {/* Center Section - Main Navigation */}
      <nav className="absolute left-1/2 -translate-x-1/2">
         <ul className="flex items-center gap-2 rounded-full border bg-card/50 p-1">
            {desktopNavLinks.map(link => (
                <li key={link.href}>
                    <Link href={link.href} className={cn(
                        "relative text-sm font-medium transition-colors text-muted-foreground hover:text-primary px-4 py-2 rounded-full",
                         pathname.startsWith(link.href) && "text-primary"
                    )}>
                        {link.label}
                        {pathname.startsWith(link.href) && (
                            <motion.div
                                layoutId="desktop-active-nav"
                                className="absolute inset-0 bg-primary/10 rounded-full mix-blend-lighten dark:mix-blend-plus-lighter"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </Link>
                </li>
            ))}
         </ul>
      </nav>
      
      {/* Right Section */}
      <div className="flex items-center gap-4">
        {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-1 h-auto rounded-full">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                        <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings"><Settings className="mr-2 h-4 w-4" />Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        ) : (
            <Button asChild>
              <Link href="/login">
                Get Started
              </Link>
            </Button>
        )}
      </div>
    </header>
  );
}
