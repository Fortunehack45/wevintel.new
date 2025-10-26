'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export function UrlForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!url) return;
    setIsLoading(true);

    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    try {
      const urlObject = new URL(cleanUrl);
      const encodedUrl = encodeURIComponent(urlObject.href);
      
      // We no longer call analyzeUrl here. We navigate directly.
      // The analysis and saving will happen on the analysis page.
      router.push(`/analysis/${encodedUrl}`);

    } catch (error) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL, e.g., https://example.com",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl mx-auto items-center space-x-2">
      <Input
        type="text"
        placeholder="https://example.com"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="h-12 text-base"
        aria-label="Website URL"
        disabled={isLoading}
      />
      <Button type="submit" size="lg" className="h-12" disabled={isLoading || !url}>
        {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        ) : <Search className="h-5 w-5 md:mr-2" />}
        <span className="hidden md:inline">Analyze</span>
      </Button>
    </form>
  );
}
