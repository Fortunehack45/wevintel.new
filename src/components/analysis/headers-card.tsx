import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { HeaderInfo } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ListTree } from 'lucide-react';

export function HeadersCard({ data }: { data: HeaderInfo }) {
  const headers = Object.entries(data);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListTree className="h-5 w-5 text-primary" />
          HTTP Headers
        </CardTitle>
        <CardDescription>Raw response headers from the server.</CardDescription>
      </CardHeader>
      <CardContent>
        {headers.length > 0 ? (
          <ScrollArea className="h-64 rounded-md border p-4">
            <div className="space-y-4 text-sm">
                {headers.map(([key, value]) => (
                    <div key={key} className="grid grid-cols-1 md:grid-cols-4 gap-1">
                        <p className="font-semibold text-muted-foreground break-words col-span-1">{key}:</p>
                        <p className="font-mono break-all col-span-3">{value}</p>
                    </div>
                ))}
            </div>
          </ScrollArea>
        ) : <p className="text-muted-foreground text-sm">No HTTP headers were found.</p>}
      </CardContent>
    </Card>
  );
}
