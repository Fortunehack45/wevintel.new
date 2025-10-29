
'use server';

import type { AnalysisResult, PerformanceData, SecurityData, AuditInfo, AuditItem, WebsiteOverview } from '@/lib/types';
import 'dotenv/config';
import { getCache, setCache } from '@/lib/cache';

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

// Helper function to parse meta description from HTML
const getMetaDescription = (html: string): string | undefined => {
    const descriptionRegex = /<meta\s+name="description"\s+content="([^"]+)"/i;
    const match = html.match(descriptionRegex);
    return match ? match[1] : undefined;
}

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
        interactionToNextPaint: audits?.['interaction-to-next-paint']?.displayValue,
    }
}

// Helper to process a list of audit IDs from a Lighthouse report
const processAudits = (audits: any, auditIds: string[]): AuditInfo => {
    const auditResults: AuditInfo = {};
    if (!audits) return auditResults;
    
    auditIds.forEach(auditId => {
        const audit = audits[auditId];
        if (audit) {
            auditResults[auditId] = {
                id: auditId,
                title: audit.title,
                description: audit.description,
                score: audit.score,
                displayValue: audit.displayValue,
            };
        }
    });
    return auditResults;
}

const getPerformanceAudits = (pageSpeedData: any): AuditInfo => {
    const audits = pageSpeedData?.lighthouseResult?.audits;
    const desiredAudits = [
        'server-response-time', 'network-requests', 'render-blocking-resources',
        'uses-responsive-images', 'uses-webp-images', 'offscreen-images', 
        'unminified-css', 'unminified-javascript', 'unused-css-rules', 'unused-javascript', 
        'uses-optimised-images', 'uses-long-cache-ttl', 'total-byte-weight', 'dom-size',
        'mainthread-work-breakdown', 'efficient-animated-content', 'lcp-lazy-loaded',
        'max-potential-fid', 'interactive',
    ];
    return processAudits(audits, desiredAudits);
}

const getSecurityAudits = (pageSpeedData: any): AuditInfo => {
    const audits = pageSpeedData?.lighthouseResult?.audits;
    const desiredAudits = [
        'cross-origin-opener-policy', 'strict-transport-security', 'csp-xss',
        'no-vulnerable-libraries'
    ];
    return processAudits(audits, desiredAudits);
}

const getDiagnosticsAudits = (pageSpeedData: any): AuditInfo => {
    const audits = pageSpeedData?.lighthouseResult?.audits;
    const desiredAudits = [
        'legacy-javascript', 'duplicated-javascript', 'deprecations', 'errors-in-console',
        'third-party-summary', 'third-party-facades', 'user-timings',
        'layout-shift-elements', 'long-tasks', 'non-composited-animations',
        'font-display', 'font-size', 'tap-targets', 'viewport',
        'document-title', 'meta-description', 'http-status-code',
        'link-text', 'crawlable-anchors', 'is-crawlable', 'robots-txt',
        'image-alt', 'html-has-lang', 'hreflang', 'canonical',
        'installable-manifest', 'service-worker', 'splash-screen',
        'themed-omnibox', 'content-width',
    ];
    return processAudits(audits, desiredAudits);
}


export async function getFastAnalysis(url: string): Promise<Partial<AnalysisResult> | { error: string }> {
  try {
    const urlObject = new URL(url);
    const domain = urlObject.hostname;
    
    const ipApiUrl = `http://ip-api.com/json/${domain}`;
    
    const [
        ipInfoRes, 
        pageHtmlRes
    ] = await Promise.allSettled([
      fetch(ipApiUrl),
      fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }})
    ]);

    const ipInfoData = ipInfoRes.status === 'fulfilled' && ipInfoRes.value.ok ? await ipInfoRes.value.json() : null;

    if (pageHtmlRes.status === 'rejected' || (pageHtmlRes.status === 'fulfilled' && !pageHtmlRes.value.ok)) {
        if (ipInfoData && ipInfoData.status === 'fail') {
             return { error: 'Domain not found. The website is not reachable.' };
        }
        return { error: 'Could not fetch the main page of the website. It might be down or blocking requests.' };
    }
    
    const responseHeaders = getHeaders(pageHtmlRes.value);
    const pageHtml = await pageHtmlRes.value.text();
    
    const tempTitle = pageHtml.match(/<title>(.*?)<\/title>/)?.[1];
    const tempDescription = getMetaDescription(pageHtml);

    const finalResult: Partial<AnalysisResult> = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      overview: {
        url: url,
        domain: domain,
        title: tempTitle,
        description: tempDescription,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        htmlContent: pageHtml, // Pass the HTML for tech stack analysis
      },
      security: {
        isSecure: url.startsWith('https://'),
        securityHeaders: responseHeaders.security
      },
      metadata: {
        openGraphTags: getOgTags(pageHtml),
        hasRobotsTxt: false, // will be updated by pagespeed
        hasSitemapXml: false, // will be updated by pagespeed
      },
      hosting: {
        ip: ipInfoData?.query,
        isp: ipInfoData?.isp,
        country: ipInfoData?.countryCode,
      },
      headers: responseHeaders.all,
    };
    
    return finalResult;

  } catch (error: any) {
    console.error('Fast analysis failed:', error);
    if (error.cause && (error.cause.code === 'ENOTFOUND' || error.cause.code === 'EAI_AGAIN')) {
         return { error: 'Domain not found. The website is not reachable.' };
    }
    return { error: error.message || 'An unknown error occurred during initial analysis.' };
  }
}

export async function getPerformanceAnalysis(url: string): Promise<Pick<AnalysisResult, 'performance' | 'performanceAudits' | 'securityAudits' | 'diagnosticsAudits' | 'overview' | 'metadata'>> {
    const cacheKey = `performance:${url}`;
    const cached = await getCache(cacheKey);
    if (cached) return cached;

    const pageSpeedApiKey = process.env.PAGESPEED_API_KEY;
    const pageSpeedBaseUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO${pageSpeedApiKey ? `&key=${pageSpeedApiKey}` : ''}`;
    const pageSpeedMobileUrl = `${pageSpeedBaseUrl}&strategy=mobile`;
    const pageSpeedDesktopUrl = `${pageSpeedBaseUrl}&strategy=desktop`;

    const [
        pageSpeedMobileRes, 
        pageSpeedDesktopRes,
        sitemapRes, 
    ] = await Promise.allSettled([
      fetch(pageSpeedMobileUrl),
      fetch(pageSpeedDesktopUrl),
      fetch(`${new URL(url).origin}/sitemap.xml`, { method: 'HEAD' })
    ]);

    const pageSpeedMobileData = pageSpeedMobileRes.status === 'fulfilled' && pageSpeedMobileRes.value.ok ? await pageSpeedMobileRes.value.json() : null;
    const pageSpeedDesktopData = pageSpeedDesktopRes.status === 'fulfilled' && pageSpeedDesktopRes.value.ok ? await pageSpeedDesktopRes.value.json() : null;

    const overviewData = pageSpeedMobileData || pageSpeedDesktopData;
    const lighthouse = overviewData?.lighthouseResult;
    const audits = lighthouse?.audits;

    const perfTitle = lighthouse?.audits?.['document-title']?.details?.items[0]?.title;
    const perfDesc = lighthouse?.audits?.['meta-description']?.details?.items[0]?.description;


    const result = {
        performance: {
            mobile: getPerformanceData(pageSpeedMobileData),
            desktop: getPerformanceData(pageSpeedDesktopData)
        },
        performanceAudits: getPerformanceAudits(pageSpeedMobileData),
        securityAudits: getSecurityAudits(pageSpeedMobileData),
        diagnosticsAudits: getDiagnosticsAudits(pageSpeedMobileData),
        overview: { // This will update the existing overview data
            url: url,
            domain: new URL(url).hostname,
            title: !perfTitle || perfTitle.startsWith('http') ? undefined : perfTitle,
            description: perfDesc,
            language: audits?.['html-has-lang']?.details?.items[0]?.lang,
        },
        metadata: { // This will update the existing metadata
            openGraphTags: {}, // Already fetched in fast analysis
            hasRobotsTxt: audits?.['robots-txt']?.score === 1,
            hasSitemapXml: sitemapRes.status === 'fulfilled' && sitemapRes.value.ok,
        }
    };
    
    await setCache(cacheKey, result);
    return result;
}
