
'use client';

import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { RefreshCw, Download, Home } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { type AnalysisResult, type AuditInfo, type Metadata, type SecurityData } from '@/lib/types';
import { getPerformanceAnalysis } from '@/app/actions/analyze';
import { getAdditionalAnalysis } from '@/app/actions/get-additional-analysis';
import { AnalysisDashboard } from '@/components/analysis/analysis-dashboard';
import jsPDF from 'jspdf';
import { useRouter } from 'next/navigation';
import { DashboardSkeleton } from '@/components/analysis/dashboard-skeleton';
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
    const [isDownloading, setIsDownloading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(initialData as AnalysisResult);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const isFetching = useRef(false);
    const stableInitialValue = useMemo(() => ({}), []);
    const [cache, setCache] = useLocalStorage<Record<string, { data: AnalysisResult, timestamp: string }>>('webintel_analysis_cache', stableInitialValue);


    const fetchFullAnalysis = useCallback(async (ignoreCache = false) => {
        if (!initialData || isFetching.current) return;
        
        // Check cache first
        if (!ignoreCache) {
            const cachedItem = cache[decodedUrl];
            if (cachedItem) {
                const oneDay = 24 * 60 * 60 * 1000;
                if (new Date().getTime() - new Date(cachedItem.timestamp).getTime() < oneDay) {
                    setAnalysisResult(cachedItem.data);
                    return;
                }
            }
        }
        
        isFetching.current = true;
        
        try {
            const aiSummaryInput: WebsiteAnalysisInput = {
                overview: initialData.overview!,
                security: initialData.security!,
                hosting: initialData.hosting!,
                headers: initialData.headers,
            };
            
            const [perfResult, summaryResult, trafficResult, techStackResult, additionalResult] = await Promise.allSettled([
                getPerformanceAnalysis(decodedUrl),
                summarizeWebsite(aiSummaryInput),
                estimateTraffic({ url: decodedUrl, description: initialData.overview?.description || '' }),
                detectTechStack({ url: decodedUrl, htmlContent: initialData.overview?.htmlContent || '', headers: initialData.headers || {} }),
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

            const finalResult: AnalysisResult = {
                ...(initialData as AnalysisResult),
                ...fullPerfData,
                overview: {
                    ...initialData!.overview,
                    ...('overview' in fullPerfData ? fullPerfData.overview : {}),
                    title: ('overview' in fullPerfData && fullPerfData.overview?.title) || initialData!.overview?.title,
                    description: ('overview' in fullPerfData && fullPerfData.overview?.description) || initialData!.overview?.description,
                },
                metadata: {
                    ...initialData!.metadata,
                    hasRobotsTxt: 'metadata' in fullPerfData && fullPerfData.metadata ? fullPerfData.metadata.hasRobotsTxt : false,
                    hasSitemapXml: 'metadata' in fullPerfData && fullPerfData.metadata ? fullPerfData.metadata.hasSitemapXml : false,
                } as Metadata,
                security: {
                    ...initialData!.security,
                    securityScore: calculatedSecurityScore,
                } as SecurityData,
                aiSummary: summaryResult.status === 'fulfilled' ? summaryResult.value : { error: summaryResult.reason?.message || 'Failed to generate summary.'},
                traffic: trafficResult.status === 'fulfilled' ? trafficResult.value : undefined,
                techStack: techStackResult.status === 'fulfilled' ? techStackResult.value : undefined,
                status: additionalResult.status === 'fulfilled' ? additionalResult.value.status : undefined,
            };

            setAnalysisResult(finalResult);
            // Update cache
            setCache(prev => ({
                ...prev,
                [decodedUrl]: { data: finalResult, timestamp: new Date().toISOString() }
            }));

        } catch (e: any) {
            console.error("An error occurred during analysis:", e);
            setError(e.message || "An unexpected error occurred.");
        } finally {
            isFetching.current = false;
        }
    // We only want to run this on mount, and not when cache/setCache changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [decodedUrl, initialData]);


    useEffect(() => {
        fetchFullAnalysis();
    }, [fetchFullAnalysis]);


    const handleDownloadPdf = async () => {
        if (!analysisResult || !analysisResult.performance) return;
        
        setIsDownloading(true);

        const generatePdfFromData = (data: AnalysisResult) => {
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 40;
            const contentWidth = pdfWidth - margin * 2;
            let currentY = 0;

            // Colors (modern and professional)
            const primaryColor = '#2563EB'; // Blue-600
            const textColor = '#1F2937'; // Gray-800
            const mutedColor = '#6B7280'; // Gray-500
            const whiteColor = '#FFFFFF';
            const lightGrayColor = '#F3F4F6'; // Gray-100
            const borderColor = '#E5E7EB'; // Gray-200

            // Helper functions
            const addPageHeader = () => {
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(10);
                pdf.setTextColor(mutedColor);
                pdf.text('WebIntel Analysis Report', margin, 30);
                pdf.setDrawColor(borderColor);
                pdf.line(margin, 35, pdfWidth - margin, 35);
                currentY = 60;
            };

            const addPageFooter = () => {
                const pageCount = pdf.internal.pages.length;
                for (let i = 1; i <= pageCount; i++) {
                    pdf.setPage(i);
                    pdf.setFontSize(8);
                    pdf.setTextColor(mutedColor);
                    pdf.text(`Page ${i} of ${pageCount}`, pdfWidth / 2, pdfHeight - 20, { align: 'center' });
                    pdf.text(`Report for ${data.overview.domain}`, margin, pdfHeight - 20);
                }
            };

            const checkAndAddPage = (spaceNeeded = 40) => {
                if (currentY > pdfHeight - margin - spaceNeeded) {
                    pdf.addPage();
                    addPageHeader();
                    currentY = 60;
                }
            };
            
            const addSectionTitle = (title: string) => {
                checkAndAddPage(60);
                currentY += (currentY === 60 ? 0 : 20);
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(16);
                pdf.setTextColor(primaryColor);
                pdf.text(title, margin, currentY);
                pdf.setDrawColor(primaryColor);
                pdf.setLineWidth(1.5);
                pdf.line(margin, currentY + 5, margin + 40, currentY + 5);
                currentY += 30;
            };

            const addKeyValue = (key: string, value: string | number | boolean | undefined | null) => {
                 if (value === undefined || value === null || value === '') return;
                
                const keyWidth = 130;
                const valueWidth = contentWidth - keyWidth - 20;

                checkAndAddPage();

                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(10);
                pdf.setTextColor(textColor);
                const splitKey = pdf.splitTextToSize(key, keyWidth);
                pdf.text(splitKey, margin, currentY);
                
                pdf.setFont('helvetica', 'normal');
                const valueX = margin + keyWidth;
                const splitValue = pdf.splitTextToSize(String(value), valueWidth);
                pdf.text(splitValue, valueX, currentY);

                const newY = currentY + (Math.max(splitKey.length, splitValue.length) * 12) + 8;
                currentY = newY;
            };

            const drawScoreGauge = (x: number, y: number, score: number, label: string) => {
                 const radius = 28;
                 pdf.setLineWidth(5);
                 
                 // Background circle
                 pdf.setDrawColor(lightGrayColor);
                 pdf.circle(x, y, radius, 'S');

                 // Score arc
                 const getScoreColor = (s: number) => s >= 90 ? '#10B981' : s >= 50 ? '#F59E0B' : '#EF4444';
                 const scoreColor = getScoreColor(score);
                 pdf.setDrawColor(scoreColor);
                 
                 if (score > 0) {
                    const angle = (score / 100) * 360;
                    const startAngle = -90; // Start from top
                    for (let i = 0; i < angle; i++) {
                        const a = (startAngle + i) * Math.PI / 180;
                        const a2 = (startAngle + i + 1) * Math.PI / 180;
                        pdf.line(x + radius * Math.cos(a), y + radius * Math.sin(a), x + radius * Math.cos(a2), y + radius * Math.sin(a2));
                    }
                 }
                 
                 pdf.setFont('helvetica', 'bold');
                 pdf.setFontSize(16);
                 pdf.setTextColor(scoreColor);
                 pdf.text(String(score), x, y + 6, { align: 'center' });

                 pdf.setFont('helvetica', 'normal');
                 pdf.setFontSize(8);
                 pdf.setTextColor(mutedColor);
                 pdf.text(label, x, y + radius + 15, { align: 'center' });
            };
            
            // --- Cover Page ---
            pdf.setFillColor(primaryColor);
            pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
            
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(32);
            pdf.setTextColor(whiteColor);
            pdf.text('WebIntel Analysis Report', pdfWidth / 2, pdfHeight / 2 - 60, { align: 'center' });

            pdf.setFontSize(20);
            pdf.text(data.overview.domain, pdfWidth / 2, pdfHeight / 2, { align: 'center' });

            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.text(`Report generated on: ${new Date().toLocaleString()}`, pdfWidth / 2, pdfHeight / 2 + 40, { align: 'center'});

            // --- Start Content Pages ---
            pdf.addPage();
            addPageHeader();

            // --- Overview Section ---
            addSectionTitle('Website Overview');
            addKeyValue('URL', data.overview.url);
            addKeyValue('Title', data.overview.title);
            addKeyValue('Description', data.overview.description);
            addKeyValue('Language', data.overview.language?.toUpperCase());
            
            // --- Performance Section ---
            if (data.performance) {
                addSectionTitle('Core Vitals & Performance Scores');
                const mobileScores = [
                    { score: data.performance.mobile.performanceScore, label: 'Performance' },
                    { score: data.performance.mobile.accessibilityScore, label: 'Accessibility' },
                    { score: data.performance.mobile.seoScore, label: 'SEO' },
                    { score: data.performance.mobile.bestPracticesScore, label: 'Best Practices' }
                ].filter(s => typeof s.score === 'number');

                const desktopScores = [
                    { score: data.performance.desktop.performanceScore, label: 'Performance' },
                    { score: data.performance.desktop.accessibilityScore, label: 'Accessibility' },
                    { score: data.performance.desktop.seoScore, label: 'SEO' },
                    { score: data.performance.desktop.bestPracticesScore, label: 'Best Practices' }
                ].filter(s => typeof s.score === 'number');

                const gaugeY = currentY + 45;
                const gaugeSpacing = (contentWidth - 60) / (mobileScores.length > 1 ? mobileScores.length - 1 : 1);
                
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(12);
                pdf.setTextColor(textColor);
                pdf.text('Mobile', margin, currentY);
                mobileScores.forEach((s, i) => {
                    drawScoreGauge(margin + 30 + (i * gaugeSpacing), gaugeY, s.score!, s.label);
                });
                currentY += 100;
                
                checkAndAddPage(110);
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(12);
                pdf.setTextColor(textColor);
                pdf.text('Desktop', margin, currentY);
                desktopScores.forEach((s, i) => {
                    drawScoreGauge(margin + 30 + (i * gaugeSpacing), currentY + 45, s.score!, s.label);
                });

                currentY += 100;
                
                checkAndAddPage();
                addKeyValue('Largest Contentful Paint', data.performance.mobile.largestContentfulPaint);
                addKeyValue('Cumulative Layout Shift', data.performance.mobile.cumulativeLayoutShift);
                addKeyValue('Speed Index', data.performance.mobile.speedIndex);
                addKeyValue('Total Blocking Time', data.performance.mobile.totalBlockingTime);
            }
            
            // --- Security & Hosting ---
            checkAndAddPage(200);
            pdf.setDrawColor(borderColor);
            pdf.line(margin, currentY, pdfWidth - margin, currentY);
            currentY += 20;

            let securityY = currentY;
            
            // Security Box
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            pdf.setTextColor(textColor);
            pdf.text('Security', margin, securityY);
            securityY += 20;
            addKeyValue('SSL Enabled', data.security?.isSecure ? 'Yes' : 'No');
            Object.entries(data.security?.securityHeaders || {}).forEach(([key, value]) => {
                addKeyValue(key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), value ? 'Present' : 'Missing');
            });
             currentY = securityY;

            // Hosting Box
            let hostingY = currentY;
            const hostingX = margin + contentWidth/2 + 20;
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            pdf.setTextColor(textColor);
            pdf.text('Hosting', hostingX, hostingY);
            hostingY += 20;
            addKeyValue('IP Address', data.hosting?.ip);
            addKeyValue('ISP', data.hosting?.isp);
            addKeyValue('Country', data.hosting?.country);
            
            currentY = Math.max(currentY, hostingY);


            // --- AI Summary ---
            if (data.aiSummary?.summary) {
                addSectionTitle('AI-Powered Summary');
                pdf.setFont('helvetica', 'normal');
                pdf.setFontSize(10);
                const summaryLines = pdf.splitTextToSize(data.aiSummary.summary.summary, contentWidth);
                pdf.text(summaryLines, margin, currentY);
                currentY += summaryLines.length * 12 + 10;

                pdf.setFont('helvetica', 'bold');
                pdf.text('Recommendations:', margin, currentY);
                currentY += 15;
                data.aiSummary.summary.recommendations.forEach(rec => {
                    checkAndAddPage(30);
                    const recLines = pdf.splitTextToSize(`• ${rec}`, contentWidth - 10);
                    pdf.text(recLines, margin + 10, currentY);
                    currentY += recLines.length * 12 + 5;
                });
            }

            // --- Audit Sections ---
            const addAuditList = (title: string, audits: AuditInfo | undefined) => {
                const auditItems = audits ? Object.values(audits) : [];
                if (auditItems.length === 0) return;
                
                addSectionTitle(title);
                
                auditItems.forEach(audit => {
                    if (audit.score === null || audit.score < 1) { // Only show items that need attention or are informational
                        const scoreText = audit.score !== null ? `(Score: ${Math.round(audit.score * 100)})` : '(Info)';
                        const statusColor = audit.score === null ? textColor : audit.score >= 0.9 ? '#10B981' : '#EF4444';
                        
                        checkAndAddPage(40);
                        pdf.setFont('helvetica', 'bold');
                        pdf.setFontSize(10);
                        pdf.setTextColor(statusColor);
                        const titleText = `${audit.title} ${scoreText}`;
                        const splitTitle = pdf.splitTextToSize(titleText, contentWidth);
                        pdf.text(splitTitle, margin, currentY);
                        currentY += splitTitle.length * 12;

                        pdf.setFont('helvetica', 'normal');
                        pdf.setFontSize(9);
                        pdf.setTextColor(mutedColor);
                        const description = audit.description.replace(/\[(.*?)\]\(.*?\)/g, '$1');
                        const splitDescription = pdf.splitTextToSize(description, contentWidth - 10);
                        pdf.text(splitDescription, margin + 10, currentY);
                        currentY += splitDescription.length * 10 + 15;
                    }
                });
            };
            
            addAuditList('Performance Opportunities', data.performanceAudits);
            addAuditList('Security Audits', data.securityAudits);
            addAuditList('Diagnostics & Best Practices', data.diagnosticsAudits);


            // --- Finalise Pages ---
            addPageFooter();

            try {
                pdf.save(`WebIntel-Report-${new URL(decodedUrl).hostname}.pdf`);
            } catch (error) {
                 console.error("Failed to generate PDF", error);
            }
        };

        try {
            generatePdfFromData(analysisResult as AnalysisResult);
        } catch (error) {
            console.error("PDF generation failed:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    const handleReanalyze = () => {
        // Clear cache for this specific URL
        setCache(prev => {
            const newCache = { ...prev };
            delete newCache[decodedUrl];
            return newCache;
        });
        // Reset state and fetch again
        setAnalysisResult(initialData as AnalysisResult);
        setError(null);
        fetchFullAnalysis(true); // Pass true to ignore cache
    };

    const renderContent = () => {
        if (error) {
            return <ErrorAlert title="Analysis Failed" description={error} />;
        }
        if (analysisResult) {
            // If we have full performance data, show the dashboard.
            // Otherwise, show skeleton with initial data.
            return analysisResult.performance ? 
                <AnalysisDashboard initialData={analysisResult} /> : 
                <DashboardSkeleton initialData={initialData} />;
        }
        // Fallback to basic skeleton if no result at all
        return <DashboardSkeleton />;
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
                    <Button variant="outline" onClick={handleReanalyze} disabled={isFetching.current || isDownloading}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${isFetching.current ? 'animate-spin' : ''}`} />
                        Re-analyse
                    </Button>
                    <Button onClick={handleDownloadPdf} disabled={isDownloading || !analysisResult?.performance}>
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
