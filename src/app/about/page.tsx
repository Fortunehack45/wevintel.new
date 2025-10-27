
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Database, Shield, Home, Settings, Layers, Code, User, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold tracking-tight text-foreground">About WebIntel</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Uncovering the technology and performance behind any website with powerful, open-source intelligence.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Info className="text-primary" />
              What is WebIntel?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              WebIntel is a powerful, privacy-focused tool designed to give developers, marketers, and curious minds a comprehensive analysis of any website. 
            </p>
            <p>
              It aggregates public data from various open APIs and uses AI to provide deep insights into a site&apos;s performance, security, SEO, and hosting infrastructure, all presented in a beautiful and easy-to-understand dashboard.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="text-primary" />
              Privacy First
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Your privacy is paramount. WebIntel operates entirely on your client-side (your browser) for history storage.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold text-foreground">No Backend Tracking:</span> We do not have a traditional backend server that logs your activity or the URLs you analyse.</li>
              <li><span className="font-semibold text-foreground">Local Storage:</span> Your analysis history is stored exclusively in your browser&apos;s local storage, which you can clear at any time.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Settings className="text-primary" />
            Core Features
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
                <Code className="h-5 w-5 mt-1 text-primary shrink-0"/>
                <div>
                    <h4 className="font-semibold text-foreground">Performance Analysis</h4>
                    <p>Core Web Vitals for mobile and desktop using Google PageSpeed Insights.</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 mt-1 text-primary shrink-0"/>
                <div>
                    <h4 className="font-semibold text-foreground">Security Scanning</h4>
                    <p>Checks for SSL, security headers, and other potential vulnerabilities.</p>
                </div>
            </div>
             <div className="flex items-start gap-3">
                <Send className="h-5 w-5 mt-1 text-primary shrink-0"/>
                <div>
                    <h4 className="font-semibold text-foreground">AI-Powered Insights</h4>
                    <p>Get AI-generated summaries, recommendations, and traffic estimations.</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <Info className="h-5 w-5 mt-1 text-primary shrink-0"/>
                <div>
                    <h4 className="font-semibold text-foreground">Hosting Information</h4>
                    <p>Discover the IP address, ISP, and geographic location of the hosting server.</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <Database className="h-5 w-5 mt-1 text-primary shrink-0"/>
                <div>
                    <h4 className="font-semibold text-foreground">Metadata & SEO</h4>
                    <p>Inspects Open Graph tags, robots.txt, and sitemap.xml for SEO health.</p>
                </div>
            </div>
            <div className="flex items-start gap-3">
                <Code className="h-5 w-5 mt-1 text-primary shrink-0"/>
                <div>
                    <h4 className="font-semibold text-foreground">In-Depth Audits</h4>
                    <p>Detailed technical audits from Lighthouse for performance and best practices.</p>
                </div>
            </div>
        </CardContent>
      </Card>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Layers className="text-primary" />
              Technology Stack
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              WebIntel is built with a modern, powerful, and scalable technology stack to ensure a fast and reliable experience.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><span className="font-semibold text-foreground">Next.js:</span> For a fast, server-rendered React application.</li>
                <li><span className="font-semibold text-foreground">Tailwind CSS & ShadCN/UI:</span> For a beautiful and responsive user interface.</li>
                <li><span className="font-semibold text-foreground">Genkit:</span> For integrating powerful AI features seamlessly.</li>
                <li><span className="font-semibold text-foreground">Vercel:</span> For serverless deployment and hosting.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Database className="text-primary" />
              Data Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              WebIntel gathers data from a variety of trusted public APIs. We are grateful for these services that make this tool possible:
            </p>
            <ul className="list-disc pl-5 space-y-2 font-mono text-xs">
              <li>Google PageSpeed Insights</li>
              <li>ip-api.com</li>
              <li>Google Gemini (for AI features)</li>
            </ul>
            <p className="text-xs">
              Please note that all data is fetched on-demand and represents a public snapshot of the target website at the time of analysis.
            </p>
          </CardContent>
        </Card>
      </div>

       <Card className="glass-card">
        <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3">
                <User className="text-primary"/>
                About the Developer
            </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src="https://github.com/fortunesad.png" alt="Fortune"/>
                <AvatarFallback>F</AvatarFallback>
            </Avatar>
            <div className="max-w-xl">
                <h3 className="text-2xl font-bold">Fortune</h3>
                <p className="text-muted-foreground mt-2">
                    Fortune is a passionate software and web developer with a love for building creative and impactful solutions. With a keen eye for detail and a drive for excellence, he specialises in turning complex problems into elegant, user-friendly applications.
                </p>
                <p className="text-muted-foreground mt-4">
                    If you are interested in collaborating on a project or exploring partnership opportunities, feel free to get in touch.
                </p>
            </div>
             <Button asChild>
                <a href="https://wa.me/2349167689200" target="_blank" rel="noopener noreferrer">
                    <Send className="mr-2 h-4 w-4" />
                    Contact Fortune
                </a>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
