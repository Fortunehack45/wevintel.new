
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileSearch } from 'lucide-react';

export function NotFoundCard({ url, message }: { url: string; message?: string }) {
  let hostname = "the site";
  try {
      hostname = new URL(url).hostname;
  } catch (e) {
      //
  }

  return (
    <Card className="glass-card text-center w-full max-w-2xl mx-auto mt-10">
        <CardHeader>
            <CardTitle className="text-3xl font-bold">Analysis Failed</CardTitle>
            <CardDescription className="text-lg">
                We couldn't reach <span className="font-semibold text-primary">{hostname}</span>.
            </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
            <div className="w-48 h-48 flex items-center justify-center text-muted-foreground/20">
                <FileSearch className="h-32 w-32" />
            </div>
            <p className="mt-4 text-muted-foreground">
                {message || "This could be because the domain is incorrect, the site is temporarily down, or it doesn't exist. Please check the URL and try again."}
            </p>
        </CardContent>
    </Card>
  );
}
