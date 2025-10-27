
import { getDomainInfo } from '@/app/actions/get-additional-analysis';
import { DomainCard } from '@/components/analysis/domain-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Home } from 'lucide-react';
import Link from 'next/link';

export default async function DomainResultPage({ params }: { params: { domain: string } }) {
  const decodedDomain = decodeURIComponent(params.domain);
  const domainInfo = await getDomainInfo(decodedDomain);

  return (
    <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
            <div>
                 <h1 className="text-4xl font-bold">Domain Details</h1>
                 <p className="text-muted-foreground text-lg">{decodedDomain}</p>
            </div>
            <Button asChild variant="outline">
                <Link href="/domain-checker">
                <Home className="mr-2 h-4 w-4" />
                New Search
                </Link>
            </Button>
        </div>

      {domainInfo ? (
        <DomainCard data={domainInfo} />
      ) : (
        <Card className="w-full text-center">
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
