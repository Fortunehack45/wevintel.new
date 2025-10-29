
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Database, Shield, Home, Settings, Layers, Code, User, Send, Compass, ArrowRight, TrendingUp, BarChart, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="text-center space-y-4">
        <Compass className="h-16 w-16 text-primary mx-auto" />
        <h1 className="text-5xl font-bold tracking-tight text-foreground">About WebIntel</h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Uncovering the technology and performance behind any website with a powerful, open-source intelligence platform designed for developers, marketers, and the endlessly curious.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Info className="text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              In an increasingly complex digital landscape, understanding the mechanics behind a website is more important than ever. WebIntel was born from a simple idea: to democratize web intelligence. We aim to provide a comprehensive and accessible tool that empowers users to see what makes any website tick.
            </p>
            <p>
              We aggregate public data, run extensive analyses, and leverage cutting-edge AI to transform raw, technical information into clear, actionable insights. Whether you're a developer benchmarking against a competitor, a marketer researching a new space, or simply exploring the web, WebIntel is your trusted guide.
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Shield className="text-primary" />
              Our Commitment to Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>
              Your curiosity should be your own. WebIntel is architected with a "privacy-first" philosophy. All analysis history and comparisons are stored exclusively in your browser's local storage.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><span className="font-semibold text-foreground">No Server-Side Tracking:</span> We do not have a traditional backend server that logs your activity or the URLs you analyze.</li>
              <li><span className="font-semibold text-foreground">Client-Side History:</span> Your entire analysis history is yours alone. You can view, manage, and clear it at any time directly from the History page.</li>
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
        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 text-sm text-muted-foreground">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg"><TrendingUp className="h-5 w-5 text-primary shrink-0"/></div>
                <div>
                    <h4 className="font-semibold text-foreground">Comprehensive Performance Analysis</h4>
                    <p>Get detailed Core Web Vitals reports for both mobile and desktop, powered by Google PageSpeed Insights.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg"><Shield className="h-5 w-5 text-primary shrink-0"/></div>
                <div>
                    <h4 className="font-semibold text-foreground">In-Depth Security Scanning</h4>
                    <p>Checks for SSL/TLS, essential security headers like CSP and HSTS, and other potential vulnerabilities.</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg"><Send className="h-5 w-5 text-primary shrink-0"/></div>
                <div>
                    <h4 className="font-semibold text-foreground">AI-Powered Insights</h4>
                    <p>Receive AI-generated summaries, actionable recommendations, and traffic estimations to quickly understand a site's profile.</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg"><Layers className="h-5 w-5 text-primary shrink-0"/></div>
                <div>
                    <h4 className="font-semibold text-foreground">Technology Stack Detection</h4>
                    <p>Uncover the frameworks, libraries, CMS, and other services a website is built with, using advanced AI analysis.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg"><Database className="h-5 w-5 text-primary shrink-0"/></div>
                <div>
                    <h4 className="font-semibold text-foreground">Hosting & Domain Information</h4>
                    <p>Discover the IP address, ISP, and geographic location of the hosting server for any website.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg"><FileSearch className="h-5 w-5 text-primary shrink-0"/></div>
                <div>
                    <h4 className="font-semibold text-foreground">Metadata & SEO Health</h4>
                    <p>Inspects Open Graph tags, `robots.txt`, and `sitemap.xml` to evaluate SEO readiness and social sharing configuration.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg"><BarChart className="h-5 w-5 text-primary shrink-0"/></div>
                <div>
                    <h4 className="font-semibold text-foreground">Detailed Lighthouse Audits</h4>
                    <p>Access granular reports on performance, accessibility, best practices, and SEO from Google Lighthouse.</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg"><ArrowRight className="h-5 w-5 text-primary shrink-0 -rotate-45"/></div>
                <div>
                    <h4 className="font-semibold text-foreground">Side-by-Side Comparison</h4>
                    <p>Analyze two websites simultaneously to benchmark against competitors and see who comes out on top.</p>
                </div>
            </div>
             <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg"><Home className="h-5 w-5 text-primary shrink-0"/></div>
                <div>
                    <h4 className="font-semibold text-foreground">Responsive & Modern UI</h4>
                    <p>A clean, beautiful, and fully responsive interface built for an optimal experience on any device.</p>
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
              WebIntel is built with a modern, powerful, and scalable technology stack to ensure a fast, reliable, and intelligent experience.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
                <li><span className="font-semibold text-foreground">Next.js & React:</span> For a fast, server-rendered application with robust features, optimized performance, and a component-based architecture.</li>
                <li><span className="font-semibold text-foreground">Tailwind CSS & ShadCN/UI:</span> For a beautiful, responsive, and highly customizable user interface built with utility-first principles.</li>
                <li><span className="font-semibold text-foreground">Google Gemini & Genkit:</span> For integrating powerful generative AI features like analysis summaries, traffic estimations, and technology stack detection.</li>
                <li><span className="font-semibold text-foreground">Vercel:</span> For serverless deployment, continuous integration, and global hosting performance that ensures the app is fast for everyone.</li>
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
              To provide a comprehensive analysis, WebIntel gathers data from a variety of trusted, public APIs. We are grateful for these services that make this tool possible:
            </p>
            <ul className="list-disc pl-5 space-y-2 font-mono text-xs">
              <li>Google PageSpeed Insights</li>
              <li>ip-api.com</li>
              <li>Google Gemini (for all AI features)</li>
            </ul>
            <p className="text-xs">
              Please note that all data is fetched on-demand and represents a public snapshot of the target website at the time of analysis. For sensitive or private data, always refer to the website's official sources.
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
                    This project is a demonstration of modern web development techniques, including AI integration, responsive design, and performance optimization. If you are interested in collaborating on a project or exploring partnership opportunities, feel free to get in touch.
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
