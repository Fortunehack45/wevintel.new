

import { z } from 'zod';

export type AnalysisResult = {
  id: string;
  overview: WebsiteOverview;
  performance?: {
    mobile: PerformanceData;
    desktop: PerformanceData;
  };
  security?: SecurityData;
  traffic?: TrafficData;
  metadata?: Metadata;
  hosting?: HostingInfo;
  headers?: HeaderInfo;
  performanceAudits?: AuditInfo;
  securityAudits?: AuditInfo;
  diagnosticsAudits?: AuditInfo;
  techStack?: TechStackData;
  status?: StatusData;
  createdAt: string; // ISO 8601 string
  error?: string;
  partial?: boolean;
  aiSummary?: { summary: AISummary; error?: never } | { summary?: never; error: string } | null;
};

export type WebsiteOverview = {
  url: string;
  domain: string;
  title?: string;
  description?: string;
  language?: string;
  favicon?: string;
  htmlContent?: string;
};

export type PerformanceData = {
  performanceScore?: number;
  accessibilityScore?: number;
  seoScore?: number;
  bestPracticesScore?: number;
  speedIndex?: string;
  largestContentfulPaint?: string;
  totalBlockingTime?: string;
  firstContentfulPaint?: string;
  cumulativeLayoutShift?: string;
  interactionToNextPaint?: string;
};

export type SecurityData = {
  isSecure: boolean;
  securityScore?: number;
  securityHeaders: {
    'content-security-policy'?: boolean;
    'strict-transport-security'?: boolean;
    'x-frame-options'?: boolean;
    'x-content-type-options'?: boolean;
  }
};

export type TrafficData = {
    estimatedMonthlyVisits?: number;
    estimationConfidence?: 'low' | 'medium' | 'high';
    trafficSources?: {
        direct: number;
        search: number;
        social: number;
        referral: number;
    };
    topCountries?: {
        country: string;
        percentage: number;
    }[];
    engagement?: {
        avgSessionDuration: string; // e.g., "5m 30s"
        bounceRate: number; // percentage
    };
}

export type Metadata = {
  openGraphTags: Record<string, string>;
  hasRobotsTxt: boolean;
  hasSitemapXml: boolean;
};

export type HostingInfo = {
  ip?: string;
  isp?: string;
  country?: string;
};

export type HeaderInfo = {
    [key:string]: string;
}

export type AuditItem = {
    id: string;
    title: string;
    description: string;
    score: number | null;
    displayValue?: string;
}

export type AuditInfo = {
    [key: string]: AuditItem;
}

export type AISummary = {
  summary: string;
  recommendations: string[];
}

export type HistoryItem = Pick<AnalysisResult, 'id' | 'overview' | 'performance' | 'security' | 'createdAt'>;

export type ComparisonHistoryItem = {
  id: string;
  url1: string;
  url2: string;
  domain1: string;
  domain2: string;
  createdAt: string;
}

export type TechStackItem = {
  name: string;
  category: string;
  confidence: number;
  description?: string;
};

export type TechStackData = TechStackItem[];

export type StatusData = {
  isOnline: boolean;
  httpStatus?: number;
  responseTime?: number; // in ms
  finalUrl?: string; // To check for redirects
};

// Types for Website Comparison Flow
const WebsiteDataSchema = z.object({
  url: z.string(),
  performanceScore: z.number().optional(),
  securityScore: z.number().optional(),
  techStack: z.array(z.string()).optional(),
  hostingCountry: z.string().optional(),
});

export const ComparisonInputSchema = z.object({
  site1: WebsiteDataSchema,
  site2: WebsiteDataSchema,
});
export type ComparisonInput = z.infer<typeof ComparisonInputSchema>;

export const ComparisonOutputSchema = z.object({
  title: z.string().describe("A compelling, short title for the comparison, like 'Performance Showdown: Site A vs. Site B'."),
  summary: z.string().describe("A two-paragraph comparative summary. The first paragraph compares the key metrics (performance, security). The second paragraph discusses the technology stack differences and hosting location implications. Maintain a neutral, expert tone."),
  winner: z.string().describe("The domain name of the winning website based on a holistic view of performance and security scores. If it's a tie or scores are very close, return 'Tie'."),
});
export type ComparisonOutput = z.infer<typeof ComparisonOutputSchema>;
