'use client';
import { useEffect } from 'react';
import { getDomainInfo } from '@/app/actions/get-additional-analysis';
import { DomainCard } from '@/components/analysis/domain-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Home, Search } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { type DomainHistoryItem, type DomainData } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { useParams } from 'next/navigation';

function DomainResultSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3 grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <Skeleton className="h-64 w-full" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </div>
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    )
}


export default function DomainResultPage() {
  const params = useParams<{ domain: string }>();
  const decodedDomain = decodeURIComponent(params.domain);
  const [domainInfo, setDomainInfo] = React.useState<DomainData | null | undefined>(undefined);
  const [, setHistory] = useLocalStorage<DomainHistoryItem[]>('webintel_domain_history', []);

  useEffect(() => {
    async function fetchDomainInfo() {
      const info = await getDomainInfo(decodedDomain);
      setDomainInfo(info);

      // Only add to history if the lookup was successful (info is not null/undefined)
      if (info) {
        setHistory(prevHistory => {
          const newHistory = prevHistory.filter(item => item.domain !== decodedDomain);
          newHistory.unshift({
            id: crypto.randomUUID(),
            domain: decodedDomain,
            createdAt: new Date().toISOString(),
          });
          return newHistory.slice(0, 50);
        });
      }
    }
    fetchDomainInfo();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedDomain]);


  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
            <div>
                 <h1 className="text-4xl font-bold">Domain Intelligence</h1>
                 <p className="text-muted-foreground text-lg">{decodedDomain}</p>
            </div>
            <div className='flex items-center gap-2'>
                <Button asChild variant="outline">
                    <a href={`https://${decodedDomain}`} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />
                        Visit Site
                    </a>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/domain-checker">
                    <Search className="mr-2 h-4 w-4" />
                    New Search
                    </Link>
                </Button>
            </div>
        </div>

      {domainInfo === undefined && <DomainResultSkeleton />}

      {domainInfo === null && (
        <Card className="w-full text-center glass-card">
            <CardHeader>
                <CardTitle>No Information Found</CardTitle>
                <CardDescription>We could not retrieve WHOIS information for this domain.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    This could be because the domain is not registered, has privacy protection enabled, or there was a temporary issue with the lookup service. Please check your API key if the issue persists.
                </p>
            </CardContent>
        </Card>
      )}

      {domainInfo && (
        <div className="grid gap-6">
            <DomainCard data={domainInfo} />
        </div>
      )}
    </div>
  );
}
