
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
    const [isDownloading, setIsDownloading] = useState(false);
    const [analysisDataForPdf, setAnalysisDataForPdf] = useState<AnalysisResult | null>(null);

    const handleDownloadPdf = async () => {
        if (!analysisDataForPdf) return;
        
        setIsDownloading(true);

        const generatePdfFromData = (data: AnalysisResult) => {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'pt',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 40;
            const contentWidth = pdfWidth - margin * 2;
            let currentY = 0;
            const primaryColor = '#3b82f6';
            const textColor = '#374151';
            const mutedColor = '#6b7280';
            const whiteColor = '#ffffff';
            const lightGrayColor = '#f3f4f6';
            
            // Helper functions
            const addPageHeader = (title: string) => {
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(10);
                pdf.setTextColor(mutedColor);
                pdf.text(title, margin, 30);
                pdf.setDrawColor(lightGrayColor);
                pdf.line(margin, 35, pdfWidth - margin, 35);
                currentY = 60;
            };

            const addPageFooter = (pageNumber: number) => {
                const generationTime = new Date().toLocaleString();
                pdf.setFontSize(8);
                pdf.setTextColor(mutedColor);
                pdf.text(`Page ${pageNumber}`, pdfWidth / 2, pdfHeight - 20, { align: 'center' });
                pdf.text(`Report generated on ${generationTime}`, margin, pdfHeight - 20);
            };

            const checkAndAddPage = () => {
                if (currentY > pdfHeight - 60) {
                    addPageFooter(pdf.internal.pages.length);
                    pdf.addPage();
                    addPageHeader(data.overview.domain);
                }
            };
            
            const addSectionTitle = (title: string) => {
                checkAndAddPage();
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(14);
                pdf.setTextColor(textColor);
                pdf.text(title, margin, currentY);
                currentY += 20;
            };

            const addKeyValue = (key: string, value: string | undefined | null) => {
                if (!value) return;
                checkAnd.addPage();
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(10);
                pdf.setTextColor(textColor);
                pdf.text(key, margin + 10, currentY, { maxWidth: contentWidth * 0.4 });
                
                pdf.setFont('helvetica', 'normal');
                pdf.text(String(value), margin + 150, currentY, { maxWidth: contentWidth * 0.6 });
                currentY += 18;
            };

            // --- Cover Page ---
            pdf.setFillColor(primaryColor);
            pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
            
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(28);
            pdf.setTextColor(whiteColor);
            pdf.text('WebIntel Analysis Report', pdfWidth / 2, pdfHeight / 2 - 40, { align: 'center' });

            pdf.setFontSize(16);
            pdf.text(data.overview.domain, pdfWidth / 2, pdfHeight / 2, { align: 'center' });

            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.text(`Generated on: ${new Date().toUTCString()}`, pdfWidth / 2, pdfHeight / 2 + 20, { align: 'center'});

            // --- Start Content Pages ---
            pdf.addPage();
            addPageHeader(data.overview.domain);

            // --- Overview Section ---
            addSectionTitle('Website Overview');
            addKeyValue('URL', data.overview.url);
            addKeyValue('Title', data.overview.title);
            addKeyValue('Description', data.overview.description);
            addKeyValue('Language', data.overview.language?.toUpperCase());
            currentY += 20;

            // --- Performance Section ---
            const drawScoreCircle = (x: number, y: number, score: number, label: string) => {
                 const radius = 25;
                 pdf.setLineWidth(4);
                 pdf.setDrawColor(lightGrayColor);
                 pdf.circle(x, y, radius);
                 pdf.stroke();

                 const getScoreColor = (s: number) => s >= 90 ? '#22c55e' : s >= 50 ? '#f59e0b' : '#ef4444';
                 const scoreColor = getScoreColor(score);
                 pdf.setDrawColor(scoreColor);
                 const angle = (score / 100) * 360;
                 pdf.path([
                    { op: 'b', c: [x + radius, y, x + radius, y, x + radius, y] }
                 ]).arc(x, y, radius, 0, angle, false).stroke();

                 pdf.setFont('helvetica', 'bold');
                 pdf.setFontSize(14);
                 pdf.setTextColor(scoreColor);
                 pdf.text(String(score), x, y + 5, { align: 'center' });

                 pdf.setFont('helvetica', 'normal');
                 pdf.setFontSize(8);
                 pdf.setTextColor(mutedColor);
                 pdf.text(label, x, y + radius + 15, { align: 'center' });
            };

            if (data.performance) {
                addSectionTitle('Core Web Vitals & Performance Scores');
                const scores = [
                    { score: data.performance.mobile.performanceScore, label: 'Performance (Mobile)' },
                    { score: data.performance.mobile.accessibilityScore, label: 'Accessibility (Mobile)' },
                    { score: data.performance.mobile.seoScore, label: 'SEO (Mobile)' },
                    { score: data.performance.desktop.performanceScore, label: 'Performance (Desktop)' }
                ].filter(s => typeof s.score === 'number');

                const circleXStart = margin + 30;
                const circleY = currentY + 40;
                const spacing = (contentWidth - 60) / (scores.length > 1 ? scores.length - 1 : 1);

                scores.forEach((s, i) => {
                    drawScoreCircle(circleXStart + (i * spacing), circleY, s.score!, s.label);
                });
                currentY += 120;

                checkAndAddPage();
                addKeyValue('Largest Contentful Paint', data.performance.mobile.largestContentfulPaint);
                addKeyValue('Cumulative Layout Shift', data.performance.mobile.cumulativeLayoutShift);
                addKeyValue('Speed Index', data.performance.mobile.speedIndex);
                addKeyValue('Total Blocking Time', data.performance.mobile.totalBlockingTime);
                currentY += 20;
            }

            // --- Security Section ---
            if (data.security) {
                checkAndAddPage();
                addSectionTitle('Security');
                addKeyValue('SSL Enabled', data.security.isSecure ? 'Yes' : 'No');
                Object.entries(data.security.securityHeaders).forEach(([key, value]) => {
                    addKeyValue(key, value ? 'Present' : 'Missing');
                });
                currentY += 20;
            }
            
            // --- Hosting Section ---
            if (data.hosting) {
                checkAndAddPage();
                addSectionTitle('Hosting');
                addKeyValue('IP Address', data.hosting.ip);
                addKeyValue('ISP', data.hosting.isp);
                addKeyValue('Country', data.hosting.country);
                currentY += 20;
            }

            // --- Finalize Pages ---
            for (let i = 1; i <= pdf.internal.pages.length; i++) {
                pdf.setPage(i);
                addPageFooter(i);
            }

            try {
                pdf.save(`webintel-report-${new URL(decodedUrl).hostname}.pdf`);
            } catch (error) {
                 console.error("Failed to generate PDF", error);
            }
        }

        try {
            generatePdfFromData(analysisDataForPdf);
        } catch (error) {
            console.error("PDF generation failed:", error);
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
                    <Button onClick={handleDownloadPdf} disabled={isDownloading || !analysisDataForPdf}>
                         {isDownloading ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                         ) : (
                            <Download className="mr-2 h-4 w-4" />
                         )}
                        Download PDF
                    </Button>
                </div>
            </div>
            <AnalysisData 
              url={decodedUrl} 
              cacheKey={key} 
              onDataLoaded={setAnalysisDataForPdf} 
            />
        </div>
    );
}

type PerformancePromise = ReturnType<typeof getPerformanceAnalysis>;

function AnalysisData({ url, cacheKey, onDataLoaded }: { url: string; cacheKey: number, onDataLoaded: (data: AnalysisResult) => void; }) {
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
        onDataLoaded(null!);
        try {
            const data = await getFastAnalysis(url);
            if ('error' in data) {
                setError(data.error);
            } else {
                setAnalysisResult(data);
                // Set the performance promise *after* the fast analysis is complete
                const perfPromise = getPerformanceAnalysis(url);
                setPerformancePromise(perfPromise);

                perfPromise.then(perfData => {
                  const fullData = {
                    ...data,
                    ...perfData,
                    overview: {
                      ...data.overview,
                      ...perfData.overview,
                    },
                    metadata: {
                      ...data.metadata,
                      hasRobotsTxt: perfData.metadata.hasRobotsTxt,
                    }
                  } as AnalysisResult;
                  onDataLoaded(fullData);
                });
            }
        } catch (error: any) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }
    fetchData();
  }, [url, cacheKey, onDataLoaded]);

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
          onDataLoaded={onDataLoaded}
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
