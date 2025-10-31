
'use client';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Compass, Home, Scale, Trophy, History, Settings, LogOut, Info, Send, FileText, Shield, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthContext } from "@/firebase/provider";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAuth } from "@/firebase/auth";
import { type User } from "firebase/auth";
import { useState, useEffect } from "react";

const mainNavLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/compare', label: 'Compare', icon: Scale },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/history', label: 'History', icon: History },
];

const supportNavLinks = [
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: Send },
    { href: '/privacy', label: 'Privacy', icon: Shield },
    { href: '/terms', label: 'Terms', icon: FileText },
];

const NavLink = ({ href, label, icon: Icon }: { href: string, label: string, icon: React.ElementType }) => {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link href={href}>
                        <span className={cn(
                            "flex items-center justify-center md:justify-start gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                            isActive && "bg-muted text-primary"
                        )}>
                            <Icon className="h-5 w-5" />
                            <span className="hidden md:inline">{label}</span>
                        </span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export function Sidebar() {
    const auth = useAuthContext();
    const { toast } = useToast();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (!auth) return;
        const unsubscribe = useAuth(setUser);
        return () => unsubscribe();
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

    return (
        <div className="fixed top-0 left-0 h-full border-r bg-muted/40 z-50 w-16 md:w-64 transition-all duration-300 ease-in-out">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center justify-center md:justify-start border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <Compass className="h-6 w-6 text-primary" />
                <span className="hidden md:inline">WebIntel</span>
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {mainNavLinks.map(link => <NavLink key={link.href} {...link} />)}
              </nav>
            </div>
            <div className="mt-auto p-4 border-t space-y-2">
                {user ? (
                    <>
                        <NavLink href="/settings" label="Settings" icon={Settings} />
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" className="w-full justify-center md:justify-start" size="icon" onClick={handleLogout}>
                                    <LogOut className="h-5 w-5" />
                                    <span className="hidden md:inline ml-3">Logout</span>
                                </Button>
                            </TooltipTrigger>
                             <TooltipContent side="right">
                                <p>Logout</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                    </>
                ) : (
                     <NavLink href="/login" label="Login" icon={UserIcon} />
                )}
            </div>
          </div>
        </div>
    )
}
