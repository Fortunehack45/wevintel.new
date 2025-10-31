
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
<<<<<<< HEAD
>>>>>>> 05fe2ff (For the welcome page on the desktop view it should only one page Dashboa)
=======
import { useState, useEffect } from 'react';
>>>>>>> f640191 (When it's loading it's showing the old UI which is not right)


export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isMobile = useIsMobile();
<<<<<<< HEAD
<<<<<<< HEAD
    const [mounted, setMounted] = useState(false);
=======
=======
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    
>>>>>>> f640191 (When it's loading it's showing the old UI which is not right)
    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isWelcomePage = pathname === '/';
<<<<<<< HEAD
>>>>>>> 05fe2ff (For the welcome page on the desktop view it should only one page Dashboa)
=======
    
    const appRoutes = ['/dashboard', '/compare', '/leaderboard', '/history', '/settings'];
<<<<<<< HEAD
    const isAppPage = appRoutes.some(route => pathname.startsWith(route));

<<<<<<< HEAD
>>>>>>> b4e6b96 (The dashboard page should not show a button navigation bar on the mobile)
=======
    const analysisRoutes = ['/analysis', '/compare/'];
    const isAnalysisPage = analysisRoutes.some(route => pathname.startsWith(route) && route !== '/compare');
=======
    const isAppPage = appRoutes.some(route => pathname.startsWith(route)) || pathname.startsWith('/analysis');
>>>>>>> 5813a0a (Use button navigation bar for mobile view please)

>>>>>>> 2a49068 (The sidebar is only for the dashboard page oo for the mobile view. It sh)

<<<<<<< HEAD
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
=======
    if (!mounted) {
        return null; // Render nothing until client-side hydration is complete to prevent layout flash
    }
    
    // Auth pages have their own simple layout
    if (isAuthPage) {
>>>>>>> f640191 (When it's loading it's showing the old UI which is not right)
        return (
             <main className="flex-1">
                {children}
            </main>
        );
    }
    
    // Desktop view for app pages uses the sidebar
    if (!isMobile && isAppPage) {
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
    
    // All other pages (including mobile app pages and all welcome/info pages) use Header + Footer + BottomNav
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
<<<<<<< HEAD
            <main className="flex-1 pb-20 md:pb-0">
=======
            <main className="flex-1 pb-16 md:pb-0">
>>>>>>> b26aced (Let the mobile mode have a header not like the header of desktop view bu)
=======
            <main className="flex-1 min-h-[calc(100vh-60px)] pb-16">
>>>>>>> 5813a0a (Use button navigation bar for mobile view please)
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
