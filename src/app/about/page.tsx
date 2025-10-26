import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Database, Shield, Lock } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-foreground">About WebIntel</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Your open-source tool for instant website intelligence.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="text-primary" />
            What is WebIntel?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            WebIntel is a powerful, privacy-focused tool designed to give you a comprehensive analysis of any website. It aggregates public data from various open APIs to provide insights into a site&apos;s performance, security, SEO, and hosting infrastructure.
          </p>
          <p>
            This application is built to be fast, modern, and completely serverless, meaning it can be deployed on platforms like Vercel with zero backend configuration.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="text-primary" />
            Privacy First
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Your privacy is paramount. WebIntel operates entirely on your client-side (your browser) or through serverless functions that act as a proxy.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><span className="font-semibold text-foreground">No Backend Tracking:</span> We do not have a traditional backend server that logs your activity or the URLs you analyze.</li>
            <li><span className="font-semibold text-foreground">Local Storage:</span> Your analysis history is stored exclusively in your browser&apos;s local storage. You have full control and can clear it at any time.</li>
            <li><span className="font-semibold text-foreground">Open Source:</span> The entire codebase is open for inspection, so you can see exactly how it works.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="text-primary" />
            Data Sources
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            WebIntel gathers data from a variety of trusted public APIs. We are grateful for these services that make this tool possible:
          </p>
          <ul className="list-disc pl-5 space-y-2 font-mono text-sm">
            <li>Google PageSpeed Insights: For performance, accessibility, SEO, and best practices scores.</li>
            <li>ip-api.com: For IP geolocation and ISP information.</li>
            <li>Various security APIs for SSL and header checks.</li>
          </ul>
          <p>
            Please note that all data is fetched on-demand and represents a public snapshot of the target website at the time of analysis.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
