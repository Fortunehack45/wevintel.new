
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Globe } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DomainCheckerPage() {
  const [domain, setDomain] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLookup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    let cleanDomain = domain.trim();
    // Remove protocol and paths, just get the hostname
    try {
        if (cleanDomain.includes('://')) {
            cleanDomain = new URL(cleanDomain).hostname;
        }
    } catch (error) {
        // Ignore invalid URL formats, just use the string
    }
    cleanDomain = cleanDomain.replace(/^(www\.)/i, '');


    if (!cleanDomain) {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain name, e.g., example.com",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    router.push(`/domain-checker/${cleanDomain}`);
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="max-w-3xl w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-foreground flex items-center justify-center gap-4">
            <Globe className="h-12 w-12 text-primary" /> Domain Checker
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Instantly look up public registration information for any domain.
          </p>
        </motion.div>
        
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative w-full max-w-xl mx-auto"
        >
            <div className="p-2 rounded-xl relative overflow-hidden glass-card">
                <form onSubmit={handleLookup} className="flex w-full items-center space-x-2 relative z-10">
                    <Input
                        type="text"
                        placeholder="e.g., google.com"
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="h-12 text-base flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        aria-label="Domain Name"
                        disabled={isLoading}
                        autoComplete="off"
                    />
                    <Button type="submit" size="lg" className="h-12 rounded-lg" disabled={isLoading && !domain}>
                        {isLoading ? (
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : <Search className="h-5 w-5" />}
                        <span className="hidden md:inline ml-2">Look Up</span>
                    </Button>
                </form>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Get registrar, creation date, expiration date, and nameserver details.
            </p>
        </motion.div>
      </div>
    </div>
  );
}
