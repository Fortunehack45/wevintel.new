
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD
import { Compass, LogIn, User, Settings, LogOut, ChevronDown, History, Scale, Trophy, Contact, Info, Home } from 'lucide-react';
=======
import { Compass, Menu, Bot, Moon, Sun, Scale, Settings, LogIn, User as UserIcon, LogOut, Laptop } from 'lucide-react';
>>>>>>> 804648f (Okay wait it should be in the header but in a professional way and posit)
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
import { getAuth, onAuthStateChanged, type User, signOut } from 'firebase/auth';
import { useAuthContext } from '@/firebase/provider';
<<<<<<< HEAD
>>>>>>> 768a281 (When the stuff is loading in the mobile view is showing the footer which)
=======
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

>>>>>>> 804648f (Okay wait it should be in the header but in a professional way and posit)

const navLinks = [
<<<<<<< HEAD
<<<<<<< HEAD
  { href: '/dashboard', authHref: '/dashboard', publicHref: '/', label: 'Dashboard' },
  { href: '/compare', label: 'Compare' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/history', label: 'History' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
=======
    { href: '/', label: 'Home' },
=======
    { href: '/dashboard', label: 'Dashboard' },
>>>>>>> 376e771 (No... The welcome page is the page before the home page)
    { href: '/compare', label: 'Compare' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/history', label: 'History' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
>>>>>>> 512e4b0 (Please creat a contact page with like a features that allow users to inp)
];

<<<<<<< HEAD
=======

>>>>>>> 804648f (Okay wait it should be in the header but in a professional way and posit)
export function Header() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
<<<<<<< HEAD
  const { toast } = useToast();
  const router = useRouter();
=======
  const auth = useAuthContext();
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);
>>>>>>> 804648f (Okay wait it should be in the header but in a professional way and posit)

<<<<<<< HEAD
  const auth = useAuthContext();
  const [user, setUser] = useState<FirebaseUser | null>(null);

=======
>>>>>>> 05fe2ff (For the welcome page on the desktop view it should only one page Dashboa)
  useEffect(() => {
    setMounted(true);
    if (auth) {
      const unsubscribe = useAuth(setUser);
      return () => unsubscribe();
    }
  }, [auth]);

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 804648f (Okay wait it should be in the header but in a professional way and posit)
  const handleLogout = async () => {
    if (!auth) return;
    try {
        await signOut(auth);
        toast({ title: "Logged Out", description: "You have been successfully logged out." });
<<<<<<< HEAD
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
=======
        router.push('/login');
    } catch (error: any) {
        toast({ title: "Logout Failed", description: error.message, variant: "destructive" });
    }
  }
=======
  const isWelcomePage = pathname === '/';
>>>>>>> 05fe2ff (For the welcome page on the desktop view it should only one page Dashboa)

  if (!mounted) {
    return <header className="p-4 flex justify-between items-center border-b h-[69px]" />;
>>>>>>> 804648f (Okay wait it should be in the header but in a professional way and posit)
  }

  // Mobile header is handled by bottom nav, so this is mainly for desktop and the welcome page.
  if (isMobile && !isWelcomePage) {
    return null;
  }
  
<<<<<<< HEAD
  const UserMenu = () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <UserIcon className="h-5 w-5" />
            <span className="sr-only">Open user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user ? user.email : 'Guest'}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span>Theme</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme('light')}><Sun className="mr-2"/>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}><Moon className="mr-2"/>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('system')}><Laptop className="mr-2"/>System</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          {user && (
            <>
                <DropdownMenuItem asChild>
                    <Link href="/settings"><Settings className="mr-2"/>Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2" />
                    Sign Out
                </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
  )


>>>>>>> b26aced (Let the mobile mode have a header not like the header of desktop view bu)
  return (
<<<<<<< HEAD
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
=======
    <header className="p-4 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-lg z-50">
      <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
=======
  return (
    <header className={cn("p-4 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-lg z-50", !isWelcomePage && "md:hidden")}>
      <Link href="/" className="flex items-center gap-2 font-bold text-lg">
>>>>>>> 05fe2ff (For the welcome page on the desktop view it should only one page Dashboa)
        <Compass className="h-6 w-6 text-primary" />
        <span className="text-foreground">WebIntel</span>
      </Link>
      
<<<<<<< HEAD
      {!isMobile && <NavContent />}
>>>>>>> 804648f (Okay wait it should be in the header but in a professional way and posit)

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
<<<<<<< HEAD
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
=======
        {user ? (
            <UserMenu />
        ) : (
            <>
                <div className="hidden md:flex items-center">
                    <UserMenu />
                </div>
                <Button asChild>
                    <Link href="/login">
                        <LogIn className="mr-2 h-4 w-4" />
                        Login
                    </Link>
                </Button>
            </>
>>>>>>> 804648f (Okay wait it should be in the header but in a professional way and posit)
        )}
=======
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
>>>>>>> 05fe2ff (For the welcome page on the desktop view it should only one page Dashboa)
      </div>
    </header>
  );
}
