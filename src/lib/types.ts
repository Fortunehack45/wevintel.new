
export type AnalysisResult = {
  id: string;
  overview: WebsiteOverview;
  performance: PerformanceData;
  security: SecurityData;
  metadata: Metadata;
  hosting: HostingInfo;
  createdAt: string; // ISO 8601 string
  error?: string;
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
};

export type SecurityData = {
  sslGrade?: string;
  securityHeadersGrade?: string;
  domainExpiry?: string;
  isSecure: boolean;
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
