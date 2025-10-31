
'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';
import { BottomNav } from './bottom-nav';
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';


export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isMobile = useIsMobile();
    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isWelcomePage = pathname === '/';
    
    const appRoutes = ['/dashboard', '/compare', '/leaderboard', '/history', '/settings'];
    const isAppPage = appRoutes.some(route => pathname.startsWith(route));


    if (isAuthPage) {
        return (
            <>
                <div className="wave-container">
                    <div className="wave-light"></div>
                </div>
                 <main className="flex-1">
                    {children}
                </main>
            </>
        )
    }
    
    if (isWelcomePage) {
        return (
             <>
                <div className="wave-container">
                    <div className="wave-light"></div>
                </div>
                <Header />
                <main className="flex-1 min-h-[calc(100vh-69px)]">
                    {children}
                </main>
                <Footer />
            </>
        )
    }

    if (isAppPage) {
        return (
            <div className="flex h-full">
                <Sidebar />
                <div className={cn("flex-1", isMobile ? "pl-16" : "md:pl-64")}>
                    <main className="flex-1 pb-16 md:pb-0 min-h-screen">
                        {children}
                    </main>
                </div>
            </div>
        )
    }
    
    // For other pages like /about, /contact, etc.
    return (
        <>
            <div className="wave-container">
                <div className="wave-light"></div>
            </div>
            <Header />
            <main className="flex-1 pb-16 md:pb-0 min-h-[calc(100vh-69px)]">
                {children}
            </main>
            <Footer />
            <BottomNav />
        </>
    )
}
