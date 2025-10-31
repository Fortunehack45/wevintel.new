
'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useWindowSize } from '@/hooks/use-window-size';
import { Smartphone, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

const SEEN_PATHS_KEY = 'webintel_layout_suggestion_seen_paths';
const SESSION_START_KEY = 'webintel_session_start_time';

export function OptimalLayoutSuggestion() {
    const [isVisible, setIsVisible] = useState(false);
    const { width, height } = useWindowSize();
    const isMobile = useIsMobile();
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === 'undefined' || !isMobile || width === 0) {
            return;
        }

        const isPortrait = height > width;
        if (!isPortrait) {
            setIsVisible(false);
            return;
        }

        const navigationEntries = performance.getEntriesByType("navigation");
        const navEntry = navigationEntries[0] as PerformanceNavigationTiming | undefined;
        const navigationType = navEntry?.type;
        
        const isReload = navigationType === 'reload';
        
        const sessionStartTime = sessionStorage.getItem(SESSION_START_KEY);
        const isFirstLoadOfSession = !sessionStartTime;

        if (isFirstLoadOfSession) {
            sessionStorage.setItem(SESSION_START_KEY, new Date().toISOString());
        }

        const seenPathsRaw = sessionStorage.getItem(SEEN_PATHS_KEY);
        const seenPaths: string[] = seenPathsRaw ? JSON.parse(seenPathsRaw) : [];
        
        const hasSeenOnThisPath = seenPaths.includes(pathname);

        if (!hasSeenOnThisPath && (isFirstLoadOfSession || isReload)) {
             const timer = setTimeout(() => {
                setIsVisible(true);
                // Immediately mark as seen for this session
                const updatedSeenPaths = [...seenPaths, pathname];
                sessionStorage.setItem(SEEN_PATHS_KEY, JSON.stringify(updatedSeenPaths));
            }, 1500); // Delay before showing

            return () => clearTimeout(timer);
        } else {
            setIsVisible(false);
        }
    }, [pathname, isMobile, width, height]);

    useEffect(() => {
        if (isVisible) {
            const dismissTimer = setTimeout(() => {
                setIsVisible(false);
            }, 8000); // Auto-dismiss after 8 seconds

            return () => clearTimeout(dismissTimer);
        }
    }, [isVisible]);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: "120%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "120%", opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed bottom-20 left-4 right-4 max-w-md mx-auto p-4 rounded-xl shadow-2xl glass-card z-40"
                >
                    <div className="flex items-start gap-4">
                        <div className="mt-1 bg-primary/10 p-2 rounded-full">
                            <Smartphone className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-semibold text-foreground">Optimal Viewing Experience</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                For the best experience, rotate your device to landscape or use 'Desktop Site' mode in your browser.
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 flex-shrink-0"
                            onClick={handleDismiss}
                            aria-label="Dismiss suggestion"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
