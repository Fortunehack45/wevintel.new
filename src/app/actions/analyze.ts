
'use server';

import type { AnalysisResult, PerformanceData, SecurityData, AuditInfo, AuditItem } from '@/lib/types';
import 'dotenv/config';
import { summarizeAnalysis } from '@/ai/flows/summarize-analysis-flow';

// Helper function to parse Open Graph tags from HTML
const getOgTags = (html: string): Record<string, string> => {
  const ogTags: Record<string, string> = {};
  const ogTagRegex = /<meta\s+(?:property|name)="og:([^"]+)"\s+content="([^"]+)"/g;
  let match;
  while ((match = ogTagRegex.exec(html)) !== null) {
    ogTags[match[1]] = match[2];
  }
  return ogTags;
};

// Helper to extract specific headers
const getHeaders = (response: Response): { all: Record<string, string>, security: SecurityData['securityHeaders']} => {
    const allHeaders: Record<string, string> = {};
    const securityHeaders: SecurityData['securityHeaders'] = {};
    const securityHeaderKeys = [
        'content-security-policy',
        'strict-transport-security',
        'x-frame-options',
        'x-content-type-options'
    ];

    response.headers.forEach((value, key) => {
        allHeaders[key.toLowerCase()] = value;
        if(securityHeaderKeys.includes(key.toLowerCase())) {
            securityHeaders[key.toLowerCase() as keyof SecurityData['securityHeaders']] = true;
        }
    });

    return { all: allHeaders, security: securityHeaders };
}

const getPerformanceData = (pageSpeedData: any): PerformanceData => {
    const lighthouse = pageSpeedData?.lighthouseResult;
    const audits = lighthouse?.audits;

    return {
        performanceScore: lighthouse ? Math.round(lighthouse.categories.performance.score * 100) : undefined,
        accessibilityScore: lighthouse ? Math.round(lighthouse.categories.accessibility.score * 100) : undefined,
        seoScore: lighthouse ? Math.round(lighthouse.categories.seo.score * 100) : undefined,
        bestPracticesScore: lighthouse ? Math.round(lighthouse.categories['best-practices'].score * 100) : undefined,
        speedIndex: audits?.['speed-index']?.displayValue,
        totalBlockingTime: audits?.['total-blocking-time']?.displayValue,
        firstContentfulPaint: audits?.['first-contentful-paint']?.displayValue,
        largestContentfulPaint: audits?.['largest-contentful-paint']?.displayValue,
        cumulativeLayoutShift: audits?.['cumulative-layout-shift']?.displayValue,
    }
}

// Extract a curated list of specific audits from the Lighthouse report.
const getAuditInfo = (pageSpeedData: any): AuditInfo => {
    const audits = pageSpeedData?.lighthouseResult?.audits;
    if (!audits) return {};

    const desiredAudits = [
        'third-party-summary',
        'largest-contentful-paint-element',
        'layout-shift-elements',
        'legacy-javascript',
        'uses-long-cache-ttl',
        'user-timings',
        'long-tasks',
        'total-byte-weight',
        'unused-css-rules',
        'mainthread-work-breakdown',
        'network-requests', // Document request latency
        'dom-size', // Optimize DOM size
        'duplicated-javascript', // Duplicated JavaScript
        'font-display', // Font display
        'unminified-css', // Minify CSS, also related to forced reflow
        'unminified-javascript', // Minify JavaScript, also related to forced reflow
        'non-composited-animations', // Avoid non-composited animations
        'uses-responsive-images', // Improve image delivery
        'offscreen-images', // Defer offscreen images
        'inp-breakdown', // INP breakdown
        'lcp-lazy-loaded', // LCP request discovery
        'viewport', // Optimize viewport for mobile
        'uses-explicit-width-and-height', // Image elements have explicit width and height
    ];

    const auditResults: AuditInfo = {};
    desiredAudits.forEach(auditId => {
        const audit = audits[auditId];
        if (audit) {
            auditResults[auditId] = {
                title: audit.title,
                description: audit.description,
                score: audit.score,
                displayValue: audit.displayValue,
            };
        }
    });

    return auditResults;
}


export async function analyzeUrl(url: string): Promise<AnalysisResult | { error: string }> {
  try {
    const urlObject = new URL(url);
    const domain = urlObject.hostname;
    
    // API keys can be stored in .env.local file
    const pageSpeedApiKey = process.env.PAGESPEED_API_KEY;

    const pageSpeedBaseUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO${pageSpeedApiKey ? `&key=${pageSpeedApiKey}` : ''}`;
    
    const pageSpeedMobileUrl = `${pageSpeedBaseUrl}&strategy=mobile`;
    const pageSpeedDesktopUrl = `${pageSpeedBaseUrl}&strategy=desktop`;
    
    const ipApiUrl = `http://ip-api.com/json/${domain}`;
    const sitemapUrl = `${urlObject.origin}/sitemap.xml`;
    
    const [
        pageSpeedMobileRes, 
        pageSpeedDesktopRes, 
        ipInfoRes, 
        sitemapRes, 
        pageHtmlRes
    ] = await Promise.allSettled([
      fetch(pageSpeedMobileUrl),
      fetch(pageSpeedDesktopUrl),
      fetch(ipApiUrl),
      fetch(sitemapUrl, { method: 'HEAD' }),
      fetch(url)
    ]);

    let partial = false;
    if (pageSpeedMobileRes.status === 'rejected' || pageSpeedDesktopRes.status === 'rejected' || ipInfoRes.status === 'rejected' || pageHtmlRes.status === 'rejected') {
        partial = true;
    }
    
    const pageSpeedMobileData = pageSpeedMobileRes.status === 'fulfilled' && pageSpeedMobileRes.value.ok ? await pageSpeedMobileRes.value.json() : null;
    const pageSpeedDesktopData = pageSpeedDesktopRes.status === 'fulfilled' && pageSpeedDesktopRes.value.ok ? await pageSpeedDesktopRes.value.json() : null;

    const ipInfoData = ipInfoRes.status === 'fulfilled' && ipInfoRes.value.ok ? await ipInfoRes.value.json() : null;
    
    let pageHtml = '';
    let responseHeaders = { all: {}, security: {} };
    if (pageHtmlRes.status === 'fulfilled' && pageHtmlRes.value.ok) {
        pageHtml = await pageHtmlRes.value.text();
        responseHeaders = getHeaders(pageHtmlRes.value);
    }


    if (!pageSpeedMobileData && !pageSpeedDesktopData && !ipInfoData) {
        throw new Error('All API requests failed. Unable to analyze the URL.');
    }

    const overviewData = pageSpeedMobileData || pageSpeedDesktopData;
    const lighthouse = overviewData?.lighthouseResult;
    const audits = lighthouse?.audits;

    const partialAnalysis: Omit<AnalysisResult, 'id' | 'createdAt' | 'aiSummary'> = {
      overview: {
        url: url,
        domain: domain,
        title: audits?.['meta-description']?.title || overviewData?.id.split('?')[0] || 'No title found',
        description: audits?.['meta-description']?.description || 'No description available.',
        language: audits?.['html-has-lang']?.details?.items[0]?.lang,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      },
      performance: {
        mobile: getPerformanceData(pageSpeedMobileData),
        desktop: getPerformanceData(pageSpeedDesktopData)
      },
      security: {
        sslGrade: 'N/A', // Requires dedicated API like SSL Labs, which has usage restrictions
        securityHeadersGrade: 'N/A', // Requires dedicated API, often with rate limits
        domainExpiry: 'N/A', // Requires WHOIS lookup, which is complex to do reliably via public API
        isSecure: url.startsWith('https://'),
        securityHeaders: responseHeaders.security
      },
      metadata: {
        openGraphTags: getOgTags(pageHtml),
        hasRobotsTxt: audits?.['robots-txt']?.score === 1,
        hasSitemapXml: sitemapRes.status === 'fulfilled' && sitemapRes.value.ok,
      },
      hosting: {
        ip: ipInfoData?.query,
        isp: ipInfoData?.isp,
        country: ipInfoData?.countryCode,
      },
      headers: responseHeaders.all,
      audits: getAuditInfo(pageSpeedMobileData), // Using mobile data for audits for now
      partial: partial,
    };
    
    // Generate AI summary
    const aiSummary = await summarizeAnalysis(partialAnalysis);

    const finalResult: AnalysisResult = {
        ...partialAnalysis,
        id: crypto.randomUUID(),
        aiSummary: aiSummary,
        createdAt: new Date().toISOString(),
    };
    
    return finalResult;

  } catch (error: any) {
    console.error('Analysis failed:', error);
    return { error: error.message || 'An unknown error occurred during analysis.' };
  }
}
