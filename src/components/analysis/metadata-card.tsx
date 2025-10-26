import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Metadata } from '@/lib/types';
import { Code, CheckCircle, XCircle } from 'lucide-react';

export function MetadataCard({ data }: { data: Metadata }) {
  const ogTags = Object.entries(data.openGraphTags);

  return (
    <Card className="glass-card h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5 text-primary" />
          Metadata
        </CardTitle>
        <CardDescription>Technical SEO and social sharing tags.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-2">
            robots.txt
          </span>
          {data.hasRobotsTxt ? <CheckCircle className="h-5 w-5 text-green-400" /> : <XCircle className="h-5 w-5 text-destructive" />}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground flex items-center gap-2">
            sitemap.xml
          </span>
          {data.hasSitemapXml ? <CheckCircle className="h-5 w-5 text-green-400" /> : <XCircle className="h-5 w-5 text-destructive" />}
        </div>
        <div>
            <p className="font-semibold mb-2">Open Graph Tags</p>
            {ogTags.length > 0 ? (
                <div className="space-y-2 text-xs max-h-32 overflow-y-auto">
                    {ogTags.map(([key, value]) => (
                        <div key={key} className="flex justify-between items-start gap-2">
                            <span className="text-muted-foreground break-words">{key}</span>
                            <span className="font-mono text-right break-all">{String(value)}</span>
                        </div>
                    ))}
                </div>
            ) : <p className="text-muted-foreground text-xs">No Open Graph tags found.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
