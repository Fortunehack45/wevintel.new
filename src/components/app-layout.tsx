
'use client';

import { usePathname } from 'next/navigation';
import { Header } from './header';
import { Footer } from './footer';
import { BottomNav } from './bottom-nav';

export function AppLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

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
            <main className="flex-1 pb-16 md:pb-0">
                {children}
            </main>
            <Footer />
            <BottomNav />
        </>
    )
}
