
'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useWindowSize } from '@/hooks/use-window-size';
import { Smartphone, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';

export function OptimalLayoutSuggestion() {
    const [isOpen, setIsOpen] = useState(false);
    const { width, height } = useWindowSize();
    const isMobile = useIsMobile();
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window !== 'undefined' && isMobile) {
            const isPortrait = height > width;
            const lastDismissedPath = sessionStorage.getItem('layout_suggestion_dismissed_path');

            if (isPortrait && lastDismissedPath !== pathname) {
                const timer = setTimeout(() => {
                    setIsOpen(true);
                }, 1500); // Delay before showing
                return () => clearTimeout(timer);
            } else {
                setIsOpen(false);
            }
        } else {
            setIsOpen(false);
        }
    }, [width, height, isMobile, pathname]);

    const handleDismiss = () => {
        sessionStorage.setItem('layout_suggestion_dismissed_path', pathname);
        setIsOpen(false);
    };

    return (
        <AnimatePresence>
            {isOpen && (
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
                                WebIntel is optimized for larger screens. For the best experience, view on a desktop or switch your mobile browser to landscape and 'Desktop Site' mode.
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
