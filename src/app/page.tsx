
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ArrowRight, BarChart, Scale, ShieldCheck, Sparkles, Zap, Activity } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
            </main>
        </div>
    )
}
