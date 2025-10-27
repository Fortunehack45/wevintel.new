'use client';

import { topSites } from "@/lib/top-sites";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function URLSuggestionsScroller() {
    const router = useRouter();
    const suggestions = topSites.slice(0, 20); // Take first 20 sites for the scroller

    const controls = useAnimation();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);
    let scrollTimeout = useRef<NodeJS.Timeout | null>(null);

    const handleAnalyse = (url: string) => {
        const encodedUrl = encodeURIComponent(url);
        router.push(`/analysis/${encodedUrl}`);
    };
    
    const animationDefinition = {
      x: ["0%", "-50%"],
      transition: {
        x: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 40,
          ease: "linear",
        },
      },
    };

    useEffect(() => {
        const startAnimation = () => {
            const scrollWidth = scrollRef.current?.scrollWidth ?? 0;
            const clientWidth = scrollRef.current?.clientWidth ?? 0;
            if (scrollWidth > clientWidth) {
                 controls.start(animationDefinition);
            }
        };

        // Delay starting animation to allow for layout calculation
        const animationTimeout = setTimeout(startAnimation, 100);

        return () => clearTimeout(animationTimeout);

    }, [controls, suggestions, animationDefinition]);

    useEffect(() => {
        if(isHovering || isScrolling) {
            controls.stop();
        } else {
             controls.start(animationDefinition);
        }
    }, [isHovering, isScrolling, controls, animationDefinition]);

    const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeout.current) {
            clearTimeout(scrollTimeout.current);
        }
        scrollTimeout.current = setTimeout(() => {
            setIsScrolling(false);
        }, 1500);
    };


    return (
        <div 
            className="w-full max-w-2xl mx-auto mt-4 overflow-hidden"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div 
                ref={scrollRef}
                className="no-scrollbar overflow-x-auto whitespace-nowrap"
                onScroll={handleScroll}
            >
                <motion.div
                    className="inline-block"
                    animate={controls}
                >
                    {[...suggestions, ...suggestions].map((site, index) => (
                        <div
                            key={`${site.domain}-${index}`}
                            onClick={() => handleAnalyse(site.url)}
                            className="inline-flex items-center gap-2 px-4 py-2 mx-2 rounded-full cursor-pointer transition-all duration-300 bg-white/5 backdrop-blur-md border border-white/10 shadow-md hover:scale-105 hover:shadow-primary/20 hover:border-primary/30"
                        >
                            <Image
                                src={`https://www.google.com/s2/favicons?domain_url=${site.url}&sz=32`}
                                alt={`${site.name} favicon`}
                                width={20}
                                height={20}
                                className="rounded-full flex-shrink-0"
                                unoptimized
                                crossOrigin="anonymous"
                            />
                            <span className="text-sm font-medium text-foreground">{site.name}</span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
