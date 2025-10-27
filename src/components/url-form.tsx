
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { type AnalysisResult } from '@/lib/types';
import { Card } from './ui/card';
import { ScrollingSuggestions } from './ScrollingSuggestions';
import { topSites } from '@/lib/top-sites';

export function UrlForm() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const [history] = useLocalStorage<AnalysisResult[]>('webintel_history', []);
  const [suggestions, setSuggestions] = useState<AnalysisResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [autoCompleteIndex, setAutoCompleteIndex] = useState(-1);
  const [scrollingSuggestionIndex, setScrollingSuggestionIndex] = useState(0);

  const formRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (url) {
      const filtered = history.filter(item => 
        item.overview.url.toLowerCase().includes(url.toLowerCase()) ||
        item.overview.domain.toLowerCase().includes(url.toLowerCase())
      ).slice(0, 5); // Limit to 5 suggestions
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [url, history]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const analyseUrl = (targetUrl: string) => {
    setIsLoading(true);

    let cleanUrl = targetUrl.trim();
    if (!/^(http|https):\/\//.test(cleanUrl)) {
      cleanUrl = `https://${cleanUrl}`;
    }

    try {
      const urlObject = new URL(cleanUrl);
      const encodedUrl = encodeURIComponent(urlObject.href);
      setShowSuggestions(false);
      setUrl('');
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    let targetUrl = url;

    // If a suggestion from the autocomplete dropdown is selected
    if (autoCompleteIndex > -1 && suggestions[autoCompleteIndex]) {
        targetUrl = suggestions[autoCompleteIndex].overview.url;
    } 
    // If the input is empty but a scrolling suggestion is visible
    else if (!targetUrl && topSites[scrollingSuggestionIndex]) {
        targetUrl = topSites[scrollingSuggestionIndex].url;
    }
    
    if (!targetUrl) return;
    
    analyseUrl(targetUrl);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setAutoCompleteIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setAutoCompleteIndex(prev => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    }
  }
  
  const handleSuggestionClick = (suggestionUrl: string) => {
      analyseUrl(suggestionUrl);
  }

  return (
     <motion.div 
        ref={formRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-xl mx-auto"
    >
        <Card className="p-2 rounded-xl shadow-lg border relative overflow-hidden">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2 relative z-10">
                <Input
                    type="text"
                    placeholder=""
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onFocus={() => url && suggestions.length > 0 && setShowSuggestions(true)}
                    onKeyDown={handleKeyDown}
                    className="h-12 text-base flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    aria-label="Website URL"
                    disabled={isLoading}
                    autoComplete="off"
                />
                <Button type="submit" size="lg" className="h-12 rounded-lg" disabled={isLoading && !url}>
                    {isLoading ? (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : <Search className="h-5 w-5" />}
                    <span className="hidden md:inline ml-2">Analyse</span>
                </Button>
            </form>
            <ScrollingSuggestions 
                isVisible={!url && !isLoading}
                onSuggestionChange={setScrollingSuggestionIndex}
            />
        </Card>
        {showSuggestions && suggestions.length > 0 && (
          <Card className="absolute top-full w-full mt-2 p-2 shadow-xl border z-20">
            <ul>
              {suggestions.map((item, index) => (
                <li
                  key={item.id}
                  className={`p-2 rounded-md cursor-pointer hover:bg-muted ${index === autoCompleteIndex ? 'bg-muted' : ''}`}
                  onClick={() => handleSuggestionClick(item.overview.url)}
                  onMouseEnter={() => setAutoCompleteIndex(index)}
                >
                  <p className="text-sm font-medium text-foreground">{item.overview.domain}</p>
                  <p className="text-xs text-muted-foreground truncate">{item.overview.url}</p>
                </li>
              ))}
            </ul>
          </Card>
        )}
    </motion.div>
  );
}
