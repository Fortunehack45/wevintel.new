
'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';
import { BottomNav } from './bottom-nav';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect } from 'react';
import { OptimalLayoutSuggestion } from './optimal-layout-suggestion';


export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isMobile = useIsMobile();
    const [mounted, setMounted] = useState(false);

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
    
    return (
        <div className="flex flex-col min-h-screen">
            <div className="wave-container">
                <div className="wave-light"></div>
            </div>
            <Header />
<<<<<<< HEAD
            <main className="flex-1 pb-20 md:pb-0">
=======
            <main className="flex-1 pb-16 md:pb-0">
>>>>>>> b26aced (Let the mobile mode have a header not like the header of desktop view bu)
                {children}
            </main>
            <Footer />
            <BottomNav />
            {showSuggestion && <OptimalLayoutSuggestion />}
        </div>
    )
}
