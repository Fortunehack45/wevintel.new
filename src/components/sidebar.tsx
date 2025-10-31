
'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Home, Scale, Trophy, History, Settings, User, LogOut, Info, Send, FileText, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuthContext } from "@/firebase/provider";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const mainNavLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/compare', label: 'Compare', icon: Scale },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/history', label: 'History', icon: History },
];

const supportNavLinks = [
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: Send },
];

const legalNavLinks = [
    { href: '/privacy', label: 'Privacy', icon: Shield },
    { href: '/terms', label: 'Terms', icon: FileText },
];

const NavLink = ({ href, label, icon: Icon }: { href: string, label: string, icon: React.ElementType }) => {
    const pathname = usePathname();
    const isActive = pathname.startsWith(href);

    return (
        <Link href={href}>
            <span className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                isActive && "bg-muted text-primary"
            )}>
                <Icon className="h-4 w-4" />
                {label}
            </span>
        </Link>
    )
}

export function Sidebar() {
    const isMobile = useIsMobile();
    const auth = useAuthContext();
    const { toast } = useToast();
    const router = useRouter();

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

    if (isMobile) {
        return null;
    }

    return (
        <div className="hidden border-r bg-muted/40 md:block fixed h-full w-64">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
                <Compass className="h-6 w-6 text-primary" />
                <span className="">WebIntel</span>
              </Link>
            </div>
            <div className="flex-1 overflow-y-auto">
              <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                {mainNavLinks.map(link => <NavLink key={link.href} {...link} />)}

                 <Accordion type="multiple" className="w-full">
                    <AccordionItem value="support" className="border-b-0">
                        <AccordionTrigger className="text-muted-foreground hover:text-primary hover:no-underline py-2 text-sm font-normal">Support</AccordionTrigger>
                        <AccordionContent className="pl-4">
                            {supportNavLinks.map(link => <NavLink key={link.href} {...link} />)}
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="legal" className="border-b-0">
                        <AccordionTrigger className="text-muted-foreground hover:text-primary hover:no-underline py-2 text-sm font-normal">Legal</AccordionTrigger>
                        <AccordionContent className="pl-4">
                            {legalNavLinks.map(link => <NavLink key={link.href} {...link} />)}
                        </AccordionContent>
                    </AccordionItem>
                 </Accordion>
              </nav>
            </div>
            <div className="mt-auto p-4 border-t">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/settings">
                            <Settings className="h-5 w-5" />
                        </Link>
                    </Button>
                    {auth?.currentUser &&
                        <Button variant="ghost" size="icon" onClick={handleLogout}>
                            <LogOut className="h-5 w-5" />
                        </Button>
                    }
                </div>
            </div>
          </div>
        </div>
    )
}
