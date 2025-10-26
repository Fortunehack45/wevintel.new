
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { AuditItem, AuditInfo } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SlidersHorizontal, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '../ui/skeleton';

const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-muted-foreground';
    if (score >= 90) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
}

const getScoreIcon = (score: number | null) => {
    if (score === null) return <AlertCircle className="h-4 w-4" />;
    if (score >= 90) return <CheckCircle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
}

const AuditList = ({ audits }: { audits: AuditItem[] }) => {
    if (audits.length === 0) {
        return <p className="text-muted-foreground text-sm p-4 text-center">No audits in this category.</p>;
    }

    return (
        <div className="rounded-md border">
            <Accordion type="single" collapsible className="w-full">
                {audits.map((audit) => {
                    const score100 = audit.score !== null ? Math.round(audit.score * 100) : null;
                    return (
                        <AccordionItem value={audit.title} key={audit.title}>
                            <AccordionTrigger className="p-4 text-sm font-medium hover:no-underline">
                                <div className="flex items-center gap-3 text-left flex-1">
                                    <div className={getScoreColor(score100)}>
                                        {getScoreIcon(score100)}
                                    </div>
                                    <span className="flex-1">{audit.title}</span>
                                    {audit.displayValue && <Badge variant="outline">{audit.displayValue}</Badge>}
                                </div>
                                {score100 !== null && (
                                    <div className={`text-sm font-bold ml-4 ${getScoreColor(score100)}`}>
                                        {score100}%
                                    </div>
                                )}
                            </AccordionTrigger>
                            <AccordionContent className="px-4 pb-4 text-muted-foreground">
                               {audit.description.replace(/\[(.*?)\]\(.*?\)/g, '$1')}
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </div>
    );
};


export function AuditsCard({ data }: { data?: AuditInfo }) {

  if (!data) {
    return (
      <Card className="h-full glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-primary" />
            Performance Audits
          </CardTitle>
          <CardDescription>Detailed metrics and opportunities from Lighthouse.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 py-4">
              <div className="flex space-x-1">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-8 w-1/2" />
              </div>
              <Skeleton className="h-72 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const allAudits = Object.values(data);
  const opportunities = allAudits.filter(audit => audit.score !== null && audit.score < 0.9);
  const passed = allAudits.filter(audit => audit.score !== null && audit.score >= 0.9);
  const informational = allAudits.filter(audit => audit.score === null);


  return (
    <Card className="h-full glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          Performance Audits
        </CardTitle>
        <CardDescription>Detailed metrics and opportunities from Lighthouse.</CardDescription>
      </CardHeader>
      <CardContent>
        {allAudits.length > 0 ? (
          <Tabs defaultValue="opportunities" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="opportunities">Opportunities ({opportunities.length})</TabsTrigger>
              <TabsTrigger value="passed">Passed Audits ({passed.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="opportunities" className="mt-4">
              <ScrollArea className="h-[450px]">
                <AuditList audits={[...opportunities, ...informational]} />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="passed" className="mt-4">
              <ScrollArea className="h-[450px]">
                <AuditList audits={passed} />
              </ScrollArea>
            </TabsContent>
          </Tabs>
        ) : <p className="text-muted-foreground text-sm">No detailed audit information was found.</p>}
      </CardContent>
    </Card>
  );
}
