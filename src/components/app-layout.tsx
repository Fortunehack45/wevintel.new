
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

    const analysisRoutes = ['/analysis', '/compare/'];
    const isAnalysisPage = analysisRoutes.some(route => pathname.startsWith(route));


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
        // Desktop view always gets the sidebar for app pages
        if (!isMobile) {
            return (
                <div className="flex h-full">
                    <Sidebar />
                    <div className="flex-1 md:pl-64">
                         <main className="flex-1 min-h-screen">
                            {children}
                        </main>
                    </div>
                </div>
            )
        }
        
        // Mobile view: only dashboard gets the special sidebar layout
        if (pathname.startsWith('/dashboard')) {
             return (
                <div className="flex h-full">
                    <Sidebar />
                    <div className="flex-1 pl-16">
                        <main className="flex-1 pb-16 min-h-screen">
                            {children}
                        </main>
                    </div>
                </div>
            )
        }
    }
    
    // Fallback for all other pages (including app pages on mobile that aren't dashboard)
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
            <BottomNav />
        </>
    )
}
