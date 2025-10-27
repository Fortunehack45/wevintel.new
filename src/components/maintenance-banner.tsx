
'use client';
import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import Lottie from 'lottie-react';
import maintenanceAnimation from '@/lib/maintenance-animation.json';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './ui/button';

export function MaintenanceBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const checkTime = () => {
            const now = new Date();
            // FORCED VISIBILITY FOR DEMO:
            // This is temporarily set to true.
            // Original logic:
            // const dayOfWeek = now.getUTCDay(); // Sunday = 0, Monday = 1
            // const hours = now.getUTCHours();
            // const minutes = now.getUTCMinutes();
            // if (dayOfWeek === 1 && hours === 0 && minutes < 30) {
            if (true) {
                const lastDismissed = sessionStorage.getItem('maintenanceDismissed');
                if (!lastDismissed || (now.getTime() - new Date(lastDismissed).getTime() > 60 * 60 * 1000)) {
                    setIsVisible(true);
                }
            } else {
                setIsVisible(false);
            }
        };

        checkTime();
        // We don't need an interval for demo purposes
        // const interval = setInterval(checkTime, 60000); 
        // return () => clearInterval(interval);
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        setIsDismissed(true);
        sessionStorage.setItem('maintenanceDismissed', new Date().toISOString());
    }

    if (isDismissed) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="overflow-hidden"
                >
                    <div className="bg-secondary/50 p-4">
                        <Card className="container mx-auto p-4 flex items-center justify-center gap-4 relative shadow-lg glass-card">
                            <div className="w-20 h-20 flex-shrink-0">
                                <Lottie animationData={maintenanceAnimation} loop={true} />
                            </div>
                            <div className="flex-grow">
                                <h3 className="font-bold text-lg text-foreground">Weekly Maintenance In Progress</h3>
                                <p className="text-sm text-muted-foreground">
                                    We are performing scheduled maintenance. The app is still usable, but you may experience minor disruptions for the next few minutes.
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={handleDismiss}>
                                <X className="h-4 w-4" />
                            </Button>
                        </Card>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
