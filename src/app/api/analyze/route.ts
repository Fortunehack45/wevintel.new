import {NextResponse} from 'next/server';
import type {AnalysisResult} from '@/lib/types';

export const dynamic = 'force-dynamic'; // Make sure it's always dynamic

async function fetchWithTimeout(resource: RequestInfo | URL, options: RequestInit & { timeout: number }) {
  const { timeout = 8000 } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const response = await fetch(resource, {
    ...options,
    signal: controller.signal  
  });
  clearTimeout(id);

  return response;
}


export async function GET(request: Request) {
  const {searchParams} = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({error: 'URL parameter is required'}, {status: 400});
  }

  let cleanUrl: string;
  try {
    const urlObject = new URL(url);
    cleanUrl = urlObject.href;
  } catch (error) {
    return NextResponse.json({error: 'Invalid URL provided'}, {status: 400});
  }

  const domain = new URL(cleanUrl).hostname;
  const pageSpeedApiKey = process.env.PAGESPEED_API_KEY;
  let partial = false;

  try {
    // If no API key, use mock data. Useful for local dev and PRs.
    if (!pageSpeedApiKey) {
        console.warn("PAGESPEED_API_KEY is not set. Using mock data.");
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate delay
        const mockResult: AnalysisResult = {
            id: crypto.randomUUID(),
            overview: {
                url: cleanUrl,
                domain: domain,
                title: 'Mock Website: The Future of the Web',
                description: 'This is a mock description for the website. In a real analysis, this content would be fetched directly from the site\'s meta tags.',
                language: 'en-US',
                favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
            },
            performance: { performanceScore: 85, accessibilityScore: 92, seoScore: 95, bestPracticesScore: 100 },
            security: { sslGrade: 'A+', securityHeadersGrade: 'A', domainExpiry: '2025-10-22', isSecure: url.startsWith('https://') },
            metadata: { openGraphTags: { 'og:title': 'Mock OG Title', 'og:description': 'Mock OG Description' }, hasRobotsTxt: true, hasSitemapXml: false },
            hosting: { ip: '8.8.8.8', isp: 'Mock ISP, e.g., Google Cloud', country: 'US' },
            createdAt: new Date().toISOString(),
            partial: true,
        };
        return NextResponse.json(mockResult);
    }
    
    const [pageSpeedRes, ipInfoRes] = await Promise.all([
        fetchWithTimeout(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(cleanUrl)}&key=${pageSpeedApiKey}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO`, { timeout: 15000 }).catch(e => { partial = true; return null; }),
        fetchWithTimeout(`https://ip-api.com/json/${domain}`, { timeout: 5000 }).catch(e => { partial = true; return null; }),
    ]);

    let pageSpeedData, ipInfoData;

    if (pageSpeedRes && pageSpeedRes.ok) {
        pageSpeedData = await pageSpeedRes.json();
    } else {
        partial = true;
    }

    if (ipInfoRes && ipInfoRes.ok) {
        ipInfoData = await ipInfoRes.json();
    } else {
        partial = true;
    }

    const lighthouse = pageSpeedData?.lighthouseResult;
    const audits = lighthouse?.audits;

    const finalResult: AnalysisResult = {
      id: crypto.randomUUID(),
      overview: {
        url: cleanUrl,
        domain: domain,
        title: audits?.['meta-description']?.title || lighthouse?.finalUrl,
        description: audits?.['meta-description']?.description,
        language: audits?.['html-has-lang']?.details?.items[0]?.lang,
        favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      },
      performance: {
        performanceScore: Math.round((lighthouse?.categories.performance.score || 0) * 100),
        accessibilityScore: Math.round((lighthouse?.categories.accessibility.score || 0) * 100),
        seoScore: Math.round((lighthouse?.categories.seo.score || 0) * 100),
        bestPracticesScore: Math.round((lighthouse?.categories['best-practices'].score || 0) * 100),
      },
      security: {
        // These are complex and often require dedicated paid APIs. Mocking for now.
        sslGrade: 'A', 
        securityHeadersGrade: 'B',
        domainExpiry: '2025-01-01',
        isSecure: cleanUrl.startsWith('https://') && lighthouse?.audits['is-on-https']?.score === 1,
      },
      metadata: {
        openGraphTags: {}, // PageSpeed API doesn't provide this easily
        hasRobotsTxt: audits?.['robots-txt']?.score === 1,
        hasSitemapXml: false, // This check is complex and not in PageSpeed.
      },
      hosting: {
        ip: ipInfoData?.query,
        isp: ipInfoData?.isp,
        country: ipInfoData?.country,
      },
      createdAt: new Date().toISOString(),
      partial,
    };
    
    return NextResponse.json(finalResult);

  } catch (error: any) {
    console.error('Analysis failed:', error);
    return NextResponse.json({error: error.message || 'An unknown error occurred during analysis.'}, {status: 500});
  }
}
