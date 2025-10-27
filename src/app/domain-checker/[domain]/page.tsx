
import { getDomainInfo } from '@/app/actions/get-additional-analysis';
import { DomainCard } from '@/components/analysis/domain-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Home, Search } from 'lucide-react';
import Link from 'next/link';

export default async function DomainResultPage({ params }: { params: { domain: string } }) {
  const decodedDomain = decodeURIComponent(params.domain);
  const domainInfo = await getDomainInfo(decodedDomain);

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

      {domainInfo ? (
        <div className="grid gap-6">
            <DomainCard data={domainInfo} />
        </div>
      ) : (
        <Card className="w-full text-center glass-card">
            <CardHeader>
                <CardTitle>No Information Found</CardTitle>
                <CardDescription>We could not retrieve WHOIS information for this domain.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    This could be because the domain is not registered, the registrar has privacy protection enabled, or there was a temporary issue with the lookup service.
                </p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
