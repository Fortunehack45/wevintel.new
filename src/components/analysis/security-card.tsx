
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { SecurityData, AuditInfo, AuditItem } from '@/lib/types';
import { ShieldCheck, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-muted-foreground';
    if (score >= 0.9) return 'text-green-500';
    if (score >= 0.5) return 'text-yellow-500';
    return 'text-red-500';
}

const getScoreIcon = (score: number | null) => {
    if (score === null) return <AlertCircle className="h-4 w-4" />;
    if (score >= 0.9) return <CheckCircle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
}

const AuditList = ({ audits }: { audits: AuditItem[] }) => {
    if (audits.length === 0) {
        return null;
    }

    return (
        <div className="rounded-md border mt-4">
            <Accordion type="single" collapsible className="w-full">
                {audits.map((audit) => (
                    <AccordionItem value={audit.id} key={audit.id}>
                        <AccordionTrigger className="p-3 text-xs font-medium hover:no-underline">
                            <div className="flex items-center gap-2 text-left flex-1">
                                <div className={getScoreColor(audit.score)}>
                                    {getScoreIcon(audit.score)}
                                </div>
                                <span className="flex-1">{audit.title}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-3 text-muted-foreground">
                           {audit.description.replace(/\[(.*?)\]\(.*?\)/g, '$1')}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};


export function SecurityCard({ data, audits }: { data?: SecurityData, audits?: AuditInfo }) {
  if (!data) {
    return (
      <Card className="h-full">
        <CardHeader>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }
  
  
  const securityHeaders = [
      { key: 'content-security-policy', name: 'CSP'},
      { key: 'strict-transport-security', name: 'HSTS'},
      { key: 'x-frame-options', name: 'X-Frame-Options'},
      { key: 'x-content-type-options', name: 'X-Content-Type'},
  ];
  
  const auditItems = audits ? Object.values(audits) : [];
  
  const securityScore = data.securityScore;

  const getScoreBadgeVariant = (score: number | null | undefined): "destructive" | "secondary" | "default" => {
    if (score === null || score === undefined) return "secondary";
    if (score < 50) return "destructive";
    if (score < 90) return "secondary";
    return "default";
  }

  return (
    <Card className="h-full glass-card">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Security
                </CardTitle>
                <CardDescription>SSL, headers, and vulnerability checks.</CardDescription>
            </div>
            {securityScore !== undefined ? (
                <Badge variant={getScoreBadgeVariant(securityScore)} className={getScoreBadgeVariant(securityScore) === 'default' ? 'bg-green-500/20 text-green-700 border-green-300' : ''}>
                    {securityScore}%
                </Badge>
            ) : (
                <Badge variant="secondary">N/A</Badge>
            )}
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">SSL Connection</span>
          {data.isSecure ? <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">Secure</Badge> : <Badge variant="destructive">Insecure</Badge>}
        </div>
        
        <div>
            <p className="font-semibold mb-2">HTTP Security Headers</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {securityHeaders.map(header => (
                    <div key={header.key} className="flex justify-between items-center">
                        <span className="text-muted-foreground">{header.name}</span>
                        {data.securityHeaders?.[header.key as keyof typeof data.securityHeaders] ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    </div>
                ))}
            </div>
        </div>
        
        {audits === undefined ? (
            <Skeleton className="h-24 w-full" />
        ) : auditItems.length > 0 && (
            <div>
                <p className="font-semibold mb-2">Additional Security Audits</p>
                <AuditList audits={auditItems} />
            </div>
        )}
        
      </CardContent>
    </Card>
  );
}
