
'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Compass, LogIn, User, Settings, LogOut, ChevronDown, Home, Scale, Trophy, History as HistoryIcon, Info, Send } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/firebase/auth';
import { useAuthContext } from '@/firebase/provider';
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


const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/compare', label: 'Compare' },
  { href: '/leaderboard', label: 'Leaderboard' },
  { href: '/history', label: 'History' },
];

const secondaryNavLinks = [
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: Send },
]


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
    return <header className="p-4 flex justify-between items-center border-b h-[60px]" />;
  }

  const isWelcomePage = pathname === '/';
  
  return (
    <header className={cn(
        "p-4 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-lg z-40 h-16",
        isWelcomePage && !isMobile && "px-8 py-5"
    )}>
      <div className="flex items-center gap-6">
        <Link href={isWelcomePage ? "/" : "/dashboard"} className="flex items-center gap-2 font-bold text-lg">
          <Compass className="h-7 w-7 text-primary" />
          <span className="text-foreground text-xl">WebIntel</span>
        </Link>
        {!isMobile && !isWelcomePage && (
          <nav className="flex items-center gap-5">
             {navLinks.map(link => (
                <Link key={link.href} href={link.href} className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname.startsWith(link.href) ? "text-primary" : "text-muted-foreground"
                )}>
                    {link.label}
                </Link>
             ))}
          </nav>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {!isMobile && (
            <div className='flex items-center gap-5'>
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
        
        {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 p-1 h-auto rounded-full">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                        <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline font-semibold">{user.displayName || user.email}</span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:inline" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
      </div>
    </header>
  );
}
