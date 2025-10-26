import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { SecurityData } from '@/lib/types';
import { ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function SecurityCard({ data }: { data: SecurityData }) {
  const getGradeColor = (grade: string | undefined) => {
    if (!grade) return 'secondary';
    if (grade.startsWith('A')) return 'default';
    if (grade.startsWith('B') || grade.startsWith('C')) return 'secondary';
    return 'destructive';
  }

  return (
    <Card className="glass-card h-full">
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
          {data.isSecure ? <Badge className="bg-green-500/20 text-green-300 border-green-500/30 hover:bg-green-500/30">Secure</Badge> : <Badge variant="destructive">Insecure</Badge>}
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">SSL Grade</span>
          <Badge variant={getGradeColor(data.sslGrade)}>{data.sslGrade || 'N/A'}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Headers Grade</span>
          <Badge variant={getGradeColor(data.securityHeadersGrade)}>{data.securityHeadersGrade || 'N/A'}</Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Domain Expiry</span>
          <span className="font-semibold">{data.domainExpiry ? new Date(data.domainExpiry).toLocaleDateString() : 'N/A'}</span>
        </div>
      </CardContent>
    </Card>
  );
}
