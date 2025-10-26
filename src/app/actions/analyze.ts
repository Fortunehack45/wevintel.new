'use server';

import type { AnalysisResult } from '@/lib/types';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore as getAdminFirestore } from 'firebase-admin/firestore';


// This is a temporary solution to get the user ID on the server.
// In a real app, you'd get this from a proper authentication context.
async function getUserId() {
    try {
        const { getAuth } = await import('firebase/auth');
        const { app } = await import('@/firebase/config');
        const auth = getAuth(app);
        if (auth.currentUser) {
            return auth.currentUser.uid;
        }

        const { signInAnonymously } = await import('firebase/auth');
        const userCredential = await signInAnonymously(auth);
        return userCredential.user.uid;
    } catch(e) {
        // This will happen on the server, so we'll fall back to a server-side auth method.
        return null;
    }
}


const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT) : null;

if (serviceAccount && getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const adminDb = serviceAccount ? getAdminFirestore() : null;

export async function analyzeUrl(url: string, userId?: string | null): Promise<AnalysisResult | { error: string }> {
  try {
    const urlObject = new URL(url);
    const domain = urlObject.hostname;
    const pageSpeedApiKey = process.env.PAGESPEED_API_KEY;
    const ipInfoApiKey = process.env.IPINFO_API_TOKEN;

    const useMockData = !pageSpeedApiKey || !ipInfoApiKey;

    let finalResult: AnalysisResult;

    if (useMockData) {
      console.warn("API keys missing. Using mock data for analysis.");
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      finalResult = {
        overview: {
          url: url,
          domain: domain,
          title: 'Mock Website: The Future of the Web',
          description: 'This is a mock description for the website. In a real analysis, this content would be fetched directly from the site\'s meta tags, providing SEO-relevant information.',
          language: 'en-US',
          favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
        },
        performance: { performanceScore: 85, accessibilityScore: 92, seoScore: 95, bestPracticesScore: 100 },
        security: { sslGrade: 'A+', securityHeadersGrade: 'A', domainExpiry: '2025-10-22', isSecure: url.startsWith('https://') },
        metadata: { openGraphTags: { 'og:title': 'Mock OG Title', 'og:description': 'Mock OG Description', 'og:image': 'https://picsum.photos/seed/1/1200/630' }, hasRobotsTxt: true, hasSitemapXml: false },
        hosting: { ip: '8.8.8.8', isp: 'Mock ISP, e.g., Google Cloud', country: 'US' },
      };
    } else {
        const [pageSpeedRes, ipInfoRes] = await Promise.all([
          fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${pageSpeedApiKey}&category=PERFORMANCE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=SEO`),
          fetch(`https://ipinfo.io/${domain}?token=${ipInfoApiKey}`)
        ]);

        if (!pageSpeedRes.ok) {
            const errorData = await pageSpeedRes.json();
            throw new Error(`PageSpeed API failed: ${errorData.error.message}`);
        }
        if (!ipInfoRes.ok) throw new Error(`IPinfo API failed with status: ${ipInfoRes.status}`);

        const pageSpeedData = await pageSpeedRes.json();
        const ipInfoData = await ipInfoRes.json();

        const lighthouse = pageSpeedData.lighthouseResult;
        const audits = lighthouse.audits;
        
        finalResult = {
          overview: {
            url: url,
            domain: domain,
            title: audits['meta-description']?.title,
            description: audits['meta-description']?.description,
            language: audits['html-has-lang']?.details?.items[0]?.lang,
            favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
          },
          performance: {
            performanceScore: Math.round(lighthouse.categories.performance.score * 100),
            accessibilityScore: Math.round(lighthouse.categories.accessibility.score * 100),
            seoScore: Math.round(lighthouse.categories.seo.score * 100),
            bestPracticesScore: Math.round(lighthouse.categories['best-practices'].score * 100),
          },
          security: {
            sslGrade: 'A+', // Mocked - requires dedicated API
            securityHeadersGrade: 'A', // Mocked - requires dedicated API
            domainExpiry: '2025-10-22', // Mocked - requires WHOIS API
            isSecure: url.startsWith('https://'),
          },
          metadata: {
            openGraphTags: {}, // PageSpeed doesn't easily provide all OG tags
            hasRobotsTxt: audits['robots-txt']?.score === 1,
            hasSitemapXml: false, // This check is complex; mocking for now
          },
          hosting: {
            ip: ipInfoData.ip,
            isp: ipInfoData.org,
            country: ipInfoData.country,
          },
        };
    }

    if (userId && adminDb) {
        try {
            await adminDb.collection('analyses').add({
                ...finalResult,
                userId: userId,
                createdAt: serverTimestamp(),
            });
        } catch (e: any) {
            console.error("Failed to save analysis to Firestore:", e);
            // Don't block the user from seeing the result if Firestore fails
        }
    }


    return finalResult;

  } catch (error: any) {
    console.error('Analysis failed:', error);
    return { error: error.message || 'An unknown error occurred during analysis.' };
  }
}
