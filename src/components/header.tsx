
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, LogIn, User, Settings, LogOut, ChevronDown, History, Scale, Trophy, Contact, Info, Home } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
<<<<<<< HEAD
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

=======
import { useTheme } from 'next-themes';
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { useAuthContext } from '@/firebase/provider';
>>>>>>> 768a281 (When the stuff is loading in the mobile view is showing the footer which)

const navLinks = [
<<<<<<< HEAD
  { href: '/dashboard', authHref: '/dashboard', publicHref: '/', label: 'Dashboard' },
  { href: '/compare', label: 'Compare' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/history', label: 'History' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
=======
    { href: '/', label: 'Home' },
    { href: '/compare', label: 'Compare' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/history', label: 'History' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
>>>>>>> 512e4b0 (Please creat a contact page with like a features that allow users to inp)
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

<<<<<<< HEAD
<<<<<<< HEAD
  const handleLogout = async () => {
    if (!auth) return;
    try {
        await signOut(auth);
        toast({ title: "Logged Out", description: "You have been successfully logged out." });
        router.push('/');
    } catch (error: any) {
        toast({ title: "Logout Failed", description: error.message, variant: "destructive" });
    }
  }
  
  if (!mounted) {
    return <header className="p-4 flex justify-between items-center border-b h-16" />;
  }
  
  const desktopNavLinks = user 
    ? navLinks 
    : navLinks.filter(link => ['/dashboard', '/leaderboard', '/about', '/contact'].includes(link.href));
  
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
=======
  if (!mounted || isMobile) {
=======
  if (!mounted) {
>>>>>>> b26aced (Let the mobile mode have a header not like the header of desktop view bu)
    return <header className="p-4 flex justify-between items-center border-b h-[69px]" />;
>>>>>>> 512e4b0 (Please creat a contact page with like a features that allow users to inp)
  }

<<<<<<< HEAD
  // Desktop Header
=======
  if (isMobile) {
      return (
        <header className="p-4 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-lg z-50">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                <Compass className="h-6 w-6 text-primary" />
                <span className="text-foreground">WebIntel</span>
            </Link>
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


>>>>>>> b26aced (Let the mobile mode have a header not like the header of desktop view bu)
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

<<<<<<< HEAD
      {/* Center Section - Main Navigation */}
      <nav className="absolute left-1/2 -translate-x-1/2">
         <ul className="flex items-center gap-2 rounded-full border bg-card/50 p-1">
            {desktopNavLinks.map(link => {
                const href = user ? (link.authHref || link.href) : (link.publicHref || link.href);
                const isActive = pathname.startsWith(link.href) || (link.href === '/dashboard' && pathname === '/');
                return (
                    <li key={link.href}>
                        <Link href={href} className={cn(
                            "relative text-sm font-medium transition-colors text-muted-foreground hover:text-primary px-4 py-2 rounded-full",
                             isActive && "text-primary"
                        )}>
                            {link.label}
                            {isActive && (
                                <motion.div
                                    layoutId="desktop-active-nav"
                                    className="absolute inset-0 bg-primary/10 rounded-full mix-blend-lighten dark:mix-blend-plus-lighter"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    </li>
                )
            })}
         </ul>
      </nav>
      
      {/* Right Section */}
      <div className="flex items-center gap-4">
=======
      <div className="flex items-center gap-2">
        <NavContent />
<<<<<<< HEAD
        <ThemeToggle />
>>>>>>> 768a281 (When the stuff is loading in the mobile view is showing the footer which)
=======
>>>>>>> dd02c12 (The theam toggle should be in the settings page not in the header please)
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
