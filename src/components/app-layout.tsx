
'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';
import { BottomNav } from './bottom-nav';
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';


export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isMobile = useIsMobile();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    
    const isAuthPage = pathname === '/login' || pathname === '/signup';
    const isWelcomePage = pathname === '/';
    
    const appRoutes = ['/dashboard', '/compare', '/leaderboard', '/history', '/settings'];
    const isAppPage = appRoutes.some(route => pathname.startsWith(route)) || pathname.startsWith('/analysis');


    if (!mounted) {
        return null; // Render nothing until client-side hydration is complete to prevent layout flash
    }
    
    // Auth pages have their own simple layout
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
        <>
            <div className="wave-container">
                <div className="wave-light"></div>
            </div>
            <Header />
            <main className="flex-1 min-h-[calc(100vh-60px)] pb-16">
                {children}
            </main>
            <Footer />
            <BottomNav />
        </>
    )
}
