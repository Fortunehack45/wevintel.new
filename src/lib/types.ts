

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
  domain?: DomainData;
  status?: StatusData;
  createdAt: string; // ISO 8601 string
  error?: string;
  partial?: boolean;
  aiSummary?: AISummary | null;
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
    [key: string]: string;
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

export type TechStackItem = {
  name: string;
  category: string;
  confidence: number;
  description?: string;
};

export type TechStackData = TechStackItem[];

export type DomainData = {
  registrar?: string;
  creationDate?: string;
  expirationDate?: string;
  updatedDate?: string;
  status?: string[];
  nameservers?: string[];
};

export type StatusData = {
  isOnline: boolean;
  httpStatus?: number;
  responseTime?: number; // in ms
  finalUrl?: string; // To check for redirects
};
