
'use client';

import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { Button } from './ui/button';
import { useWindowSize } from '@/hooks/use-window-size';
import { Smartphone, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
=======
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from './ui/button';
import { useWindowSize } from '@/hooks/use-window-size';
import { Smartphone, RotateCw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import Image from 'next/image';
>>>>>>> 3d6f03c (Create a features in a professional way that inform users that for best)

export function OptimalLayoutSuggestion() {
    const [isOpen, setIsOpen] = useState(false);
    const { width, height } = useWindowSize();
    const isMobile = useIsMobile();
<<<<<<< HEAD
    const pathname = usePathname();
=======
>>>>>>> 3d6f03c (Create a features in a professional way that inform users that for best)

    useEffect(() => {
        if (typeof window !== 'undefined' && isMobile) {
            const isPortrait = height > width;
<<<<<<< HEAD
<<<<<<< HEAD
            const lastDismissedPath = sessionStorage.getItem('layout_suggestion_dismissed_path');

            if (isPortrait && lastDismissedPath !== pathname) {
=======
            const hasBeenDismissed = sessionStorage.getItem('dismissedOptimalLayoutSuggestion');
            
            if (isPortrait && !hasBeenDismissed) {
>>>>>>> 3d6f03c (Create a features in a professional way that inform users that for best)
=======
            
            if (isPortrait) {
>>>>>>> fd5f0f3 (Once the page is reloaded the layout suggestions should show up if in th)
                const timer = setTimeout(() => {
                    setIsOpen(true);
                }, 1500); // Delay before showing
                return () => clearTimeout(timer);
<<<<<<< HEAD
<<<<<<< HEAD
            } else {
                setIsOpen(false);
            }
        } else {
            setIsOpen(false);
        }
    }, [width, height, isMobile, pathname]);

    const handleDismiss = () => {
        sessionStorage.setItem('layout_suggestion_dismissed_path', pathname);
=======
            } else if (!isPortrait) {
=======
            } else {
>>>>>>> fd5f0f3 (Once the page is reloaded the layout suggestions should show up if in th)
                setIsOpen(false);
            }
        }
    }, [width, height, isMobile]);

    const handleDismiss = () => {
<<<<<<< HEAD
        sessionStorage.setItem('dismissedOptimalLayoutSuggestion', 'true');
>>>>>>> 3d6f03c (Create a features in a professional way that inform users that for best)
=======
>>>>>>> fd5f0f3 (Once the page is reloaded the layout suggestions should show up if in th)
        setIsOpen(false);
    };

    return (
<<<<<<< HEAD
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
=======
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="bottom" className="rounded-t-2xl border-t-2 border-primary/20 bg-background/95 backdrop-blur-lg">
                <SheetHeader className="text-center mt-4">
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                        <Smartphone className="h-8 w-8 text-primary" />
                    </div>
                    <SheetTitle className="text-2xl font-bold">For the Best Experience</SheetTitle>
                    <SheetDescription className="text-base max-w-md mx-auto">
                        WebIntel is designed for a larger screen. For optimal analysis and data visualization, please switch to a desktop device or rotate your phone to landscape mode.
                    </SheetDescription>
                </SheetHeader>
                <div className="flex justify-center py-6">
                    <RotateCw className="h-10 w-10 text-muted-foreground animate-spin [animation-duration:10s]" />
                </div>
                <div className="p-4">
                    <Button onClick={handleDismiss} className="w-full h-12 text-base" variant="outline">
                        Continue Anyway
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
>>>>>>> 3d6f03c (Create a features in a professional way that inform users that for best)
    );
}
