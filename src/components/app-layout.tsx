
'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';
import { BottomNav } from './bottom-nav';
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
    
    if (!mounted) {
        return (
             <div className="flex flex-col h-full">
                <Header />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        );
    }
    
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
    
    return (
        <>
            <div className="wave-container">
                <div className="wave-light"></div>
            </div>
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <Footer />
            {isMobile && !isWelcomePage && <BottomNav />}
        </>
    )
}
