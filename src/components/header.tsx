
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
  const { setTheme } = useTheme();
  const { toast } = useToast();
  const router = useRouter();
  
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
    return <header className="p-4 flex justify-between items-center border-b h-[69px]" />;
  }

  const NavContent = () => (
    <nav className="hidden md:flex items-center gap-2">
        {navLinks.map(link => (
            <Button
                key={link.href}
                variant={pathname.startsWith(link.href) ? "secondary" : "ghost"}
                asChild
            >
                <Link href={link.href}>{link.label}</Link>
            </Button>
        ))}
    </nav>
  );
  
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


  return (
    <header className="p-4 flex justify-between items-center border-b sticky top-0 bg-background/80 backdrop-blur-lg z-50">
      <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
        <Compass className="h-6 w-6 text-primary" />
        <span className="text-foreground">WebIntel</span>
      </Link>
      
      {!isMobile && <NavContent />}

      <div className="flex items-center gap-2">
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
        )}
      </div>
    </header>
  );
}
