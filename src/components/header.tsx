
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { Compass, LogIn, User, Settings, LogOut, ChevronDown, History, Scale, Trophy, Contact, Info, Home } from 'lucide-react';
=======
import { Compass, Menu, Bot, Moon, Sun, Scale, Settings, LogIn, User as UserIcon, LogOut, Laptop } from 'lucide-react';
>>>>>>> 804648f (Okay wait it should be in the header but in a professional way and posit)
=======
import { Compass, LogIn } from 'lucide-react';
>>>>>>> b4e6b96 (The dashboard page should not show a button navigation bar on the mobile)
=======
import { Compass, LogIn, User, Settings, LogOut, ChevronDown, Home, Scale, Trophy, History as HistoryIcon } from 'lucide-react';
>>>>>>> 2cc806b (Also introduced the header for the mobile view back)
=======
import { Compass, LogIn, User, Settings, LogOut, ChevronDown, Home, Scale, Trophy, History as HistoryIcon, Info, Send } from 'lucide-react';
>>>>>>> 822423a (For desktop view remove the contact button and about button for the sett)
=======
import { Compass, LogIn, User, Settings, LogOut, ChevronDown, Info, Send } from 'lucide-react';
>>>>>>> 546cc0d (The header(desktop view only) is not professional enough the wey it look)
=======
import { Compass, LogIn, User, Settings, LogOut, ChevronDown, Home, Scale, Trophy, History } from 'lucide-react';
>>>>>>> 68b907f (Let the about and contact be in that centered navigation of the the desk)
=======
import { Compass, LogIn, User, Settings, LogOut, ChevronDown, History, Scale, Trophy, Contact, Info } from 'lucide-react';
>>>>>>> 0d734c4 (For desktop view user's that are not logged in should only see "Dashboar)
=======
import { Compass, LogIn, User, Settings, LogOut, ChevronDown, History, Scale, Trophy, Contact, Info, Home } from 'lucide-react';
>>>>>>> 6508b3f (The about and contact for users that are not logged in should be in the)
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { useAuth, useAuthContext } from '@/firebase/provider';
=======
=======
import { useAuth } from '@/firebase/auth';
>>>>>>> 68b907f (Let the about and contact be in that centered navigation of the the desk)
=======
>>>>>>> 0d734c4 (For desktop view user's that are not logged in should only see "Dashboar)
import { useAuthContext } from '@/firebase/provider';
import { useAuth } from '@/firebase/auth';
>>>>>>> 2cc806b (Also introduced the header for the mobile view back)
=======
import { useAuth } from '@/firebase/auth';
=======
>>>>>>> 546cc0d (The header(desktop view only) is not professional enough the wey it look)
import { useAuthContext } from '@/firebase/provider';
>>>>>>> 822423a (For desktop view remove the contact button and about button for the sett)
=======
import { useAuth, useAuthContext } from '@/firebase/provider';
>>>>>>> e996306 (This should take users that are logged in to home page and take users th)
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
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
import { motion } from 'framer-motion';
<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
import { useAuth } from '@/firebase/auth';
=======
>>>>>>> 68b907f (Let the about and contact be in that centered navigation of the the desk)
import { motion } from 'framer-motion';
>>>>>>> 546cc0d (The header(desktop view only) is not professional enough the wey it look)
=======
import { useAuth } from '@/firebase/auth';
>>>>>>> 0d734c4 (For desktop view user's that are not logged in should only see "Dashboar)
=======
>>>>>>> e996306 (This should take users that are logged in to home page and take users th)


const navLinks = [
  { href: '/dashboard', authHref: '/dashboard', publicHref: '/', label: 'Dashboard' },
  { href: '/compare', label: 'Compare' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/history', label: 'History' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 2cc806b (Also introduced the header for the mobile view back)
=======
const secondaryNavLinks = [
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
]

>>>>>>> 822423a (For desktop view remove the contact button and about button for the sett)
=======
const mobileNavLinks = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/compare', label: 'Compare', icon: Scale },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/history', label: 'History', icon: History },
  { href: '/settings', label: 'Settings', icon: Settings },
];
>>>>>>> 68b907f (Let the about and contact be in that centered navigation of the the desk)

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
=======
>>>>>>> b4e6b96 (The dashboard page should not show a button navigation bar on the mobile)

>>>>>>> 804648f (Okay wait it should be in the header but in a professional way and posit)
=======
>>>>>>> 0d734c4 (For desktop view user's that are not logged in should only see "Dashboar)
export function Header() {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
  
  useEffect(() => {
>>>>>>> b4e6b96 (The dashboard page should not show a button navigation bar on the mobile)
=======
  const { toast } = useToast();
  const router = useRouter();

  const auth = useAuthContext();
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
>>>>>>> 2cc806b (Also introduced the header for the mobile view back)
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
<<<<<<< HEAD
>>>>>>> 05fe2ff (For the welcome page on the desktop view it should only one page Dashboa)

  if (!mounted) {
    return <header className="p-4 flex justify-between items-center border-b h-[69px]" />;
>>>>>>> 804648f (Okay wait it should be in the header but in a professional way and posit)
=======
  const isAppPage = ['/dashboard', '/compare', '/leaderboard', '/history', '/settings'].some(route => pathname.startsWith(route));
=======
>>>>>>> 2cc806b (Also introduced the header for the mobile view back)

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
<<<<<<< HEAD
    return <header className="p-4 flex justify-between items-center border-b h-[60px]" />;
>>>>>>> b4e6b96 (The dashboard page should not show a button navigation bar on the mobile)
=======
    return <header className="p-4 flex justify-between items-center border-b h-16" />;
>>>>>>> 546cc0d (The header(desktop view only) is not professional enough the wey it look)
  }
  
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
=======
  const displayedNavLinks = user ? navLinks : navLinks.filter(link => link.href === '/dashboard' || link.href === '/about' || link.href === '/contact');
  const desktopNavLinks = user ? navLinks : navLinks.filter(link => link.href === '/dashboard');
=======
  const desktopNavLinks = user ? navLinks : navLinks.filter(link => link.href === '/dashboard' || link.href === '/about' || link.href === '/contact');
>>>>>>> 6508b3f (The about and contact for users that are not logged in should be in the)
=======
  const desktopNavLinks = user 
    ? navLinks 
    : navLinks.filter(link => ['/dashboard', '/about', '/contact'].includes(link.href));
>>>>>>> e996306 (This should take users that are logged in to home page and take users th)
  
>>>>>>> 0d734c4 (For desktop view user's that are not logged in should only see "Dashboar)
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
>>>>>>> 546cc0d (The header(desktop view only) is not professional enough the wey it look)
  return (
<<<<<<< HEAD
    <header className={cn(
        "px-6 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-lg z-40 h-16",
    )}>
      {/* Left Section */}
      <div className="flex items-center gap-6">
        <Link href={user ? "/dashboard" : "/"} className="flex items-center gap-2 font-bold text-lg">
<<<<<<< HEAD
          <Compass className="h-7 w-7 text-primary" />
          <span className="text-foreground text-xl">WebIntel</span>
        </Link>
      </div>
=======
    <header className="p-4 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-lg z-50">
      <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
=======
  return (
<<<<<<< HEAD
    <header className={cn("p-4 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-lg z-40 h-[60px]")}>
<<<<<<< HEAD
      <Link href="/" className="flex items-center gap-2 font-bold text-lg">
>>>>>>> 05fe2ff (For the welcome page on the desktop view it should only one page Dashboa)
        <Compass className="h-6 w-6 text-primary" />
        <span className="text-foreground">WebIntel</span>
      </Link>
=======
=======
    <header className={cn(
        "px-6 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-lg z-40 h-16",
    )}>
<<<<<<< HEAD
>>>>>>> 822423a (For desktop view remove the contact button and about button for the sett)
=======
      {/* Left Section */}
>>>>>>> 546cc0d (The header(desktop view only) is not professional enough the wey it look)
      <div className="flex items-center gap-6">
        <Link href={isWelcomePage ? "/" : "/dashboard"} className="flex items-center gap-2 font-bold text-lg">
=======
>>>>>>> e996306 (This should take users that are logged in to home page and take users th)
          <Compass className="h-7 w-7 text-primary" />
          <span className="text-foreground text-xl">WebIntel</span>
        </Link>
      </div>

      {/* Center Section - Main Navigation */}
<<<<<<< HEAD
      {!isWelcomePage && (
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
        )}
<<<<<<< HEAD
      </div>
>>>>>>> 2cc806b (Also introduced the header for the mobile view back)
      
<<<<<<< HEAD
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
=======
      <nav className="absolute left-1/2 -translate-x-1/2">
         <ul className="flex items-center gap-2 rounded-full border bg-card/50 p-1">
<<<<<<< HEAD
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
>>>>>>> e996306 (This should take users that are logged in to home page and take users th)
=======
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
>>>>>>> bbeec19 (he "Dashboard" in the centered navigation too should lead to the welcome)
         </ul>
      </nav>
      
      {/* Right Section */}
      <div className="flex items-center gap-4">
<<<<<<< HEAD
=======
      <div className="flex items-center gap-2">
<<<<<<< HEAD
<<<<<<< HEAD
        <NavContent />
<<<<<<< HEAD
        <ThemeToggle />
>>>>>>> 768a281 (When the stuff is loading in the mobile view is showing the footer which)
=======
>>>>>>> dd02c12 (The theam toggle should be in the settings page not in the header please)
=======
>>>>>>> e996306 (This should take users that are logged in to home page and take users th)
        {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-1 h-auto rounded-full">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                        <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
<<<<<<< HEAD
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
=======
=======
=======
      
      {/* Right Section */}
>>>>>>> 546cc0d (The header(desktop view only) is not professional enough the wey it look)
      <div className="flex items-center gap-4">
        {isWelcomePage ? (
            <Button asChild>
                <Link href="/dashboard">Enter Dashboard</Link>
            </Button>
        ) : (
<<<<<<< HEAD
             <div className='flex items-center gap-4'>
                {secondaryNavLinks.map(link => (
                     <Link key={link.href} href={link.href} className={cn(
                        "text-sm font-medium transition-colors hover:text-primary",
                        pathname.startsWith(link.href) ? "text-primary" : "text-muted-foreground"
                    )}>
                        {link.label}
                    </Link>
                ))}
            </div>
        )}
        
>>>>>>> 822423a (For desktop view remove the contact button and about button for the sett)
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
<<<<<<< HEAD
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
>>>>>>> 2cc806b (Also introduced the header for the mobile view back)
=======
                <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
>>>>>>> 546cc0d (The header(desktop view only) is not professional enough the wey it look)
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
<<<<<<< HEAD
<<<<<<< HEAD
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
<<<<<<< HEAD
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
=======
        {isWelcomePage && (
=======
>>>>>>> 2cc806b (Also introduced the header for the mobile view back)
          <Button asChild>
=======
          <Button asChild variant="secondary" className={isWelcomePage ? 'hidden' : ''}>
>>>>>>> 546cc0d (The header(desktop view only) is not professional enough the wey it look)
            <Link href="/login">
              Login
            </Link>
          </Button>
=======
            user ? (
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
            )
>>>>>>> 68b907f (Let the about and contact be in that centered navigation of the the desk)
=======
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
>>>>>>> e996306 (This should take users that are logged in to home page and take users th)
        )}
>>>>>>> b4e6b96 (The dashboard page should not show a button navigation bar on the mobile)
      </div>
    </header>
  );
}
