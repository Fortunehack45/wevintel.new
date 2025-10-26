import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { SecurityData } from '@/lib/types';
import { ShieldCheck, CheckCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function SecurityCard({ data }: { data: SecurityData }) {
  const getGradeColor = (grade: string | undefined) => {
    if (!grade) return 'secondary';
    if (grade.startsWith('A')) return 'default';
    if (grade.startsWith('B') || grade.startsWith('C')) return 'secondary';
    return 'destructive';
  }

  const securityHeaders = [
      { key: 'content-security-policy', name: 'CSP'},
      { key: 'strict-transport-security', name: 'HSTS'},
      { key: 'x-frame-options', name: 'X-Frame-Options'},
      { key: 'x-content-type-options', name: 'X-Content-Type'},
  ]

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" />
          Security
        </CardTitle>
        <CardDescription>SSL, headers, and domain status.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">SSL Connection</span>
          {data.isSecure ? <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-200">Secure</Badge> : <Badge variant="destructive">Insecure</Badge>}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Domain Expiry</span>
          <span className="font-semibold">{data.domainExpiry ? new Date(data.domainExpiry).toLocaleDateString() : 'N/A'}</span>
        </div>
        <div>
            <p className="font-semibold mb-2">Security Headers</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                {securityHeaders.map(header => (
                    <div key={header.key} className="flex justify-between items-center">
                        <span className="text-muted-foreground">{header.name}</span>
                        {data.securityHeaders?.[header.key as keyof typeof data.securityHeaders] ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                    </div>
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
