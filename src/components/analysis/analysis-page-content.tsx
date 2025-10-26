
'use client';

import { Suspense, useEffect, useState, useMemo, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, RefreshCw, Download } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { type AnalysisResult } from '@/lib/types';
import { getFastAnalysis, getPerformanceAnalysis } from '@/app/actions/analyze';
import { AnalysisDashboard } from '@/components/analysis/analysis-dashboard';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Compass } from 'lucide-react';

function ErrorAlert({title, description}: {title: string, description: string}) {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    );
}

export function AnalysisPageContent({ decodedUrl }: { decodedUrl: string }) {
    const [key, setKey] = useState(Date.now());
    const reportRef = useRef<HTMLDivElement>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPdf = async () => {
        const element = reportRef.current;
        if (!element) return;
        
        setIsDownloading(true);

        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'pt',
            format: 'a4'
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const margin = 40;

        try {
            const canvas = await html2canvas(element, {
                scale: 2, 
                useCORS: true,
                backgroundColor: window.getComputedStyle(document.body).backgroundColor,
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = pdfWidth - margin * 2;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 80; // Start below header

            // --- PDF Header ---
            pdf.saveGraphicsState();
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(20);
            pdf.setTextColor('#29ABE2'); // Primary color
            pdf.text('WebIntel Analysis Report', margin, 40);

            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor('#1A2A3A'); // Muted foreground
            pdf.text(new URL(decodedUrl).hostname, margin, 55);
            pdf.restoreGraphicsState();
            // --- End Header ---

            pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
            heightLeft -= (pdfHeight - position - margin);

            let page = 1;

            while (heightLeft >= 0) {
                // --- PDF Footer for each page ---
                pdf.setFontSize(8);
                pdf.setTextColor('#888888');
                pdf.text(`Page ${page}`, pdfWidth / 2, pdfHeight - margin / 2, { align: 'center' });
                pdf.text(`Report generated on ${new Date().toLocaleDateString()}`, margin, pdfHeight - margin / 2);
                // --- End Footer ---
                
                position = -imgHeight + heightLeft;
                pdf.addPage();
                page++;
                
                // Re-add header on new pages
                pdf.saveGraphicsState();
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(20);
                pdf.setTextColor('#29ABE2');
                pdf.text('WebIntel Analysis Report', margin, 40);

                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(10);
                pdf.setTextColor('#1A2A3A');
                pdf.text(new URL(decodedUrl).hostname, margin, 55);
                pdf.restoreGraphicsState();
                // --- End Header ---

                pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
            
            // --- Footer on the last page ---
            pdf.setFontSize(8);
            pdf.setTextColor('#888888');
            pdf.text(`Page ${page}`, pdfWidth / 2, pdfHeight - margin / 2, { align: 'center' });
            pdf.text(`Report generated on ${new Date().toLocaleDateString()}`, margin, pdfHeight - margin / 2);
            // --- End Footer ---


            pdf.save(`webintel-report-${new URL(decodedUrl).hostname}.pdf`);

        } catch (error) {
            console.error("Failed to generate PDF", error);
        } finally {
            setIsDownloading(false);
        }
    };
    
    return (
        <div className="flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Analysis Report</h1>
                    <p className="text-muted-foreground">
                        Results for: <a href={decodedUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{decodedUrl}</a>
                    </p>
                </div>
                <div className='flex items-center gap-2'>
                    <Button variant="outline" onClick={() => setKey(Date.now())} disabled={isDownloading}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Re-analyze
                    </Button>
                    <Button onClick={handleDownloadPdf} disabled={isDownloading}>
                         {isDownloading ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                         ) : (
                            <Download className="mr-2 h-4 w-4" />
                         )}
                        Download PDF
                    </Button>
                </div>
            </div>
            <div ref={reportRef} className="bg-background p-4 rounded-xl">
                <AnalysisData url={decodedUrl} cacheKey={key} />
            </div>
        </div>
    );
}

type PerformancePromise = ReturnType<typeof getPerformanceAnalysis>;

function AnalysisData({ url, cacheKey }: { url: string; cacheKey: number }) {
  const [analysisResult, setAnalysisResult] = useState<Partial<AnalysisResult> | null>(null);
  const [performancePromise, setPerformancePromise] = useState<PerformancePromise | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        setIsLoading(true);
        setError(null);
        setAnalysisResult(null);
        setPerformancePromise(null);
        try {
            const data = await getFastAnalysis(url);
            if ('error' in data) {
                setError(data.error);
            } else {
                setAnalysisResult(data);
                // Set the performance promise *after* the fast analysis is complete
                setPerformancePromise(getPerformanceAnalysis(url));
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [url, cacheKey]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return <ErrorAlert title="Analysis Failed" description={error} />;
  }
  
  if (analysisResult && performancePromise) {
    return (
      <Suspense fallback={<DashboardSkeleton />}>
        <AnalysisDashboard 
          initialData={analysisResult} 
          performancePromise={performancePromise}
        />
      </Suspense>
    );
  }

  return null;
}

function DashboardSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <Skeleton className="h-56 rounded-xl lg:col-span-4" />
      <Skeleton className="h-80 rounded-xl lg:col-span-4" />
      <Skeleton className="h-48 rounded-xl lg:col-span-2" />
      <Skeleton className="h-48 rounded-xl lg:col-span-2" />
      <Skeleton className="h-96 rounded-xl lg:col-span-4" />
      <Skeleton className="h-64 rounded-xl lg:col-span-2" />
      <Skeleton className="h-64 rounded-xl lg:col-span-2" />
    </div>
  );
}
