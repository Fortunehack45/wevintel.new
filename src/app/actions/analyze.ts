
'use server';

import type { AnalysisResult, PerformanceData, SecurityData, AuditInfo, AuditItem } from '@/lib/types';
import 'dotenv/config';

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
        // Performance
        'server-response-time',
        'first-contentful-paint',
        'largest-contentful-paint',
        'cumulative-layout-shift',
        'speed-index',
        'total-blocking-time',
        'max-potential-fid',
        'interactive',
        'inp-breakdown',

        // Optimization & Best Practices
        'uses-responsive-images',
        'uses-webp-images',
        'offscreen-images',
        'unminified-css',
        'unminified-javascript',
        'unused-css-rules',
        'unused-javascript',
        'uses-optimized-images',
        'uses-long-cache-ttl',
        'total-byte-weight',
        'dom-size',
        'render-blocking-resources',
        'third-party-summary',
        'mainthread-work-breakdown',
        'network-requests',
        'legacy-javascript',
        'duplicated-javascript',
        'efficient-animated-content',
        'font-display',
        'lcp-lazy-loaded',

        // Accessibility & SEO
        'viewport',
        'document-title',
        'meta-description',
        'http-status-code',
        'link-text',
        'crawlable-anchors',
        'is-crawlable',
        'robots-txt',
        'image-alt',
        'html-has-lang',
        'hreflang',
        'canonical',
        'font-size',
        'plugins',
        'tap-targets',
        
        // PWA
        'installable-manifest',
        'service-worker',
        'splash-screen',
        'themed-omnibox',
        'content-width',

        // Diagnostics
        'largest-contentful-paint-element',
        'layout-shift-elements',
        'long-tasks',
        'non-composited-animations',
        'user-timings',
        'uses-explicit-width-and-height',
        
        // New Security & Diagnostics
        'cross-origin-opener-policy',
        'strict-transport-security',
        'csp-xss',
        'deprecations',
        'errors-in-console',
        'third-party-facades',
        'no-vulnerable-libraries',
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

export async function getFastAnalysis(url: string): Promise<Partial<AnalysisResult> | { error: string }> {
  try {
    const urlObject = new URL(url);
    const domain = urlObject.hostname;
    
    const ipApiUrl = `http://ip-api.com/json/${domain}`;
    const sitemapUrl = `${urlObject.origin}/sitemap.xml`;
    
    const [
        ipInfoRes, 
        sitemapRes, 
        pageHtmlRes
    ] = await Promise.allSettled([
      fetch(ipApiUrl),
      fetch(sitemapUrl, { method: 'HEAD' }),
      fetch(url)
    ]);

    const ipInfoData = ipInfoRes.status === 'fulfilled' && ipInfoRes.value.ok ? await ipInfoRes.value.json() : null;
    
    let pageHtml = '';
    let responseHeaders = { all: {}, security: {} };
    if (pageHtmlRes.status === 'fulfilled' && pageHtmlRes.value.ok) {
        pageHtml = await pageHtmlRes.value.text();
        responseHeaders = getHeaders(pageHtmlRes.value);
    }
    
    const tempTitle = pageHtml.match(/<title>(.*?)<\/title>/)?.[1] || 'No title found';

    const finalResult: Partial<AnalysisResult> = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      overview: {
        url: url,
        domain: domain,
        title: tempTitle,
        description: 'Loading...',
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      },
      security: {
        sslGrade: 'N/A',
        securityHeadersGrade: 'N/A',
        domainExpiry: 'N/A',
        isSecure: url.startsWith('https://'),
        securityHeaders: responseHeaders.security
      },
      metadata: {
        openGraphTags: getOgTags(pageHtml),
        hasRobotsTxt: false, // will be updated by pagespeed
        hasSitemapXml: sitemapRes.status === 'fulfilled' && sitemapRes.value.ok,
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
    return { error: error.message || 'An unknown error occurred during initial analysis.' };
  }
}

export async function getPerformanceAnalysis(url: string): Promise<Pick<AnalysisResult, 'performance' | 'audits' | 'overview' | 'metadata'>> {
    const pageSpeedApiKey = process.env.PAGESPEED_API_KEY;
    const pageSpeedBaseUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO${pageSpeedApiKey ? `&key=${pageSpeedApiKey}` : ''}`;
    const pageSpeedMobileUrl = `${pageSpeedBaseUrl}&strategy=mobile`;
    const pageSpeedDesktopUrl = `${pageSpeedBaseUrl}&strategy=desktop`;

    const [
        pageSpeedMobileRes, 
        pageSpeedDesktopRes, 
    ] = await Promise.allSettled([
      fetch(pageSpeedMobileUrl),
      fetch(pageSpeedDesktopUrl),
    ]);

    const pageSpeedMobileData = pageSpeedMobileRes.status === 'fulfilled' && pageSpeedMobileRes.value.ok ? await pageSpeedMobileRes.value.json() : null;
    const pageSpeedDesktopData = pageSpeedDesktopRes.status === 'fulfilled' && pageSpeedDesktopRes.value.ok ? await pageSpeedDesktopRes.value.json() : null;

    const overviewData = pageSpeedMobileData || pageSpeedDesktopData;
    const lighthouse = overviewData?.lighthouseResult;
    const audits = lighthouse?.audits;

    return {
        performance: {
            mobile: getPerformanceData(pageSpeedMobileData),
            desktop: getPerformanceData(pageSpeedDesktopData)
        },
        audits: getAuditInfo(pageSpeedMobileData), // Using mobile data for audits for now
        overview: { // This will update the existing overview data
            url: url,
            domain: new URL(url).hostname,
            title: lighthouse?.audits?.['document-title']?.details?.items[0]?.title || overviewData?.id.split('?')[0] || 'No title found',
            description: lighthouse?.audits?.['meta-description']?.details?.items[0]?.description || 'No description available.',
            language: audits?.['html-has-lang']?.details?.items[0]?.lang,
        },
        metadata: { // This will update the existing metadata
            openGraphTags: {}, // Already fetched in fast analysis
            hasRobotsTxt: audits?.['robots-txt']?.score === 1,
            hasSitemapXml: false, // Already fetched
        }
    };
}
