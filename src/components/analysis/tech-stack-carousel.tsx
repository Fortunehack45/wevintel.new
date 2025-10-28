
'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import {
    SiNextdotjs, SiReact, SiVuedotjs, SiAngular, SiNodedotjs, SiPhp, SiRubyonrails, SiPython, SiGo,
    SiTypescript, SiJavascript, SiHtml5, SiCss3, SiSass, SiLess, SiWebpack, SiVite, SiEslint, SiPrettier,
    SiDocker, SiKubernetes, SiAmazon, SiGooglecloud, SiVercel, SiNetlify, SiHeroku,
    SiNginx, SiApache, SiCloudflare, SiFastly, SiAkamai,
    SiWordpress, SiJoomla, SiDrupal, SiShopify, SiMagento, SiBigcommerce, SiWix, SiSquarespace,
    SiMysql, SiPostgresql, SiMongodb, SiRedis, SiGraphql, SiApollographql,
    SiGoogleanalytics, SiGoogletagmanager, SiAdobe,
    SiBootstrap, SiTailwindcss, SiMui, SiChakraui,
    SiJest, SiCypress, SiStorybook,
} from 'react-icons/si';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { TechStackData } from '@/lib/types';
import { Layers } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { cn } from '@/lib/utils';
import { DashboardSkeleton } from './dashboard-skeleton';

const techIcons: { [key: string]: React.ElementType } = {
    // Frameworks & Libraries
    'next.js': SiNextdotjs, 'react': SiReact, 'vue.js': SiVuedotjs, 'angular': SiAngular, 'node.js': SiNodedotjs,
    'php': SiPhp, 'ruby on rails': SiRubyonrails, 'python': SiPython, 'go': SiGo,
    // Languages
    'typescript': SiTypescript, 'javascript': SiJavascript, 'html5': SiHtml5, 'css3': SiCss3, 'sass': SiSass, 'less': SiLess,
    // Build Tools & Devops
    'webpack': SiWebpack, 'vite': SiVite, 'eslint': SiEslint, 'prettier': SiPrettier, 'docker': SiDocker, 'kubernetes': SiKubernetes,
    // Hosting & CDN
    'aws': SiAmazon, 'google cloud': SiGooglecloud, 'vercel': SiVercel, 'netlify': SiNetlify,
    'heroku': SiHeroku, 'nginx': SiNginx, 'apache': SiApache, 'cloudflare': SiCloudflare, 'fastly': SiFastly, 'akamai': SiAkamai,
    // CMS & E-commerce
    'wordpress': SiWordpress, 'joomla': SiJoomla, 'drupal': SiDrupal, 'shopify': SiShopify, 'magento': SiMagento,
    'bigcommerce': SiBigcommerce, 'wix': SiWix, 'squarespace': SiSquarespace,
    // Database & API
    'mysql': SiMysql, 'postgresql': SiPostgresql, 'mongodb': SiMongodb, 'redis': SiRedis, 'graphql': SiGraphql, 'apollo': SiApollographql,
    // Analytics & Marketing
    'google analytics': SiGoogleanalytics, 'google tag manager': SiGoogletagmanager, 'adobe': SiAdobe,
    // UI Frameworks
    'bootstrap': SiBootstrap, 'tailwind css': SiTailwindcss, 'material-ui': SiMui, 'chakra ui': SiChakraui,
    // Testing
    'jest': SiJest, 'cypress': SiCypress, 'storybook': SiStorybook,
};

const getIcon = (name: string) => {
    const lowerCaseName = name.toLowerCase();
    const foundKey = Object.keys(techIcons).find(key => lowerCaseName.includes(key));
    return foundKey ? techIcons[foundKey] : Layers;
}

const TechCard = ({ tech }: { tech: TechStackData[0] }) => {
    const Icon = getIcon(tech.name);
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div 
                    className="flex-shrink-0 w-48 h-40 rounded-2xl p-4 flex flex-col justify-center items-center gap-3 cursor-pointer transition-all duration-300
                                bg-card/5 backdrop-blur-sm border border-white/10 
                                hover:bg-card/20 hover:border-primary/50 hover:scale-105"
                >
                    <Icon className="h-8 w-8 text-foreground/80" />
                    <div className="text-center">
                        <p className="font-bold text-sm text-foreground">{tech.name}</p>
                        <p className="text-xs text-muted-foreground">{tech.category}</p>
                    </div>
                </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
                <p className="font-bold">{tech.name}</p>
                {tech.description && <p className="text-sm mt-1">{tech.description}</p>}
                <p className="text-xs text-muted-foreground mt-2">Confidence: {tech.confidence}%</p>
            </TooltipContent>
        </Tooltip>
    );
};


export function TechStackCarousel({ data }: { data?: TechStackData }) {
    const scrollerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        let autoScrollTimeout: NodeJS.Timeout;

        const startAnimation = () => {
            if (!isDragging) {
                scroller.setAttribute('data-animated', 'true');
            }
        };

        const pauseAnimation = () => {
            scroller.setAttribute('data-animated', 'false');
        };
        
        const resumeAnimation = () => {
            if (!isDragging) {
                clearTimeout(autoScrollTimeout);
                autoScrollTimeout = setTimeout(() => {
                     startAnimation();
                }, 3000);
            }
        };

        scroller.addEventListener('mouseenter', pauseAnimation);
        scroller.addEventListener('mouseleave', resumeAnimation);
        
        // Handle drag-to-scroll
        let isDown = false;
        let startX: number;
        let scrollLeft: number;

        const handleMouseDown = (e: MouseEvent) => {
            isDown = true;
            setIsDragging(true);
            scroller.classList.add('active');
            startX = e.pageX - scroller.offsetLeft;
            scrollLeft = scroller.scrollLeft;
            pauseAnimation();
        };

        const handleMouseLeave = () => {
            if (isDown) {
               isDown = false;
               setIsDragging(false);
               scroller.classList.remove('active');
               resumeAnimation();
            }
        };

        const handleMouseUp = () => {
            isDown = false;
            setIsDragging(false);
            scroller.classList.remove('active');
            resumeAnimation();
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - scroller.offsetLeft;
            const walk = (x - startX) * 2; //scroll-fast
            scroller.scrollLeft = scrollLeft - walk;
        };
        
        scroller.addEventListener('mousedown', handleMouseDown);
        scroller.addEventListener('mouseleave', handleMouseLeave);
        scroller.addEventListener('mouseup', handleMouseUp);
        scroller.addEventListener('mousemove', handleMouseMove);

        startAnimation();

        return () => {
            scroller.removeEventListener('mouseenter', pauseAnimation);
            scroller.removeEventListener('mouseleave', resumeAnimation);
            scroller.removeEventListener('mousedown', handleMouseDown);
            scroller.removeEventListener('mouseleave', handleMouseLeave);
            scroller.removeEventListener('mouseup', handleMouseUp);
            scroller.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(autoScrollTimeout);
        };
    }, [isDragging]);
    
    if (!data) {
        return <DashboardSkeleton.TechStackPlaceholder />;
    }

    if (data.length === 0) {
        return (
            <Card className="glass-card h-full min-h-[220px]">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Layers className="h-5 w-5 text-primary" />
                        Technology Stack
                    </CardTitle>
                    <CardDescription>AI-detected frameworks, libraries, and services.</CardDescription>
                </CardHeader>
                <CardContent className="min-h-[140px] flex items-center justify-center">
                    <p className="text-muted-foreground text-sm text-center py-4">Could not detect technology stack.</p>
                </CardContent>
            </Card>
        )
    }

    // Duplicate the data for a seamless loop
    const extendedData = [...data, ...data];

    return (
        <Card className="glass-card h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Technology Stack
                </CardTitle>
                <CardDescription>AI-detected frameworks, libraries, and services.</CardDescription>
            </CardHeader>
            <CardContent>
                <TooltipProvider>
                    <div ref={scrollerRef} className="tech-stack-scroller" data-dragging={isDragging}>
                        <div className="tech-stack-scroller-inner">
                            {extendedData.map((tech, index) => (
                                <TechCard key={`${tech.name}-${index}`} tech={tech} />
                            ))}
                        </div>
                    </div>
                </TooltipProvider>
            </CardContent>
        </Card>
    );
}
