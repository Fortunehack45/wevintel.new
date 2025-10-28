
'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { RefreshCw, ArrowLeft, Download, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type AnalysisResult, type ComparisonInput, type ComparisonOutput, type ComparisonHistoryItem } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { ComparisonDashboard } from './comparison-dashboard';
import { compareWebsites } from '@/ai/flows/compare-websites-flow';
import { useLocalStorage } from '@/hooks/use-local-storage';
import jsPDF from 'jspdf';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CompareForm } from './compare-form';
import Image from 'next/image';
import { getFastAnalysis, getPerformanceAnalysis } from '@/app/actions/analyze';
import { getAdditionalAnalysis, getDomainInfo } from '@/app/actions/get-additional-analysis';
import { summarizeWebsite, WebsiteAnalysisInput } from '@/ai/flows/summarize-flow';
import { estimateTraffic } from '@/ai/flows/traffic-estimate-flow';
import { detectTechStack } from '@/ai/flows/tech-stack-flow';

type Urls = { url1: string; url2: string };

const getSecurityScore = (data: Partial<AnalysisResult>) => {
    if (!data.security) return 0;
    let total = 0, count = 0;
    if(data.security.isSecure) { total++; count++; }
    Object.values(data.security.securityHeaders || {}).forEach(v => { if(v) total++; count++; });
    if(data.securityAudits) {
        Object.values(data.securityAudits).forEach(a => { if (a.score !== null) { total += a.score; count++; } });
    }
    return count > 0 ? Math.round((total / count) * 100) : 0;
}

export function ComparisonPageContent({ urls }: { urls: Urls }) {
    const router = useRouter();
    const [data1, setData1] = useState<AnalysisResult | null>(null);
    const [data2, setData2] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState(true);
    
    const [isDownloading, setIsDownloading] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [comparisonSummary, setComparisonSummary] = useState<ComparisonOutput | { error: string } | null>(null);
    const stableInitialValue = useMemo(() => [], []);
    const [history, setHistory] = useLocalStorage<ComparisonHistoryItem[]>('webintel_comparison_history', stableInitialValue);
    
    const fetchAnalysisForUrl = useCallback(async (url: string): Promise<AnalysisResult | null> => {
        try {
            const fastResult = await getFastAnalysis(url);
            if ('error' in fastResult) throw new Error(fastResult.error);
    
            const aiSummaryInput: WebsiteAnalysisInput = {
                overview: fastResult.overview!,
                security: fastResult.security!,
                hosting: fastResult.hosting!,
                headers: fastResult.headers,
            };
    
            const [perfResult, summaryResult, trafficResult, techStackResult, additionalResult, domainResult] = await Promise.allSettled([
                getPerformanceAnalysis(url),
                summarizeWebsite(aiSummaryInput),
                estimateTraffic({ url, description: fastResult.overview?.description || '' }),
                detectTechStack({ url, htmlContent: fastResult.overview?.htmlContent || '', headers: fastResult.headers || {} }),
                getAdditionalAnalysis(url),
                getDomainInfo(fastResult.overview!.domain),
            ]);
    
            const fullPerfData = perfResult.status === 'fulfilled' ? perfResult.value : {};
            
            const finalResult: AnalysisResult = {
                ...(fastResult as AnalysisResult),
                ...fullPerfData,
                overview: {
                    ...fastResult.overview!,
                    ...('overview' in fullPerfData ? fullPerfData.overview : {}),
                    title: ('overview' in fullPerfData && fullPerfData.overview?.title) || fastResult.overview?.title,
                    description: ('overview' in fullPerfData && fullPerfData.overview?.description) || fastResult.overview?.description,
                },
                metadata: {
                    ...fastResult.metadata!,
                    hasRobotsTxt: 'metadata' in fullPerfData && fullPerfData.metadata ? fullPerfData.metadata.hasRobotsTxt : false,
                    hasSitemapXml: 'metadata' in fullPerfData && fullPerfData.metadata ? fullPerfData.metadata.hasSitemapXml : false,
                },
                security: {
                    ...fastResult.security!,
                    securityScore: getSecurityScore({ ...fastResult, ...fullPerfData }),
                },
                aiSummary: summaryResult.status === 'fulfilled' ? summaryResult.value : { error: summaryResult.reason?.message || 'Failed to generate summary.'},
                traffic: trafficResult.status === 'fulfilled' ? trafficResult.value : undefined,
                techStack: techStackResult.status === 'fulfilled' ? techStackResult.value : undefined,
                status: additionalResult.status === 'fulfilled' ? additionalResult.value.status : undefined,
                domain: domainResult.status === 'fulfilled' ? domainResult.value : undefined,
            };
            return finalResult;
        } catch (e) {
            console.error(`Failed to analyze ${url}:`, e);
            return null; // Return null on failure
        }
    }, []);

    useEffect(() => {
        const runComparison = async () => {
            setLoading(true);
            const [res1, res2] = await Promise.all([
                fetchAnalysisForUrl(urls.url1),
                fetchAnalysisForUrl(urls.url2)
            ]);
            
            setData1(res1);
            setData2(res2);

            if (res1 && res2) {
                try {
                    const aiInput: ComparisonInput = {
                        site1: {
                            url: res1.overview.url,
                            performanceScore: res1.performance?.mobile.performanceScore,
                            securityScore: res1.security?.securityScore,
                            techStack: res1.techStack?.map(t => t.name),
                            hostingCountry: res1.hosting?.country,
                        },
                        site2: {
                            url: res2.overview.url,
                            performanceScore: res2.performance?.mobile.performanceScore,
                            securityScore: res2.security?.securityScore,
                            techStack: res2.techStack?.map(t => t.name),
                            hostingCountry: res2.hosting?.country,
                        }
                    };
                    const summary = await compareWebsites(aiInput);
                    setComparisonSummary(summary);
                    
                    setHistory(prev => {
                        const newEntry: ComparisonHistoryItem = {
                            id: crypto.randomUUID(),
                            url1: urls.url1,
                            url2: urls.url2,
                            domain1: new URL(urls.url1).hostname,
                            domain2: new URL(urls.url2).hostname,
                            createdAt: new Date().toISOString(),
                        };
                        const filteredHistory = prev.filter(item => {
                            const existing = (item.url1 === newEntry.url1 && item.url2 === newEntry.url2);
                            const swapped = (item.url1 === newEntry.url2 && item.url2 === newEntry.url1);
                            return !existing && !swapped;
                        });
                        const newHistory = [newEntry, ...filteredHistory];
                        return newHistory.slice(0, 50);
                    });

                } catch (e: any) {
                    setComparisonSummary({ error: e.message || "Failed to generate AI comparison." });
                }
            }
            setLoading(false);
        };
        runComparison();
    }, [urls.url1, urls.url2, fetchAnalysisForUrl, setHistory]);


    const handleDownloadPdf = async () => {
        if (!data1 || !data2 || !comparisonSummary || 'error' in comparisonSummary) return;
        
        setIsDownloading(true);

        const generatePdfFromData = (d1: AnalysisResult, d2: AnalysisResult, summary: ComparisonOutput) => {
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 40;
            const contentWidth = pdfWidth - margin * 2;
            let currentY = 0;

            // Colors
            const primaryColor = '#2563EB';
            const textColor = '#1F2937';
            const mutedColor = '#6B7280';
            const whiteColor = '#FFFFFF';
            const borderColor = '#E5E7EB';
            const lightBgColor = '#F9FAFB';

            const addPageHeader = () => {
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(10);
                pdf.setTextColor(mutedColor);
                pdf.text('WebIntel Comparison Report', margin, 30);
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
                    pdf.text(`${d1.overview.domain} vs ${d2.overview.domain}`, margin, pdfHeight - 20);
                }
            };
            
            const checkAndAddPage = (spaceNeeded = 40) => {
                if (currentY > pdfHeight - margin - spaceNeeded) {
                    pdf.addPage();
                    addPageHeader();
                }
            };

            const addSectionTitle = (title: string, spaceBefore = true) => {
                checkAndAddPage(60);
                currentY += (spaceBefore && currentY > 60 ? 30 : 0);
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(16);
                pdf.setTextColor(primaryColor);
                pdf.text(title, margin, currentY);
                pdf.setDrawColor(primaryColor);
                pdf.setLineWidth(1.5);
                pdf.line(margin, currentY + 5, margin + 40, currentY + 5);
                currentY += 30;
            };

            const addComparisonRow = (label: string, value1: any, value2: any) => {
                checkAndAddPage(30);
                const col1X = margin;
                const col2X = margin + contentWidth * 0.4;
                const col3X = margin + contentWidth * 0.7;
                
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(10);
                pdf.setTextColor(mutedColor);
                const labelLines = pdf.splitTextToSize(label, col2X - col1X - 10);
                pdf.text(labelLines, col1X, currentY);

                pdf.setFont('helvetica', 'normal');
                pdf.setTextColor(textColor);

                const val1Lines = pdf.splitTextToSize(String(value1 !== null && value1 !== undefined ? value1 : 'N/A'), col3X - col2X - 10);
                pdf.text(val1Lines, col2X, currentY);
                
                const val2Lines = pdf.splitTextToSize(String(value2 !== null && value2 !== undefined ? value2 : 'N/A'), pdfWidth - margin - col3X);
                pdf.text(val2Lines, col3X, currentY);
                
                const maxLines = Math.max(labelLines.length, val1Lines.length, val2Lines.length);
                currentY += (maxLines * 12) + 10;
                
                pdf.setDrawColor(borderColor);
                pdf.line(margin, currentY - 5, pdfWidth - margin, currentY - 5);
            };

            // --- Cover Page ---
            pdf.setFillColor(primaryColor);
            pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
            
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(32);
            pdf.setTextColor(whiteColor);
            pdf.text('Website Comparison', pdfWidth / 2, pdfHeight / 2 - 80, { align: 'center' });
            
            pdf.setFontSize(20);
            pdf.text(d1.overview.domain, pdfWidth / 2, pdfHeight / 2 - 20, { align: 'center' });
            pdf.setFontSize(16);
            pdf.text('vs', pdfWidth / 2, pdfHeight / 2 + 10, { align: 'center' });
            pdf.setFontSize(20);
            pdf.text(d2.overview.domain, pdfWidth / 2, pdfHeight / 2 + 40, { align: 'center' });
            
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.text(`Report generated on: ${new Date().toLocaleString()}`, pdfWidth / 2, pdfHeight / 2 + 80, { align: 'center' });

            // --- Start Content Pages ---
            pdf.addPage();
            addPageHeader();

            // --- AI Summary Section ---
            addSectionTitle('AI-Powered Comparison', false);
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            pdf.text('Overall Verdict', margin, currentY);
            currentY += 20;

            const winnerText = summary.winner === 'Tie' ? "It's a Tie!" : `${summary.winner} is the winner.`;
            pdf.setFillColor(lightBgColor);
            pdf.roundedRect(margin, currentY-10, contentWidth, 30, 5, 5, 'F');
            pdf.setFontSize(12);
            pdf.setFont('helvetica', 'bold');
            pdf.setTextColor(primaryColor);
            pdf.text(winnerText, pdfWidth/2, currentY+8, { align: 'center' });
            currentY += 40;

            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(textColor);
            const summaryLines = pdf.splitTextToSize(summary.summary, contentWidth);
            pdf.text(summaryLines, margin, currentY);
            currentY += summaryLines.length * 12 + 10;
            
            // --- Side-by-Side Comparison ---
            addSectionTitle('Side-by-Side Analysis');
            
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            pdf.setTextColor(textColor);
            pdf.text('Metric', margin, currentY);
            pdf.text(d1.overview.domain, margin + contentWidth * 0.4, currentY);
            pdf.text(d2.overview.domain, margin + contentWidth * 0.7, currentY);
            currentY += 20;
            pdf.setDrawColor(textColor);
            pdf.line(margin, currentY - 10, pdfWidth - margin, currentY-10);

            // Performance
            checkAndAddPage(150);
            addComparisonRow('Performance Score (Mobile)', d1.performance?.mobile.performanceScore, d2.performance?.mobile.performanceScore);
            addComparisonRow('Accessibility Score (Mobile)', d1.performance?.mobile.accessibilityScore, d2.performance?.mobile.accessibilityScore);
            addComparisonRow('SEO Score (Mobile)', d1.performance?.mobile.seoScore, d2.performance?.mobile.seoScore);
            addComparisonRow('Largest Contentful Paint', d1.performance?.mobile.largestContentfulPaint, d2.performance?.mobile.largestContentfulPaint);
            addComparisonRow('Interaction to Next Paint', d1.performance?.mobile.interactionToNextPaint, d2.performance?.mobile.interactionToNextPaint);
            
            // Security
            checkAndAddPage(100);
            addComparisonRow('Security Score', d1.security?.securityScore, d2.security?.securityScore);
            addComparisonRow('SSL Enabled', d1.security?.isSecure ? 'Yes' : 'No', d2.security?.isSecure ? 'Yes' : 'No');
            addComparisonRow('Content Security Policy', d1.security?.securityHeaders['content-security-policy'] ? 'Yes' : 'No', d2.security?.securityHeaders['content-security-policy'] ? 'Yes' : 'No');
            
            // Hosting & Tech
            checkAndAddPage(100);
            addComparisonRow('Hosting Country', d1.hosting?.country, d2.hosting?.country);
            addComparisonRow('Hosting ISP', d1.hosting?.isp, d2.hosting?.isp);
            addComparisonRow('Tech Stack', d1.techStack?.map(t => t.name).join(', '), d2.techStack?.map(t => t.name).join(', '));
            

            // --- Finalise Pages ---
            addPageFooter();

            try {
                pdf.save(`WebIntel-Comparison-${d1.overview.domain}-vs-${d2.overview.domain}.pdf`);
            } catch (error) {
                 console.error("Failed to generate comparison PDF", error);
            }
        };

        try {
            generatePdfFromData(data1 as AnalysisResult, data2 as AnalysisResult, comparisonSummary as ComparisonOutput);
        } catch (error) {
            console.error("PDF generation failed:", error);
        } finally {
            setIsDownloading(false);
        }
    };
    
    const canDownload = !loading && !!data1 && !!data2 && !!comparisonSummary && !('error' in comparisonSummary);

    const handleEditCompare = (newUrls: {url1: string, url2: string}) => {
        setEditOpen(false);
        router.push(`/compare/${encodeURIComponent(newUrls.url1)}/${encodeURIComponent(newUrls.url2)}`);
    }

    return (
        <div className="flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold">Comparison Report</h1>
                    <div className="text-muted-foreground flex items-center gap-3 flex-wrap bg-muted p-2 rounded-lg">
                        <div className='flex items-center gap-2'>
                           <Image src={`https://www.google.com/s2/favicons?domain=${new URL(urls.url1).hostname}&sz=32`} alt={`${new URL(urls.url1).hostname} favicon`} width={20} height={20} className="rounded-md flex-shrink-0 bg-slate-100 dark:bg-white/10 p-0.5" crossOrigin="anonymous"/>
                            <a href={urls.url1} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">{new URL(urls.url1).hostname}</a>
                        </div>
                        <span className="font-bold">vs</span>
                        <div className='flex items-center gap-2'>
                           <Image src={`https://www.google.com/s2/favicons?domain=${new URL(urls.url2).hostname}&sz=32`} alt={`${new URL(urls.url2).hostname} favicon`} width={20} height={20} className="rounded-md flex-shrink-0 bg-slate-100 dark:bg-white/10 p-0.5" crossOrigin="anonymous"/>
                            <a href={urls.url2} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">{new URL(urls.url2).hostname}</a>
                        </div>
                    </div>
                </div>
                <div className='flex items-center gap-2'>
                     <Button variant="outline" onClick={() => router.push('/compare')} disabled={isDownloading}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        New
                    </Button>
                    <Dialog open={editOpen} onOpenChange={setEditOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" disabled={isDownloading}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Edit Comparison</DialogTitle>
                            </DialogHeader>
                            <CompareForm 
                                initialUrl1={urls.url1} 
                                initialUrl2={urls.url2} 
                                onCompare={handleEditCompare} 
                                isDialog 
                            />
                        </DialogContent>
                    </Dialog>
                     <Button onClick={handleDownloadPdf} disabled={isDownloading || !canDownload}>
                         {isDownloading ? (
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                         ) : (
                            <Download className="mr-2 h-4 w-4" />
                         )}
                        PDF
                    </Button>
                </div>
            </div>
            
            <ComparisonDashboard 
                data1={data1}
                data2={data2}
                summary={comparisonSummary}
                isLoading={loading}
            />
        </div>
    );
}
