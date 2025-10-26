'use server';

import type { AnalysisResult, SecurityData } from '@/lib/types';
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

export async function analyzeUrl(url: string): Promise<AnalysisResult | { error: string }> {
  try {
    const urlObject = new URL(url);
    const domain = urlObject.hostname;
    
    // API keys can be stored in .env.local file
    const pageSpeedApiKey = process.env.PAGESPEED_API_KEY;

    const pageSpeedUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO${pageSpeedApiKey ? `&key=${pageSpeedApiKey}` : ''}`;
    const ipApiUrl = `http://ip-api.com/json/${domain}`;
    const sitemapUrl = `${urlObject.origin}/sitemap.xml`;
    
    const [pageSpeedRes, ipInfoRes, sitemapRes, pageHtmlRes] = await Promise.allSettled([
      fetch(pageSpeedUrl),
      fetch(ipApiUrl),
      fetch(sitemapUrl, { method: 'HEAD' }),
      fetch(url)
    ]);

    let partial = false;
    if (pageSpeedRes.status === 'rejected' || ipInfoRes.status === 'rejected' || pageHtmlRes.status === 'rejected') {
        partial = true;
    }
    
    const pageSpeedData = pageSpeedRes.status === 'fulfilled' && pageSpeedRes.value.ok ? await pageSpeedRes.value.json() : null;
    const ipInfoData = ipInfoRes.status === 'fulfilled' && ipInfoRes.value.ok ? await ipInfoRes.value.json() : null;
    
    let pageHtml = '';
    let responseHeaders = { all: {}, security: {} };
    if (pageHtmlRes.status === 'fulfilled' && pageHtmlRes.value.ok) {
        pageHtml = await pageHtmlRes.value.text();
        responseHeaders = getHeaders(pageHtmlRes.value);
    }


    if (!pageSpeedData && !ipInfoData) {
        throw new Error('All API requests failed. Unable to analyze the URL.');
    }

    const lighthouse = pageSpeedData?.lighthouseResult;
    const audits = lighthouse?.audits;

    const finalResult: AnalysisResult = {
      id: crypto.randomUUID(),
      overview: {
        url: url,
        domain: domain,
        title: audits?.['meta-description']?.title || pageSpeedData?.id.split('?')[0] || 'No title found',
        description: audits?.['meta-description']?.description || 'No description available.',
        language: audits?.['html-has-lang']?.details?.items[0]?.lang,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      },
      performance: {
        performanceScore: lighthouse ? Math.round(lighthouse.categories.performance.score * 100) : undefined,
        accessibilityScore: lighthouse ? Math.round(lighthouse.categories.accessibility.score * 100) : undefined,
        seoScore: lighthouse ? Math.round(lighthouse.categories.seo.score * 100) : undefined,
        bestPracticesScore: lighthouse ? Math.round(lighthouse.categories['best-practices'].score * 100) : undefined,
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
      createdAt: new Date().toISOString(),
      partial: partial,
    };
    
    return finalResult;

  } catch (error: any) {
    console.error('Analysis failed:', error);
    return { error: error.message || 'An unknown error occurred during analysis.' };
  }
}
