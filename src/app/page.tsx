
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Scale, ShieldCheck, Sparkles, Activity, Building, Heart, Star, Code, TrendingUp, Briefcase, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SiVercel, SiFirebase, SiGoogle, SiNextdotjs, SiTailwindcss } from 'react-icons/si';
import { cn } from "@/lib/utils";
import { useEffect, useState }from 'react';
import { useAuth, useAuthContext } from "@/firebase/provider";
import type { User } from 'firebase/auth';
import { LoadingOverlay } from "@/components/loading-overlay";
import { DashboardContent } from "./dashboard/page";
import { DashboardSkeleton } from "@/components/analysis/dashboard-skeleton";


const featureCards = [
    {
        icon: Activity,
        title: "Comprehensive Analysis",
        description: "Get detailed reports on Core Web Vitals, security headers, SEO health, and more."
    },
    {
        icon: ShieldCheck,
        title: "In-Depth Security",
        description: "Check for essential security headers, SSL configuration and potential vulnerabilities."
    },
    {
        icon: Sparkles,
        title: "AI-Powered Insights",
        description: "Receive AI-generated summaries, actionable recommendations, and traffic estimations."
    },
     {
        icon: Scale,
        title: "Side-by-Side Comparison",
        description: "Analyze two websites simultaneously to benchmark performance and technology stacks."
    }
];

const personas = [
    {
        icon: Code,
        title: "For Developers",
        description: "Analyze tech stacks, debug performance issues, and audit security headers with precision and speed."
    },
    {
        icon: TrendingUp,
        title: "For Marketers & SEOs",
        description: "Benchmark against competitors, uncover technical SEO opportunities, and gain a competitive edge."
    },
    {
        icon: Briefcase,
        title: "For Business Owners",
        description: "Get a comprehensive health check of your digital presence and make informed strategic decisions."
    },
    {
        icon: Search,
        title: "For Curious Minds",
        description: "Explore the digital architecture of your favorite websites and learn what makes the web tick."
    }
];

const sponsors = [
    { name: 'Vercel', icon: SiVercel },
    { name: 'Firebase', icon: SiFirebase },
    { name: 'Google', icon: SiGoogle },
    { name: 'Next.js', icon: SiNextdotjs },
    { name: 'ShadCN', icon: () => <span className="text-4xl font-bold">ShadCN</span>, isText: true },
    { name: 'Genkit', icon: () => <span className="text-4xl font-bold">Genkit</span>, isText: true },
    { name: 'Tailwind CSS', icon: SiTailwindcss },
];

const reviews = [
    {
        quote: "WebIntel is an absolute game-changer. The depth of analysis and the AI-powered insights have revolutionized my workflow.",
        name: "Sarah L.",
        role: "Lead Developer, TechCorp",
        rating: 5,
    },
    {
        quote: "The side-by-side comparison feature is invaluable for competitive analysis. I've uncovered so many opportunities.",
        name: "Michael B.",
        role: "Digital Strategist",
        rating: 5,
    },
    {
        quote: "As a security consultant, WebIntel is my first step in any website audit. It's fast, comprehensive, and incredibly accurate.",
        name: "Dr. Evelyn Reed",
        role: "Cybersecurity Expert",
        rating: 5,
    },
     {
        quote: "The AI redesign feature gave me a fresh perspective on my portfolio. It's like having a world-class designer on call.",
        name: "Alex Johnson",
        role: "Freelance Designer",
        rating: 5,
    },
];


function WelcomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <section className="relative container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24 text-center h-[80vh] flex flex-col justify-center">
                     <div className="absolute inset-0 -z-10 opacity-70 dark:opacity-100">
                        <iframe 
                            src='https://my.spline.design/glasseffectcopy-wpnrxnzxaya3nwfabun5wisd/embed' 
                            frameBorder='0' 
                            width='100%' 
                            height='100%'
                        ></iframe>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                         className="relative z-10"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
                            The Ultimate Website Intelligence Tool
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                            Instantly uncover the secrets of any website. Get in-depth intelligence on performance, security, technology, and more with our AI-powered analysis platform.
                        </p>
                        <div className="mt-8 flex justify-center">
                            <Button asChild size="lg" className="h-12 text-lg">
                                <Link href="/signup">
                                    Get Started <ArrowRight className="ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </section>
                
                 <section className="container mx-auto px-4 py-16 md:py-24">
                     <motion.div 
                         initial={{ opacity: 0, y: 20 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ duration: 0.7, delay: 0.3 }}
                         className="w-full max-w-5xl mx-auto"
                      >
                        <div className="grid md:grid-cols-2 gap-6">
                            {featureCards.map((feature, i) => (
                                <Card key={i} className="text-left glass-card">
                                    <CardHeader>
                                        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                                            <feature.icon className="h-6 w-6 text-primary" />
                                        </div>
                                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <CardDescription>{feature.description}</CardDescription>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                      </motion.div>
                </section>

                 <section className="container mx-auto px-4 py-16 md:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="w-full max-w-5xl mx-auto"
                    >
                        <h2 className="text-3xl font-bold mb-8 text-center">Who is WebIntel For?</h2>
                         <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {personas.map((persona, i) => (
                                <div key={i} className="text-center p-6 rounded-lg glass-card">
                                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
                                        <persona.icon className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{persona.title}</h3>
                                    <p className="text-sm text-muted-foreground">{persona.description}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </section>


                <section className="py-16 md:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3"><Building className="text-primary"/> Sponsored By</h2>
                        <div className="tech-stack-scroller" data-animated="true">
                            <div className="tech-stack-scroller-inner flex items-center gap-16">
                                {[...sponsors, ...sponsors].map((sponsor, index) => (
                                    <div key={`${sponsor.name}-${index}`} className="flex items-center gap-4 text-4xl grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all">
                                        {sponsor.isText ? <sponsor.icon /> : (
                                            <>
                                                <sponsor.icon />
                                                <p className="font-bold text-2xl">{sponsor.name}</p>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </section>

                 <section className="container mx-auto px-4 py-16 md:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3"><Heart className="text-primary"/> From Our Users</h2>
                        <div className="w-full overflow-hidden tech-stack-scroller" data-animated="true">
                            <div className="tech-stack-scroller-inner flex gap-6">
                                {[...reviews, ...reviews].map((review, index) => (
                                    <Card key={index} className="glass-card w-80 flex-shrink-0">
                                        <CardContent className="p-6">
                                            <div className="flex mb-2">
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                                                ))}
                                            </div>
                                            <p className="text-muted-foreground italic">"{review.quote}"</p>
                                            <div className="mt-4 text-right">
                                                <p className="font-bold text-sm">{review.name}</p>
                                                <p className="text-xs text-muted-foreground">{review.role}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </section>

            </main>
        </div>
    )
}

export default function RootPage() {
    const auth = useAuthContext();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (auth) {
            const unsubscribe = useAuth((user) => {
                setUser(user);
                setIsLoading(false);
            });
            return () => unsubscribe();
        } else {
            // If auth is not ready, wait a bit then assume logged out
            const timer = setTimeout(() => setIsLoading(false), 500);
            return () => clearTimeout(timer);
        }
    }, [auth]);

    if (isLoading) {
        return <DashboardSkeleton />;
    }

    if (user) {
        return <DashboardContent user={user} />;
    }

    return <WelcomePage />;
}

    