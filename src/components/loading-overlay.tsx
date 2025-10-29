
'use client';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const singleMessages = [
    "Warming up the engines...",
    "Scanning for technologies...",
    "Running performance audits...",
    "Checking security headers...",
    "Generating AI insights...",
    "Finalizing your report...",
];

const comparisonMessages = [
    "Analyzing both sites...",
    "Comparing performance metrics...",
    "Contrasting security postures...",
    "Detecting tech stacks...",
    "Generating AI comparison...",
    "Building your report...",
]

const Spinner = () => (
    <svg className="loading-spinner h-16 w-16 text-primary" viewBox="0 0 50 50">
      <circle
        className="path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="5"
      ></circle>
    </svg>
);


export function LoadingOverlay({ isVisible, isComparison = false }: { isVisible: boolean, isComparison?: boolean }) {
    const [index, setIndex] = useState(0);
    const messages = isComparison ? comparisonMessages : singleMessages;

    useEffect(() => {
        if (isVisible) {
            setIndex(0); // Reset on new analysis
            const interval = setInterval(() => {
                setIndex(prev => {
                    if (prev >= messages.length - 1) {
                        clearInterval(interval);
                        return prev;
                    }
                    return prev + 1;
                });
            }, 2000); // Change message every 2 seconds

            return () => clearInterval(interval);
        }
    }, [isVisible, messages, messages.length]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-6"
                >
                    <Spinner />
                    <div className="relative h-6 w-64 text-center">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5 }}
                                className="text-lg font-medium text-foreground absolute inset-0"
                            >
                                {messages[index]}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
