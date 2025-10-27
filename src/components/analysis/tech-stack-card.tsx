
'use client';
import {
    SiNextdotjs, SiReact, SiVuedotjs, SiAngellist, SiNodedotjs, SiPhp, SiRubyonrails, SiPython, SiGo, SiJava,
    SiTypescript, SiJavascript, SiHtml5, SiCss3, SiSass, SiLess, SiWebpack, SiVite, SiEslint, SiPrettier,
    SiDocker, SiKubernetes, SiAmazon, SiGooglecloud, SiMicrosoftazure, SiVercel, SiNetlify, SiHeroku,
    SiNginx, SiApache, SiCloudflare, SiFastly, SiAkamai,
    SiWordpress, SiJoomla, SiDrupal, SiShopify, SiMagento, SiBigcommerce, SiWix, SiSquarespace,
    SiMysql, SiPostgresql, SiMongodb, SiRedis, SiGraphql, SiApollographql,
    SiGoogleanalytics, SiGoogletagmanager, SiAdobe, SiSegment,
    SiBootstrap, SiTailwindcss, SiMui, SiChakraui,
    SiJest, SiCypress, SiStorybook,
} from 'react-icons/si';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { TechStackData } from '@/lib/types';
import { Layers } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { DashboardSkeleton } from './dashboard-skeleton';

const techIcons: { [key: string]: React.ElementType } = {
    // Frameworks & Libraries
    'next.js': SiNextdotjs, 'react': SiReact, 'vue.js': SiVuedotjs, 'angular': SiAngellist, 'node.js': SiNodedotjs,
    'php': SiPhp, 'ruby on rails': SiRubyonrails, 'python': SiPython, 'go': SiGo, 'java': SiJava,
    // Languages
    'typescript': SiTypescript, 'javascript': SiJavascript, 'html5': SiHtml5, 'css3': SiCss3, 'sass': SiSass, 'less': SiLess,
    // Build Tools & Devops
    'webpack': SiWebpack, 'vite': SiVite, 'eslint': SiEslint, 'prettier': SiPrettier, 'docker': SiDocker, 'kubernetes': SiKubernetes,
    // Hosting & CDN
    'aws': SiAmazon, 'google cloud': SiGooglecloud, 'azure': SiMicrosoftazure, 'vercel': SiVercel, 'netlify': SiNetlify,
    'heroku': SiHeroku, 'nginx': SiNginx, 'apache': SiApache, 'cloudflare': SiCloudflare, 'fastly': SiFastly, 'akamai': SiAkamai,
    // CMS & E-commerce
    'wordpress': SiWordpress, 'joomla': SiJoomla, 'drupal': SiDrupal, 'shopify': SiShopify, 'magento': SiMagento,
    'bigcommerce': SiBigcommerce, 'wix': SiWix, 'squarespace': SiSquarespace,
    // Database & API
    'mysql': SiMysql, 'postgresql': SiPostgresql, 'mongodb': SiMongodb, 'redis': SiRedis, 'graphql': SiGraphql, 'apollo': SiApollographql,
    // Analytics & Marketing
    'google analytics': SiGoogleanalytics, 'google tag manager': SiGoogletagmanager, 'adobe target': SiAdobe, 'segment': SiSegment,
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

export function TechStackCard({ data }: { data?: TechStackData }) {
    if (!data) {
        return <DashboardSkeleton.TechStackPlaceholder />;
    }

    if (data.length === 0) {
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
                    <p className="text-muted-foreground text-sm text-center py-4">Could not detect technology stack.</p>
                </CardContent>
            </Card>
        )
    }
    
    // Sort by confidence and then alphabetically
    const sortedData = [...data].sort((a, b) => {
        if (b.confidence !== a.confidence) {
            return b.confidence - a.confidence;
        }
        return a.name.localeCompare(b.name);
    });

    return (
        <Card className="glass-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Layers className="h-5 w-5 text-primary" />
                    Technology Stack
                </CardTitle>
                <CardDescription>AI-detected frameworks, libraries, and services.</CardDescription>
            </CardHeader>
            <CardContent>
                <TooltipProvider>
                    <div className="flex flex-wrap gap-4">
                        {sortedData.map((tech) => {
                            const Icon = getIcon(tech.name);
                            return (
                                <Tooltip key={tech.name}>
                                    <TooltipTrigger asChild>
                                        <div className="flex items-center gap-3 rounded-lg border bg-background p-3 hover:bg-accent hover:text-accent-foreground transition-colors cursor-help">
                                            <Icon className="h-6 w-6" />
                                            <div>
                                                <p className="font-semibold text-sm">{tech.name}</p>
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
                            )
                        })}
                    </div>
                </TooltipProvider>
            </CardContent>
        </Card>
    );
}
