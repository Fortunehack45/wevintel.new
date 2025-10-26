
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { AuditInfo } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SlidersHorizontal, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '../ui/badge';

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

export function AuditsCard({ data }: { data: AuditInfo }) {
  const audits = Object.values(data);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-primary" />
          Performance Audits
        </CardTitle>
        <CardDescription>Detailed metrics and opportunities from Lighthouse.</CardDescription>
      </CardHeader>
      <CardContent>
        {audits.length > 0 ? (
          <ScrollArea className="h-72 rounded-md border">
            <Accordion type="single" collapsible className="w-full">
                {audits.map((audit) => (
                    <AccordionItem value={audit.title} key={audit.title}>
                        <AccordionTrigger className="p-4 text-sm font-medium hover:no-underline">
                            <div className="flex items-center gap-3 text-left">
                                <div className={getScoreColor(audit.score)}>
                                    {getScoreIcon(audit.score)}
                                </div>
                                <span className="flex-1">{audit.title}</span>
                                {audit.displayValue && <Badge variant="outline">{audit.displayValue}</Badge>}
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 text-muted-foreground">
                           {audit.description.replace(/\[(.*?)\]\(.*?\)/g, '$1')}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
          </ScrollArea>
        ) : <p className="text-muted-foreground text-sm">No detailed audit information was found.</p>}
      </CardContent>
    </Card>
  );
}
