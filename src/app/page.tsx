
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Scale, ShieldCheck, Sparkles, Activity, Building, Heart, Star } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { SiVercel, SiFirebase, SiGoogle, SiNextdotjs, SiTailwindcss } from 'react-icons/si';
import { cn } from "@/lib/utils";

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

const sponsors = [
    { name: 'Vercel', icon: SiVercel },
    { name: 'Firebase', icon: SiFirebase },
    { name: 'Google', icon: SiGoogle },
    { name: 'Next.js', icon: SiNextdotjs },
    { name: 'ShadCN', icon: () => <span className="text-xl font-bold">shadcn</span> },
    { name: 'Genkit', icon: () => <span className="text-xl font-bold">Genkit</span> },
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


export default function WelcomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <main className="flex-1">
                <section className="container mx-auto px-4 py-20 md:py-32 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground">
                            The Ultimate Website Intelligence Tool
                        </h1>
                        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                            Instantly uncover the secrets of any website. Get in-depth intelligence on performance, security, technology, and more with our AI-powered analysis platform.
                        </p>
                        <div className="mt-8 flex justify-center">
                            <Button asChild size="lg" className="h-12 text-lg">
                                <Link href="/dashboard">
                                    Get Started <ArrowRight className="ml-2" />
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </section>
                
                 <section className="container mx-auto px-4 pb-20">
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

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mb-16 container mx-auto px-4"
                >
                    <h2 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-3"><Building className="text-primary"/> Sponsored By</h2>
                    <div className="tech-stack-scroller" data-animated="true">
                        <div className="tech-stack-scroller-inner flex items-center gap-16">
                            {[...sponsors, ...sponsors].map((sponsor, index) => (
                                <div key={`${sponsor.name}-${index}`} className="flex items-center gap-4 grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all text-4xl">
                                    <sponsor.icon />
                                    <p className="font-bold text-2xl">{sponsor.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                 <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mb-16 container mx-auto px-4"
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

            </main>
        </div>
    )
}
