
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { AuditItem, AuditInfo } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Wrench, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '../ui/skeleton';

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
        return <p className="text-muted-foreground text-sm p-4 text-center">No audits in this category.</p>;
    }

    return (
        <ScrollArea className="h-[300px] rounded-md border">
             <div className="p-4 text-sm">
                {audits.map((audit) => (
                   <div key={audit.id} className="[&_p]:text-xs [&:not(:last-child)]:border-b [&:not(:last-child)]:pb-3 mb-3">
                        <div className="flex items-center gap-3 text-left flex-1">
                            <div className={getScoreColor(audit.score)}>
                                {getScoreIcon(audit.score)}
                            </div>
                            <span className="flex-1 font-medium">{audit.title}</span>
                            {audit.displayValue && <Badge variant="outline">{audit.displayValue}</Badge>}
                             {audit.score !== null && (
                                <div className={`text-sm font-bold ml-4 ${getScoreColor(audit.score)}`}>
                                    {Math.round(audit.score * 100)}
                                </div>
                            )}
                        </div>
                        <p className="pl-7 text-muted-foreground mt-1">
                            {audit.description.replace(/\[(.*?)\]\(.*?\)/g, '$1')}
                        </p>
                   </div>
                ))}
            </div>
        </ScrollArea>
    );
};


export function DiagnosticsCard({ data }: { data?: AuditInfo }) {

  if (!data) {
    return (
      <Card className="h-full glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5 text-primary" />
            Diagnostics & Best Practices
          </CardTitle>
          <CardDescription>Technical details and suggestions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 py-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-[300px] w-full mt-4" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const allAudits = Object.values(data);
  const withIssues = allAudits.filter(audit => audit.score !== null && audit.score < 1);
  const passed = allAudits.filter(audit => audit.score === 1);
  const informational = allAudits.filter(audit => audit.score === null);

  return (
    <Card className="h-full glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wrench className="h-5 w-5 text-primary" />
          Diagnostics & Best Practices
        </CardTitle>
        <CardDescription>Technical checks from Lighthouse.</CardDescription>
      </CardHeader>
      <CardContent>
        {allAudits.length > 0 ? (
            <AuditList audits={[...withIssues, ...informational, ...passed]} />
        ) : <p className="text-muted-foreground text-sm">No diagnostic information was found.</p>}
      </CardContent>
    </Card>
  );
}
