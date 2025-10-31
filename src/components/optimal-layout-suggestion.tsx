
'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from './ui/button';
import { useWindowSize } from '@/hooks/use-window-size';
import { Smartphone, RotateCw } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

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
        }
    }, [width, height, isMobile, pathname]);

    const handleDismiss = () => {
        sessionStorage.setItem('layout_suggestion_dismissed_path', pathname);
        setIsOpen(false);
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent 
                side="bottom" 
                className="rounded-t-2xl border-t-2 border-primary/20 bg-background/95 backdrop-blur-lg"
                onInteractOutside={handleDismiss}
                onEscapeKeyDown={handleDismiss}
            >
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
    );
}
