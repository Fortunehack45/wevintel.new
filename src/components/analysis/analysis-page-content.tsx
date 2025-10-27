
'use client';

import { useState, useMemo } from 'react';
import { RefreshCw, Download, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type AnalysisResult, type AuditInfo } from '@/lib/types';
import { AnalysisDashboard } from '@/components/analysis/analysis-dashboard';
import jsPDF from 'jspdf';
import { useRouter } from 'next/navigation';
import { DashboardSkeleton } from './dashboard-skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAnalysisData } from '@/hooks/use-analysis-data';


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
    const router = useRouter();

    const { result: analysisResult, error, loading } = useAnalysisData(decodedUrl, initialData);

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

            const addKeyValue = (key: string, value: string | number | boolean | undefined | null, xPos: number, yPos: number): number => {
                if (value === undefined || value === null || value === '') return yPos;
                
                const keyWidth = 130;
                const valueWidth = contentWidth / 2 - keyWidth;

                checkAndAddPage(40);
                yPos = currentY;

                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(10);
                pdf.setTextColor(textColor);
                const splitKey = pdf.splitTextToSize(key, keyWidth);
                pdf.text(splitKey, xPos, yPos);
                
                pdf.setFont('helvetica', 'normal');
                const valueX = xPos + keyWidth;
                const splitValue = pdf.splitTextToSize(String(value), valueWidth);
                pdf.text(splitValue, valueX, yPos);

                const newY = yPos + (Math.max(splitKey.length, splitValue.length) * 12) + 8;
                currentY = newY;
                return newY;
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
            let tempY = currentY;
            tempY = addKeyValue('URL', data.overview.url, margin, tempY);
            tempY = addKeyValue('Title', data.overview.title, margin, tempY);
            tempY = addKeyValue('Description', data.overview.description, margin, tempY);
            tempY = addKeyValue('Language', data.overview.language?.toUpperCase(), margin, tempY);
            currentY = tempY + 10;
            
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
                let perfY = currentY;
                perfY = addKeyValue('Largest Contentful Paint', data.performance.mobile.largestContentfulPaint, margin, perfY);
                perfY = addKeyValue('Cumulative Layout Shift', data.performance.mobile.cumulativeLayoutShift, margin, perfY);
                perfY = addKeyValue('Speed Index', data.performance.mobile.speedIndex, margin, perfY);
                perfY = addKeyValue('Total Blocking Time', data.performance.mobile.totalBlockingTime, margin, perfY);
                currentY = perfY;
            }
            
            // --- Security & Hosting ---
            checkAndAddPage(200);
            pdf.setDrawColor(borderColor);
            pdf.line(margin, currentY, pdfWidth - margin, currentY);
            currentY += 20;

            const boxWidth = contentWidth / 2 - 10;
            const initialY = currentY;
            
            let securityCurrentY = initialY;
            let hostingCurrentY = initialY;

            // Security Box
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            pdf.setTextColor(textColor);
            pdf.text('Security', margin, securityCurrentY);
            securityCurrentY += 20;
            let tempSecurityY = securityCurrentY;
            tempSecurityY = addKeyValue('SSL Enabled', data.security?.isSecure ? 'Yes' : 'No', margin, tempSecurityY);
            Object.entries(data.security?.securityHeaders || {}).forEach(([key, value]) => {
                tempSecurityY = addKeyValue(key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), value ? 'Present' : 'Missing', margin, tempSecurityY);
            });
            securityCurrentY = tempSecurityY;

            // Hosting Box
            const hostingX = margin + boxWidth + 20;
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(12);
            pdf.setTextColor(textColor);
            pdf.text('Hosting', hostingX, hostingCurrentY);
            hostingCurrentY += 20;
            let tempHostingY = hostingCurrentY;
            tempHostingY = addKeyValue('IP Address', data.hosting?.ip, hostingX, tempHostingY);
            tempHostingY = addKeyValue('ISP', data.hosting?.isp, hostingX, tempHostingY);
            tempHostingY = addKeyValue('Country', data.hosting?.country, hostingX, tempHostingY);
            hostingCurrentY = tempHostingY;
            
            currentY = Math.max(securityCurrentY, hostingCurrentY);


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


    const renderContent = () => {
        if (loading && !analysisResult?.performance) {
            return <DashboardSkeleton initialData={initialData} />;
        }
        if (error) {
            return <ErrorAlert title="Analysis Failed" description={error} />;
        }
        if (analysisResult) {
            return <AnalysisDashboard initialData={analysisResult} />;
        }
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
                    <Button variant="outline" onClick={() => router.push(`/analysis/${encodeURIComponent(decodedUrl)}?t=${Date.now()}`)} disabled={isDownloading}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Re-analyse
                    </Button>
                    <Button onClick={handleDownloadPdf} disabled={isDownloading || loading || !analysisResult?.performance}>
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
