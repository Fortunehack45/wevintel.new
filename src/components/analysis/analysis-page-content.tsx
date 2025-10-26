

'use client';

import { Suspense, useEffect, useState, useMemo, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, RefreshCw, Download, Home } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { type AnalysisResult, type AuditItem, AuditInfo } from '@/lib/types';
import { getFastAnalysis, getPerformanceAnalysis } from '@/app/actions/analyze';
import { AnalysisDashboard } from '@/components/analysis/analysis-dashboard';
import jsPDF from 'jspdf';
import { useRouter } from 'next/navigation';
import { NotFoundCard } from './not-found-card';

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
    const router = useRouter();


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

            const addPageFooter = () => {
                const pageCount = pdf.internal.pages.length;
                const generationTime = new Date().toLocaleString();
                for (let i = 1; i <= pageCount; i++) {
                    pdf.setPage(i);
                    pdf.setFontSize(8);
                    pdf.setTextColor(mutedColor);
                    pdf.text(`Page ${i} of ${pageCount}`, pdfWidth / 2, pdfHeight - 20, { align: 'center' });
                    pdf.text(`Report generated on ${generationTime}`, margin, pdfHeight - 20);
                }
            };

            const checkAndAddPage = () => {
                if (currentY > pdfHeight - 60) {
                    pdf.addPage();
                    addPageHeader(data.overview.domain);
                }
            };
            
            const addSectionTitle = (title: string) => {
                checkAndAddPage();
                currentY += (currentY === 60 ? 0 : 20); // Add extra space between sections
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(14);
                pdf.setTextColor(textColor);
                pdf.text(title, margin, currentY);
                currentY += 20;
            };

            const addKeyValue = (key: string, value: string | number | boolean | undefined | null) => {
                if (value === undefined || value === null) return;
                checkAndAddPage();
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(10);
                pdf.setTextColor(textColor);
                const splitKey = pdf.splitTextToSize(key, contentWidth * 0.3);
                pdf.text(splitKey, margin + 10, currentY);
                
                pdf.setFont('helvetica', 'normal');
                const splitValue = pdf.splitTextToSize(String(value), contentWidth * 0.6);
                pdf.text(splitValue, margin + 150, currentY);
                currentY += Math.max(splitKey.length, splitValue.length) * 12 + 6;
            };
            
            const addAuditList = (title: string, audits: AuditInfo | undefined) => {
                if (!audits) return;
                const auditItems = Object.values(audits);
                if (auditItems.length === 0) return;
                
                addSectionTitle(title);
                
                auditItems.forEach(audit => {
                    const scoreText = audit.score !== null ? ` (Score: ${Math.round(audit.score * 100)})` : ' (Informational)';
                    const statusColor = audit.score === null ? textColor : audit.score >= 0.9 ? '#22c55e' : '#ef4444';
                    
                    checkAndAddPage();
                    pdf.setFont('helvetica', 'bold');
                    pdf.setFontSize(10);
                    pdf.setTextColor(statusColor);
                    const titleText = `${audit.title}${scoreText}`;
                    const splitTitle = pdf.splitTextToSize(titleText, contentWidth);
                    pdf.text(splitTitle, margin, currentY);
                    currentY += splitTitle.length * 12;

                    pdf.setFont('helvetica', 'normal');
                    pdf.setFontSize(9);
                    pdf.setTextColor(mutedColor);
                    const description = audit.description.replace(/\[(.*?)\]\(.*?\)/g, '$1');
                    const splitDescription = pdf.splitTextToSize(description, contentWidth);
                    pdf.text(splitDescription, margin + 10, currentY);
                    currentY += splitDescription.length * 10 + 10;
                });
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
            pdf.text(`Generated on: ${new Date().toLocaleString()}`, pdfWidth / 2, pdfHeight / 2 + 30, { align: 'center'});

            // --- Start Content Pages ---
            pdf.addPage();
            addPageHeader(data.overview.domain);

            // --- Overview Section ---
            addSectionTitle('Website Overview');
            addKeyValue('URL', data.overview.url);
            addKeyValue('Title', data.overview.title);
            addKeyValue('Description', data.overview.description);
            addKeyValue('Language', data.overview.language?.toUpperCase());

            const drawScoreCircle = (x: number, y: number, score: number, label: string) => {
                 const radius = 25;
                 pdf.setLineWidth(4);
                 
                 pdf.setDrawColor(lightGrayColor);
                 pdf.circle(x, y, radius, 'S');

                 const getScoreColor = (s: number) => s >= 90 ? '#22c55e' : s >= 50 ? '#f59e0b' : '#ef4444';
                 const scoreColor = getScoreColor(score);
                 pdf.setDrawColor(scoreColor);
                 
                 if (score > 0) {
                    const angle = (score / 100) * 360;
                    const startAngle = -90;
                    
                    const steps = 36;
                    const dAngle = angle / steps;

                    for (let i = 0; i < steps; i++) {
                        const a1 = (startAngle + i * dAngle) * Math.PI / 180;
                        const a2 = (startAngle + (i+1) * dAngle) * Math.PI / 180;
                        pdf.line(x + radius * Math.cos(a1), y + radius * Math.sin(a1), x + radius * Math.cos(a2), y + radius * Math.sin(a2));
                    }
                 }
                 
                 pdf.setFont('helvetica', 'bold');
                 pdf.setFontSize(14);
                 pdf.setTextColor(scoreColor);
                 pdf.text(String(score), x, y + 5, { align: 'center' });

                 pdf.setFont('helvetica', 'normal');
                 pdf.setFontSize(8);
                 pdf.setTextColor(mutedColor);
                 pdf.text(label, x, y + radius + 15, { align: 'center' });
            };

            // --- Performance Section ---
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
                currentY += 100;
                
                checkAndAddPage();
                addKeyValue('Largest Contentful Paint', data.performance.mobile.largestContentfulPaint);
                addKeyValue('Cumulative Layout Shift', data.performance.mobile.cumulativeLayoutShift);
                addKeyValue('Speed Index', data.performance.mobile.speedIndex);
                addKeyValue('Total Blocking Time', data.performance.mobile.totalBlockingTime);
            }

            // --- Total Audit Score ---
            const allAudits: (AuditInfo | undefined)[] = [data.performanceAudits, data.securityAudits, data.diagnosticsAudits];
            let totalScore = 0;
            let scoreCount = 0;
            allAudits.forEach(auditInfo => {
              if (auditInfo) {
                Object.values(auditInfo).forEach(audit => {
                  if (audit.score !== null) {
                    totalScore += audit.score;
                    scoreCount++;
                  }
                });
              }
            });
            const totalAuditScore = scoreCount > 0 ? Math.round((totalScore / scoreCount) * 100) : null;
            if (totalAuditScore !== null) {
                addSectionTitle('Overall Audit Score');
                drawScoreCircle(pdfWidth / 2, currentY + 40, totalAuditScore, 'Total Audit Score');
                currentY += 100;
            }


            // --- Security Section ---
            if (data.security) {
                addSectionTitle('Security');
                addKeyValue('SSL Enabled', data.security.isSecure ? 'Yes' : 'No');
                Object.entries(data.security.securityHeaders).forEach(([key, value]) => {
                    addKeyValue(key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), value ? 'Present' : 'Missing');
                });
            }
            
            // --- Hosting Section ---
            if (data.hosting) {
                addSectionTitle('Hosting');
                addKeyValue('IP Address', data.hosting.ip);
                addKeyValue('ISP', data.hosting.isp);
                addKeyValue('Country', data.hosting.country);
            }
            
            // --- Metadata Section ---
            if (data.metadata) {
                addSectionTitle('Metadata & SEO');
                addKeyValue('robots.txt present', data.metadata.hasRobotsTxt ? 'Yes' : 'No');
                addKeyValue('sitemap.xml present', data.metadata.hasSitemapXml ? 'Yes' : 'No');
                
                const ogTags = Object.entries(data.metadata.openGraphTags);
                if (ogTags.length > 0) {
                    currentY += 10;
                    pdf.setFont('helvetica', 'bold');
                    pdf.text('Open Graph Tags:', margin, currentY);
                    currentY += 15;
                    ogTags.forEach(([key, value]) => {
                        addKeyValue(`og:${key}`, value);
                    });
                }
            }
            
            // --- Audits Sections ---
            addAuditList('Performance & Optimization Audits', data.performanceAudits);
            addAuditList('Security Audits', data.securityAudits);
            addAuditList('Diagnostics & Best Practices', data.diagnosticsAudits);


            // --- Headers Section ---
            if (data.headers) {
                const headers = Object.entries(data.headers);
                if (headers.length > 0) {
                    addSectionTitle('HTTP Response Headers');
                    headers.forEach(([key, value]) => {
                       addKeyValue(key, value);
                    });
                }
            }


            // --- Finalize Pages ---
            addPageFooter();

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
                    <Button variant="outline" onClick={() => router.push('/')} disabled={isDownloading}>
                        <Home className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
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

function AnalysisData({ url, cacheKey, onDataLoaded }: { url: string; cacheKey: number, onDataLoaded: (data: AnalysisResult | null) => void; }) {
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
                    },
                    security: {
                        ...data.security,
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
    if (error === 'Domain not found. The website is not reachable.') {
        return <NotFoundCard url={url} />;
    }
    return <ErrorAlert title="Analysis Failed" description={error} />;
  }
  
  if (analysisResult && performancePromise) {
    return (
      <Suspense fallback={<DashboardSkeleton />}>
        <AnalysisDashboard 
          initialData={analysisResult} 
          performancePromise={performancePromise}
          onDataLoaded={onDataLoaded as (data: AnalysisResult) => void}
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

    
