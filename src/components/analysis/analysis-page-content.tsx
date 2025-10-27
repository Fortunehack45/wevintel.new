
'use client';

import { Suspense, useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Download, Home } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { type AnalysisResult, type AuditItem, AuditInfo, TrafficData, WebsiteOverview, SecurityData, HostingInfo, Metadata, HeaderInfo, AISummary, TechStackData, DomainData, StatusData } from '@/lib/types';
import { getPerformanceAnalysis } from '@/app/actions/analyze';
import { getAdditionalAnalysis } from '@/app/actions/get-additional-analysis';
import { AnalysisDashboard } from '@/components/analysis/analysis-dashboard';
import jsPDF from 'jspdf';
import { useRouter } from 'next/navigation';
import { DashboardSkeleton } from './dashboard-skeleton';
import { estimateTraffic } from '@/ai/flows/traffic-estimate-flow';
import { detectTechStack } from '@/ai/flows/tech-stack-flow';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { summarizeWebsite, WebsiteAnalysisInput } from '@/ai/flows/summarize-flow';


function ErrorAlert({title, description}: {title: string, description: string}) {
    return (
        <Alert variant="destructive">
            <RefreshCw className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    );
}

export function AnalysisPageContent({ decodedUrl, initialData }: { decodedUrl: string, initialData: Partial<AnalysisResult> }) {
    const [key, setKey] = useState(Date.now());
    const [isDownloading, setIsDownloading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(initialData as AnalysisResult);
    const [error, setError] = useState<string | null>(null);
    const [trafficCache, setTrafficCache] = useLocalStorage<Record<string, {data: TrafficData, timestamp: string}>>('webintel_traffic_cache', {});

    const router = useRouter();
    const isFetching = useRef(false);

    const getTrafficData = useCallback(async (url: string, description?: string): Promise<TrafficData> => {
        const cached = trafficCache[url];
        const now = new Date();
        
        if (cached && cached.timestamp) {
            const cachedDate = new Date(cached.timestamp);
            const oneMonth = 30 * 24 * 60 * 60 * 1000;
            if (now.getTime() - cachedDate.getTime() < oneMonth) {
                return cached.data;
            }
        }
        
        const freshData = await estimateTraffic({ url, description: description || '' });
        setTrafficCache(prev => ({
            ...prev,
            [url]: {
                data: freshData,
                timestamp: now.toISOString()
            }
        }));
        return freshData;
    }, [setTrafficCache, trafficCache]);

    const getSummaryData = useCallback(async (input: WebsiteAnalysisInput) => {
        return summarizeWebsite(input);
    }, []);

    const getTechStackData = useCallback(async (url: string, htmlContent: string, headers: HeaderInfo) => {
         return detectTechStack({ url, htmlContent, headers });
    }, []);


    useEffect(() => {
        const fetchRemainingAnalysis = async () => {
             if (!initialData || isFetching.current) return;
            
             isFetching.current = true;
            
            const aiSummaryInput: WebsiteAnalysisInput = {
                overview: initialData.overview!,
                security: initialData.security!,
                hosting: initialData.hosting!,
                headers: initialData.headers,
            };
            
            const [perfResult, summaryResult, trafficResult, techStackResult, additionalResult] = await Promise.allSettled([
                getPerformanceAnalysis(decodedUrl),
                getSummaryData(aiSummaryInput),
                getTrafficData(decodedUrl, initialData.overview?.description),
                getTechStackData(decodedUrl, initialData.overview?.htmlContent || '', initialData.headers || {}),
                getAdditionalAnalysis(decodedUrl),
            ]);

            const fullPerfData = perfResult.status === 'fulfilled' ? perfResult.value : {};
            const securityAudits = 'securityAudits' in fullPerfData ? fullPerfData.securityAudits : {};
            
            let securityScoreTotal = 0;
            let securityItemsScored = 0;
            
            if (initialData.security?.isSecure) securityScoreTotal += 1;
            securityItemsScored++;

            Object.values(initialData.security?.securityHeaders || {}).forEach(present => {
                if (present) securityScoreTotal++;
                securityItemsScored++;
            });

            if (securityAudits) {
                Object.values(securityAudits).forEach(audit => {
                    if (audit.score !== null) {
                        securityScoreTotal += audit.score;
                        securityItemsScored++;
                    }
                });
            }
            const calculatedSecurityScore = securityItemsScored > 0 ? Math.round((securityScoreTotal / securityItemsScored) * 100) : 0;

            // Combine all results and update state at once
            setAnalysisResult(currentData => ({
                ...(currentData as AnalysisResult),
                ...fullPerfData,
                overview: {
                    ...currentData!.overview,
                    ...('overview' in fullPerfData ? fullPerfData.overview : {}),
                    title: ('overview' in fullPerfData && fullPerfData.overview?.title) || currentData!.overview?.title,
                    description: ('overview' in fullPerfData && fullPerfData.overview?.description) || currentData!.overview?.description,
                },
                metadata: {
                    ...currentData!.metadata,
                    hasRobotsTxt: 'metadata' in fullPerfData ? fullPerfData.metadata.hasRobotsTxt : false,
                    hasSitemapXml: 'metadata' in fullPerfData ? fullPerfData.metadata.hasSitemapXml : false,
                } as Metadata,
                security: {
                    ...currentData!.security,
                    securityScore: calculatedSecurityScore,
                } as SecurityData,
                aiSummary: summaryResult.status === 'fulfilled' ? summaryResult.value : { error: summaryResult.reason?.message || 'Failed to generate summary.'},
                traffic: trafficResult.status === 'fulfilled' ? trafficResult.value : undefined,
                techStack: techStackResult.status === 'fulfilled' ? techStackResult.value : undefined,
                status: additionalResult.status === 'fulfilled' ? additionalResult.value.status : undefined,
            }));
            isFetching.current = false;
        };

        fetchRemainingAnalysis().catch(e => {
            console.error("An error occurred during analysis:", e);
            setError(e.message || "An unexpected error occurred.");
            isFetching.current = false;
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [decodedUrl, key]);


    const handleDownloadPdf = async () => {
        if (!analysisResult || !analysisResult.performance) return;
        
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
            addAuditList('Performance & Optimisation Audits', data.performanceAudits);
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


            // --- Finalise Pages ---
            addPageFooter();

            try {
                pdf.save(`webintel-report-${new URL(decodedUrl).hostname}.pdf`);
            } catch (error) {
                 console.error("Failed to generate PDF", error);
            }
        }

        try {
            generatePdfFromData(analysisResult);
        } catch (error) {
            console.error("PDF generation failed:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const renderContent = () => {
        if (!analysisResult) {
            return <DashboardSkeleton />;
        }
        if (error) {
            return <ErrorAlert title="Analysis Failed" description={error} />;
        }
        if (analysisResult) {
            return <AnalysisDashboard initialData={analysisResult} />;
        }
        return null;
    }
    
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
                    <Button variant="outline" onClick={() => router.push(`/analysis/${encodeURIComponent(decodedUrl)}?t=${Date.now()}`)} disabled={isDownloading}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Re-analyse
                    </Button>
                    <Button onClick={handleDownloadPdf} disabled={isDownloading || !analysisResult || !analysisResult.performance}>
                         {isDownloading ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                         ) : (
                            <Download className="mr-2 h-4 w-4" />
                         )}
                        Download PDF
                    </Button>
                </div>
            </div>
            {renderContent()}
        </div>
    );
}
