
'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';
import { BottomNav } from './bottom-nav';
<<<<<<< HEAD
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import { OptimalLayoutSuggestion } from './optimal-layout-suggestion';
=======
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
>>>>>>> 05fe2ff (For the welcome page on the desktop view it should only one page Dashboa)


export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isMobile = useIsMobile();
<<<<<<< HEAD
    const [mounted, setMounted] = useState(false);
=======
    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isWelcomePage = pathname === '/';
<<<<<<< HEAD
>>>>>>> 05fe2ff (For the welcome page on the desktop view it should only one page Dashboa)
=======
    
    const appRoutes = ['/dashboard', '/compare', '/leaderboard', '/history', '/settings'];
    const isAppPage = appRoutes.some(route => pathname.startsWith(route));

<<<<<<< HEAD
>>>>>>> b4e6b96 (The dashboard page should not show a button navigation bar on the mobile)
=======
    const analysisRoutes = ['/analysis', '/compare/'];
    const isAnalysisPage = analysisRoutes.some(route => pathname.startsWith(route));

>>>>>>> 2a49068 (The sidebar is only for the dashboard page oo for the mobile view. It sh)

    useEffect(() => {
        setMounted(true);
    }, []);
    
    const pagesWithoutSuggestion = [
        '/login',
        '/signup',
        '/settings',
        '/privacy',
        '/terms',
        '/about',
        '/contact'
    ];

    const showSuggestion = mounted && !pagesWithoutSuggestion.some(p => pathname.startsWith(p));
    
    if (!mounted) {
        return (
             <main className="flex-1">
                {children}
            </main>
        );
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
        <div className="flex flex-col min-h-screen">
            <div className="wave-container">
                <div className="wave-light"></div>
            </div>
            <Header />
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            <main className="flex-1 pb-20 md:pb-0">
=======
            <main className="flex-1 pb-16 md:pb-0">
>>>>>>> b26aced (Let the mobile mode have a header not like the header of desktop view bu)
                {children}
            </main>
            <Footer />
=======
            <div className={cn(!isWelcomePage && "md:pl-64")}>
                <main className="flex-1 pb-16 md:pb-0 min-h-[calc(100vh-69px)]">
                    {children}
                </main>
                <Footer />
            </div>
>>>>>>> 05fe2ff (For the welcome page on the desktop view it should only one page Dashboa)
=======
            <main className="flex-1 pb-16 md:pb-0 min-h-[calc(100vh-69px)]">
=======
            <main className="flex-1 min-h-[calc(100vh-69px)]">
>>>>>>> 2a49068 (The sidebar is only for the dashboard page oo for the mobile view. It sh)
                {children}
            </main>
            <Footer />
>>>>>>> b4e6b96 (The dashboard page should not show a button navigation bar on the mobile)
            <BottomNav />
            {showSuggestion && <OptimalLayoutSuggestion />}
        </div>
    )
}
