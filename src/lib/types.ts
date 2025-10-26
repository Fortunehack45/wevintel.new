
export type AnalysisResult = {
  id: string;
  overview: WebsiteOverview;
  performance: {
    mobile: PerformanceData;
    desktop: PerformanceData;
  };
  security: SecurityData;
  metadata: Metadata;
  hosting: HostingInfo;
  headers: HeaderInfo;
  performanceAudits: AuditInfo;
  securityAudits: AuditInfo;
  diagnosticsAudits: AuditInfo;
  createdAt: string; // ISO 8601 string
  error?: string;
  partial?: boolean;
};

export type WebsiteOverview = {
  url: string;
  domain: string;
  title?: string;
  description?: string;
  language?: string;
  favicon?: string;
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
};

export type SecurityData = {
  sslGrade?: string;
  securityHeadersGrade?: string;
  domainExpiry?: string;
  isSecure: boolean;
  securityHeaders: {
    'content-security-policy'?: boolean;
    'strict-transport-security'?: boolean;
    'x-frame-options'?: boolean;
    'x-content-type-options'?: boolean;
  }
};

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
