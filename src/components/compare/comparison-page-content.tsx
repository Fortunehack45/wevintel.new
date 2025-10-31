
'use client';

import { useEffect, useState, useMemo, useCallback } from 'react';
import { RefreshCw, ArrowLeft, Download, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type AnalysisResult, type ComparisonInput, type ComparisonOutput, type ComparisonHistoryItem } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { ComparisonDashboard } from './comparison-dashboard';
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
import { compareWebsites } from '@/ai/flows/compare-websites-flow';
import { LoadingOverlay } from '../loading-overlay';
import { getFullAnalysis } from '@/app/actions/get-full-analysis';


type Urls = { url1: string; url2: string };

interface ComparisonPageContentProps {
    urls: Urls;
    initialData1: Partial<AnalysisResult> | { error: string; overview: { url: string; domain: string; }};
    initialData2: Partial<AnalysisResult> | { error: string; overview: { url: string; domain: string; }};
}

export function ComparisonPageContent({ urls, initialData1, initialData2 }: ComparisonPageContentProps) {
    const router = useRouter();
    const [isDownloading, setIsDownloading] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    const [data1, setData1] = useState<AnalysisResult | { error: string, overview: Partial<AnalysisResult['overview']> } | null>(null);
    const [data2, setData2] = useState<AnalysisResult | { error: string, overview: Partial<AnalysisResult['overview']> } | null>(null);
    const [summary, setSummary] = useState<ComparisonOutput | { error: string } | null>(null);
    
    const stableInitialValue = useMemo(() => [], []);
    const [history, setHistory] = useLocalStorage<ComparisonHistoryItem[]>('webintel_comparison_history', stableInitialValue);

    const fetchAllData = useCallback(async () => {
        setIsLoading(true);

        const results = await Promise.allSettled([
            getFullAnalysis(urls.url1),
            getFullAnalysis(urls.url2)
        ]);
        
        const res1 = results[0].status === 'fulfilled' ? results[0].value : { error: results[0].reason?.message || 'Unknown error', overview: { url: urls.url1, domain: new URL(urls.url1).hostname } };
        const res2 = results[1].status === 'fulfilled' ? results[1].value : { error: results[1].reason?.message || 'Unknown error', overview: { url: urls.url2, domain: new URL(urls.url2).hostname } };
        
        setData1(res1);
        setData2(res2);
        
        // Generate AI Summary
        if (!('error' in res1) && !('error' in res2)) {
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
                const aiSummary = await compareWebsites(aiInput);
                setSummary(aiSummary);
            } catch (e: any) {
                setSummary({ error: e.message || "Failed to generate AI comparison." });
            }
        } else {
            setSummary({ error: "AI comparison could not be generated because one or both sites failed to analyze." });
        }
        
        setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [urls.url1, urls.url2]);

    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]);
    
    useEffect(() => {
        if (data1 && data2 && !('error' in data1) && !('error' in data2)) {
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
                    const id1 = `${item.url1}-${item.url2}`;
                    const id2 = `${item.url2}-${item.url1}`;
                    const newId1 = `${newEntry.url1}-${newEntry.url2}`;
                    return id1 !== newId1 && id2 !== newId1;
                });
                const newHistory = [newEntry, ...filteredHistory];
                return newHistory.slice(0, 50);
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data1, data2]);

    const handleDownloadPdf = async () => {
        if (!data1 || !data2 || ('error' in data1) || ('error' in data2) || !summary || 'error' in summary) return;
        setIsDownloading(true);

        const generatePdfFromData = (d1: AnalysisResult, d2: AnalysisResult, summary: ComparisonOutput) => {
            const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const margin = 40;
            const contentWidth = pdfWidth - margin * 2;
            let currentY = 0;

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
                }
            };
            
            const checkAndAddPage = (spaceNeeded = 40) => {
                if (currentY > pdfHeight - margin - spaceNeeded) {
                    pdf.addPage();
                    addPageHeader();
                }
            };
            
            const addSectionTitle = (title: string) => {
                checkAndAddPage(60);
                currentY += (currentY === 60 ? 0 : 25);
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(16);
                pdf.setTextColor(primaryColor);
                pdf.text(title, margin, currentY);
                currentY += 25;
            };

            const addComparisonRow = (label: string, value1: string | undefined, value2: string | undefined) => {
                checkAndAddPage(30);
                const rowY = currentY;
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(10);
                pdf.setTextColor(textColor);
                pdf.text(label, margin, rowY);

                pdf.setFont('helvetica', 'normal');
                const colWidth = contentWidth / 2;
                pdf.text(value1 || 'N/A', margin, rowY + 15, { maxWidth: colWidth - 10 });
                pdf.text(value2 || 'N/A', margin + colWidth, rowY + 15, { maxWidth: colWidth - 10 });
                
                const height1 = pdf.getTextDimensions(value1 || 'N/A', { maxWidth: colWidth - 10 }).h;
                const height2 = pdf.getTextDimensions(value2 || 'N/A', { maxWidth: colWidth - 10 }).h;
                currentY += Math.max(height1, height2) + 25;
                
                pdf.setDrawColor(borderColor);
                pdf.line(margin, currentY - 10, pdfWidth - margin, currentY - 10);
            }
            
             const drawScoreGauge = (x: number, y: number, score: number, label: string) => {
                 const radius = 22;
                 pdf.setLineWidth(4);
                 pdf.setDrawColor('#E5E7EB');
                 pdf.circle(x, y, radius, 'S');
                 const getScoreColor = (s: number) => s >= 90 ? '#10B981' : s >= 50 ? '#F59E0B' : '#EF4444';
                 pdf.setDrawColor(getScoreColor(score));
                 if (score > 0) {
                    const angle = (score / 100) * 360;
                    for (let i = 0; i < angle; i++) {
                        const a = (-90 + i) * Math.PI / 180;
                        const a2 = (-90 + i + 1) * Math.PI / 180;
                        pdf.line(x + radius * Math.cos(a), y + radius * Math.sin(a), x + radius * Math.cos(a2), y + radius * Math.sin(a2));
                    }
                 }
                 pdf.setFont('helvetica', 'bold');
                 pdf.setFontSize(14);
                 pdf.setTextColor(getScoreColor(score));
                 pdf.text(String(score), x, y + 5, { align: 'center' });
                 pdf.setFont('helvetica', 'normal');
                 pdf.setFontSize(7);
                 pdf.setTextColor(mutedColor);
                 pdf.text(label, x, y + radius + 10, { align: 'center' });
            };
            

            // --- Cover Page ---
            pdf.setFillColor(primaryColor);
            pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(28);
            pdf.setTextColor(whiteColor);
            pdf.text('WebIntel Comparison Report', pdfWidth / 2, pdfHeight / 2 - 80, { align: 'center' });
            
            pdf.setFontSize(18);
            pdf.text(d1.overview.domain, pdfWidth / 2, pdfHeight / 2 - 20, { align: 'center' });
            pdf.setFontSize(14);
            pdf.text('vs', pdfWidth / 2, pdfHeight / 2, { align: 'center' });
            pdf.setFontSize(18);
            pdf.text(d2.overview.domain, pdfWidth / 2, pdfHeight / 2 + 20, { align: 'center' });

            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.text(`Report generated on: ${new Date().toLocaleString()}`, pdfWidth / 2, pdfHeight / 2 + 60, { align: 'center'});

            // --- AI Summary Page ---
            pdf.addPage();
            addPageHeader();
            addSectionTitle(summary.title);
            
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            const summaryLines = pdf.splitTextToSize(summary.summary, contentWidth);
            pdf.text(summaryLines, margin, currentY);
            currentY += summaryLines.length * 12 + 20;

            pdf.setFillColor(lightBgColor);
            pdf.setDrawColor(borderColor);
            pdf.roundedRect(margin, currentY, contentWidth, 40, 5, 5, 'FD');
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            pdf.setTextColor(textColor);
            pdf.text('Overall Winner:', margin + 20, currentY + 25);
            pdf.setFont('helvetica', 'normal');
            pdf.text(summary.winner, margin + 110, currentY + 25);
            currentY += 60;
            
            // --- Performance Comparison ---
            addSectionTitle('Performance & Core Vitals');
            const colWidth = contentWidth / 2;
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            pdf.text(d1.overview.domain, margin, currentY, { maxWidth: colWidth - 10 });
            pdf.text(d2.overview.domain, margin + colWidth, currentY, { maxWidth: colWidth - 10 });
            currentY += 20;

            const addScoreRow = (label: string, scores1: any, scores2: any) => {
                checkAndAddPage(80);
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(11);
                pdf.setTextColor(mutedColor);
                pdf.text(label, pdfWidth / 2, currentY, { align: 'center' });
                currentY += 55;
                
                const gaugeY = currentY;
                const gaugeX1 = margin + colWidth / 2;
                const gaugeX2 = margin + colWidth + colWidth / 2;

                drawScoreGauge(gaugeX1 - 90, gaugeY, scores1.perf, 'Perf.');
                drawScoreGauge(gaugeX1 - 30, gaugeY, scores1.access, 'Access.');
                drawScoreGauge(gaugeX1 + 30, gaugeY, scores1.seo, 'SEO');
                drawScoreGauge(gaugeX1 + 90, gaugeY, scores1.b_p, 'Best P.');
                
                drawScoreGauge(gaugeX2 - 90, gaugeY, scores2.perf, 'Perf.');
                drawScoreGauge(gaugeX2 - 30, gaugeY, scores2.access, 'Access.');
                drawScoreGauge(gaugeX2 + 30, gaugeY, scores2.seo, 'SEO');
                drawScoreGauge(gaugeX2 + 90, gaugeY, scores2.b_p, 'Best P.');

                currentY += 40;
                pdf.setDrawColor(borderColor);
                pdf.line(margin, currentY, pdfWidth - margin, currentY);
                currentY += 20;
            }
            
            addScoreRow('Mobile Scores', 
                { perf: d1.performance?.mobile.performanceScore || 0, access: d1.performance?.mobile.accessibilityScore || 0, seo: d1.performance?.mobile.seoScore || 0, b_p: d1.performance?.mobile.bestPracticesScore || 0}, 
                { perf: d2.performance?.mobile.performanceScore || 0, access: d2.performance?.mobile.accessibilityScore || 0, seo: d2.performance?.mobile.seoScore || 0, b_p: d2.performance?.mobile.bestPracticesScore || 0}
            );
            addScoreRow('Desktop Scores',
                { perf: d1.performance?.desktop.performanceScore || 0, access: d1.performance?.desktop.accessibilityScore || 0, seo: d1.performance?.desktop.seoScore || 0, b_p: d1.performance?.desktop.bestPracticesScore || 0}, 
                { perf: d2.performance?.desktop.performanceScore || 0, access: d2.performance?.desktop.accessibilityScore || 0, seo: d2.performance?.desktop.seoScore || 0, b_p: d2.performance?.desktop.bestPracticesScore || 0}
            );

            // --- Detailed Metrics Table ---
            addComparisonRow('Largest Contentful Paint', d1.performance?.mobile.largestContentfulPaint, d2.performance?.mobile.largestContentfulPaint);
            addComparisonRow('Interaction to Next Paint', d1.performance?.mobile.interactionToNextPaint, d2.performance?.mobile.interactionToNextPaint);
            addComparisonRow('Speed Index', d1.performance?.mobile.speedIndex, d2.performance?.mobile.speedIndex);
            addComparisonRow('Cumulative Layout Shift', d1.performance?.mobile.cumulativeLayoutShift, d2.performance?.mobile.cumulativeLayoutShift);
            
            // --- Security & Tech Stack ---
            checkAndAddPage(200);
            addSectionTitle('Security, Tech & Hosting');
            addComparisonRow('Security Score', `${d1.security?.securityScore || 0}%`, `${d2.security?.securityScore || 0}%`);
            addComparisonRow('Technology Stack', d1.techStack?.map(t => t.name).join(', '), d2.techStack?.map(t => t.name).join(', '));
            addComparisonRow('Hosting ISP', d1.hosting?.isp, d2.hosting?.isp);
            addComparisonRow('Hosting Country', d1.hosting?.country, d2.hosting?.country);

            // --- Finalise ---
            addPageFooter();

            try {
                pdf.save(`WebIntel-Comparison-${d1.overview.domain}-vs-${d2.overview.domain}.pdf`);
            } catch (error) {
                 console.error("Failed to generate comparison PDF", error);
            }
        };

        try {
            if (data1 && !('error' in data1) && data2 && !('error' in data2) && summary && !('error' in summary)) {
                generatePdfFromData(data1, data2, summary);
            }
        } catch (error) {
            console.error("PDF generation failed:", error);
        } finally {
            setIsDownloading(false);
        }
    };
    
    const canDownload = !!data1 && !!data2 && !('error' in data1) && !('error' in data2) && !!summary && !('error' in summary);

    const handleEditCompare = (newUrls: {url1: string, url2: string}) => {
        setEditOpen(false);
        router.push(`/compare/${encodeURIComponent(newUrls.url1)}/${encodeURIComponent(newUrls.url2)}`);
    }

    return (
        <div className="flex-1">
             <LoadingOverlay isVisible={isLoading} isComparison />
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                <div className="space-y-3">
                    <h1 className="text-3xl font-bold">Comparison Report</h1>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-muted-foreground bg-muted p-2 rounded-lg">
                        <div className='flex items-center gap-2 min-w-0'>
                           <Image src={`https://www.google.com/s2/favicons?domain=${new URL(urls.url1).hostname}&sz=32`} alt={`${new URL(urls.url1).hostname} favicon`} width={20} height={20} className="rounded-md flex-shrink-0 bg-slate-100 dark:bg-white/10 p-0.5" crossOrigin="anonymous"/>
                            <a href={urls.url1} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium truncate">{new URL(urls.url1).hostname}</a>
                        </div>
                        <span className="font-bold sm:mx-2">vs</span>
                         <div className='flex items-center gap-2 min-w-0'>
                           <Image src={`https://www.google.com/s2/favicons?domain=${new URL(urls.url2).hostname}&sz=32`} alt={`${new URL(urls.url2).hostname} favicon`} width={20} height={20} className="rounded-md flex-shrink-0 bg-slate-100 dark:bg-white/10 p-0.5" crossOrigin="anonymous"/>
                            <a href={urls.url2} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium truncate">{new URL(urls.url2).hostname}</a>
                        </div>
                    </div>
                </div>
                <div className='flex items-center gap-2 flex-wrap justify-start md:justify-end'>
                     <Button variant="outline" onClick={() => router.back()} disabled={isDownloading}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
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
                initialData1={initialData1}
                initialData2={initialData2}
                data1={data1}
                data2={data2}
                summary={summary}
                isLoading={isLoading}
            />
        </div>
    );
}

    
