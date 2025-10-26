
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { AISummary } from '@/lib/types';
import { BrainCircuit, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const TypingBubble = () => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-1"
    >
      <motion.div
        className="h-2 w-2 bg-primary rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="h-2 w-2 bg-primary rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
      />
      <motion.div
        className="h-2 w-2 bg-primary rounded-full"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
      />
    </motion.div>
);


export function AICard({ data }: { data: AISummary }) {
    const [isTyping, setIsTyping] = useState(true);

    useEffect(() => {
        // Simulate AI "thinking" time
        const timer = setTimeout(() => {
            setIsTyping(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, [data]);


    return (
        <Card className="h-full glass-card glow-border">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                    AI Insights
                </CardTitle>
                <CardDescription>An intelligent summary of this website's analysis.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {isTyping ? (
                    <TypingBubble />
                ) : (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.5}}>
                        <div>
                            <h4 className="font-semibold text-foreground mb-2">Summary</h4>
                            <p className="text-muted-foreground text-sm">{data.summary}</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground mb-3 mt-4">Recommendations</h4>
                            <ul className="space-y-2">
                                {data.recommendations.map((rec, i) => (
                                    <motion.li 
                                        key={i} 
                                        className="flex items-start gap-2 text-sm text-muted-foreground"
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.15 }}
                                    >
                                        <Check className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                                        <span>{rec}</span>
                                    </motion.li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    );
}
