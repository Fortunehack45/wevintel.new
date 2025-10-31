
'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';
import { BottomNav } from './bottom-nav';
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 2cc806b (Also introduced the header for the mobile view back)
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
    
<<<<<<< HEAD
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
=======
>>>>>>> 2cc806b (Also introduced the header for the mobile view back)
    if (!mounted) {
        return (
             <div className="flex flex-col h-full">
                <main className="flex-1">
                    {children}
                </main>
            </div>
        );
    }
    
<<<<<<< HEAD
    if (isAuthPage) {
>>>>>>> f640191 (When it's loading it's showing the old UI which is not right)
=======
    if (isAuthPage && !isMobile) {
>>>>>>> ad66bd8 (The footer should be separated from the body in the desktop view. Like t)
        return (
             <main className="flex-1">
                {children}
            </main>
        );
    }
    
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
=======
            <main className="flex-1">
=======
            <main className="flex-1 overflow-y-auto">
>>>>>>> ad66bd8 (The footer should be separated from the body in the desktop view. Like t)
                {children}
            </main>
            <Footer />
            {isMobile && !isWelcomePage && <BottomNav />}
        </>
>>>>>>> 2cc806b (Also introduced the header for the mobile view back)
    )
}
