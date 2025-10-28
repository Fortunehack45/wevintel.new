
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Scale } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';

interface CompareFormProps {
  initialUrl1?: string;
  initialUrl2?: string;
  onCompare?: (urls: { url1: string, url2: string }) => void;
  isDialog?: boolean;
}

export function CompareForm({ initialUrl1 = '', initialUrl2 = '', onCompare, isDialog = false }: CompareFormProps) {
  const [urls, setUrls] = useState({ url1: initialUrl1, url2: initialUrl2 });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setUrls({ url1: initialUrl1, url2: initialUrl2 });
  }, [initialUrl1, initialUrl2]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUrls(prev => ({ ...prev, [name]: value }));
  };

  const handleCompare = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const cleanAndValidate = (url: string): string | null => {
        let cleanUrl = url.trim();
        if (!cleanUrl) return null;

        if (!/^(http|https):\/\//.test(cleanUrl)) {
            cleanUrl = `https://${cleanUrl}`;
        }
        try {
            new URL(cleanUrl);
            return cleanUrl;
        } catch (error) {
            return null;
        }
    }

    const validUrl1 = cleanAndValidate(urls.url1);
    const validUrl2 = cleanAndValidate(urls.url2);

    if (!validUrl1 || !validUrl2) {
      toast({
        title: "Invalid URL(s)",
        description: "Please enter two valid URLs to compare.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (onCompare) {
        onCompare({ url1: validUrl1, url2: validUrl2 });
    } else {
        const encodedUrl1 = encodeURIComponent(validUrl1);
        const encodedUrl2 = encodeURIComponent(validUrl2);
        router.push(`/compare/${encodedUrl1}/${encodedUrl2}`);
    }
  };

  const formContent = (
      <form onSubmit={handleCompare} className="flex flex-col w-full items-center space-y-4">
          <Input
              name="url1"
              type="text"
              placeholder="https://google.com"
              value={urls.url1}
              onChange={handleInputChange}
              className="h-12 text-base w-full"
              aria-label="First Website URL"
              disabled={isLoading}
              autoComplete="off"
          />
            <p className="text-lg font-bold text-muted-foreground">vs</p>
          <Input
              name="url2"
              type="text"
              placeholder="https://bing.com"
              value={urls.url2}
              onChange={handleInputChange}
              className="h-12 text-base w-full"
              aria-label="Second Website URL"
              disabled={isLoading}
              autoComplete="off"
          />
          <Button type="submit" size="lg" className="h-12 rounded-lg w-full mt-4" disabled={isLoading || !urls.url1 || !urls.url2}>
              {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : <Scale className="h-5 w-5" />}
              <span className="ml-2">{isDialog ? 'Update Comparison' : 'Compare Now'}</span>
          </Button>
      </form>
  );

  if (isDialog) {
    return formContent;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative w-full max-w-xl mx-auto"
    >
      <Card className="glass-card">
        <CardContent className="p-6">
            {formContent}
        </CardContent>
      </Card>
    </motion.div>
  );
}
