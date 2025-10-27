
'use client';
import { useEffect, useState, useCallback } from 'react';
import { getDomainInfo } from '@/app/actions/get-additional-analysis';
import { DomainCard } from '@/components/analysis/domain-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Home, Search, Download, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { type DomainHistoryItem, type DomainData } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import jsPDF from 'jspdf';
import { format, parseISO } from 'date-fns';

function DomainResultSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-3 grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <Skeleton className="h-64 w-full" />
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                </div>
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    )
}


export default function DomainResultPage() {
  const params = useParams<{ domain: string }>();
  const router = useRouter();
  const decodedDomain = params ? decodeURIComponent(params.domain) : '';
  const [domainInfo, setDomainInfo] = React.useState<DomainData | null | undefined>(undefined);
  const [isDownloading, setIsDownloading] = useState(false);
  const [history, setHistory] = useLocalStorage<DomainHistoryItem[]>('webintel_domain_history', []);

  const fetchAndSaveHistory = useCallback(async () => {
    if (!decodedDomain) return;

    setDomainInfo(undefined); // Set to loading state
    const info = await getDomainInfo(decodedDomain);
    setDomainInfo(info);

    if (info) {
      setHistory(prevHistory => {
        // Remove existing entry for the same domain to avoid duplicates
        const newHistory = prevHistory.filter(item => item.domain !== decodedDomain);
        // Add the new lookup to the top of the history
        newHistory.unshift({
          id: crypto.randomUUID(),
          domain: decodedDomain,
          createdAt: new Date().toISOString(),
        });
        // Limit history to 50 items
        return newHistory.slice(0, 50);
      });
    }
  }, [decodedDomain, setHistory]);

  useEffect(() => {
    fetchAndSaveHistory();
  }, [decodedDomain, fetchAndSaveHistory]);


  const handleDownloadPdf = async () => {
        if (!domainInfo) return;
        
        setIsDownloading(true);

        const generatePdfFromData = (data: DomainData) => {
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
                    addPageHeader(decodedDomain);
                }
            };
            
            const addSectionTitle = (title: string) => {
                checkAndAddPage();
                currentY += (currentY === 60 ? 0 : 20);
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(14);
                pdf.setTextColor(textColor);
                pdf.text(title, margin, currentY);
                currentY += 20;
            };

            const addKeyValue = (key: string, value: string | string[] | undefined | null) => {
                if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) return;
                checkAndAddPage();
                pdf.setFont('helvetica', 'bold');
                pdf.setFontSize(10);
                pdf.setTextColor(textColor);
                const splitKey = pdf.splitTextToSize(key, contentWidth * 0.3);
                pdf.text(splitKey, margin + 10, currentY);
                
                pdf.setFont('helvetica', 'normal');
                
                if (Array.isArray(value)) {
                    const listYStart = currentY;
                    value.forEach((v, i) => {
                       const itemY = listYStart + (i * 14);
                       pdf.text(`- ${v}`, margin + 150, itemY);
                    });
                    currentY += value.length * 14 + 6;
                } else {
                    const splitValue = pdf.splitTextToSize(String(value), contentWidth * 0.6);
                    pdf.text(splitValue, margin + 150, currentY);
                    currentY += Math.max(splitKey.length, splitValue.length) * 12 + 6;
                }
            };

            const addDateValue = (key: string, dateStr: string | undefined | null) => {
                if (!dateStr) return;
                try {
                    const date = parseISO(dateStr);
                    addKeyValue(key, format(date, 'PPP'));
                } catch (e) {
                     addKeyValue(key, dateStr);
                }
            }
            
            // --- Cover Page ---
            pdf.setFillColor(primaryColor);
            pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
            
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(28);
            pdf.setTextColor(whiteColor);
            pdf.text('WebIntel Domain Report', pdfWidth / 2, pdfHeight / 2 - 40, { align: 'center' });

            pdf.setFontSize(16);
            pdf.text(decodedDomain, pdfWidth / 2, pdfHeight / 2, { align: 'center' });

            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.text(`Generated on: ${new Date().toLocaleString()}`, pdfWidth / 2, pdfHeight / 2 + 30, { align: 'center'});

            // --- Start Content Pages ---
            pdf.addPage();
            addPageHeader(decodedDomain);
            
            // Registration Details
            addSectionTitle('Registration Details');
            addKeyValue('Registrar', data.registrar);
            addDateValue('Creation Date', data.creationDate);
            addDateValue('Expiration Date', data.expirationDate);
            addDateValue('Updated Date', data.updatedDate);
            
            // Status & Nameservers
            addSectionTitle('Status & Nameservers');
            addKeyValue('Domain Status', data.status);
            addKeyValue('Nameservers', data.nameservers);

            const addContactSection = (title: string, contact: typeof data.registrant) => {
                if (!contact) return;
                addSectionTitle(title);
                addKeyValue('Name', contact.name);
                addKeyValue('Organization', contact.organization);
                addKeyValue('Email', contact.email);
                addKeyValue('Telephone', contact.telephone);
                const address = [contact.street, contact.city, contact.state, contact.postalCode, contact.country].filter(Boolean).join(', ');
                addKeyValue('Address', address);
            };

            // Contact Sections
            addContactSection('Registrant Contact', data.registrant);
            addContactSection('Administrative Contact', data.admin);
            addContactSection('Technical Contact', data.tech);

            // --- Finalise Pages ---
            addPageFooter();

            try {
                pdf.save(`webintel-domain-report-${decodedDomain}.pdf`);
            } catch (error) {
                 console.error("Failed to generate PDF", error);
            }
        }

        try {
            generatePdfFromData(domainInfo);
        } catch (error) {
            console.error("PDF generation failed:", error);
        } finally {
            setIsDownloading(false);
        }
    };


  return (
    <div className="max-w-4xl mx-auto">
        <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
            <div>
                 <h1 className="text-4xl font-bold">Domain Intelligence</h1>
                 <p className="text-muted-foreground text-lg">{decodedDomain}</p>
            </div>
            <div className='flex items-center gap-2'>
                <Button asChild variant="outline">
                    <a href={`https://${decodedDomain}`} target="_blank" rel="noopener noreferrer">
                        <Globe className="mr-2 h-4 w-4" />
                        Visit Site
                    </a>
                </Button>
                <Button asChild variant="outline">
                    <Link href="/domain-checker">
                    <Search className="mr-2 h-4 w-4" />
                    New Search
                    </Link>
                </Button>
                 <Button onClick={handleDownloadPdf} disabled={isDownloading || !domainInfo}>
                     {isDownloading ? (
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                     ) : (
                        <Download className="mr-2 h-4 w-4" />
                     )}
                    Download PDF
                </Button>
            </div>
        </div>

      {domainInfo === undefined && <DomainResultSkeleton />}

      {domainInfo === null && (
        <Card className="w-full text-center glass-card">
            <CardHeader>
                <CardTitle>No Information Found</CardTitle>
                <CardDescription>We could not retrieve WHOIS information for this domain.</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">
                    This could be because the domain is not registered, has privacy protection enabled, or there was a temporary issue with the lookup service. Please check that you have set a valid WHOIS_API_KEY if the issue persists.
                </p>
                 <Button onClick={() => router.push('/domain-checker')} className="mt-4">
                    <Search className="mr-2 h-4 w-4" />
                    Try another domain
                </Button>
            </CardContent>
        </Card>
      )}

      {domainInfo && (
        <div className="grid gap-6">
            <DomainCard data={domainInfo} />
        </div>
      )}
    </div>
  );
}
