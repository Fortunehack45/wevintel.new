
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Info, Code, User, Send, Compass, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-12">
      <div className="mb-8">
        <Button asChild variant="outline">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="text-center space-y-4">
        <Compass className="h-16 w-16 text-primary mx-auto" />
        <h1 className="text-5xl font-bold tracking-tight text-foreground">About WebIntel</h1>
      </div>

      <Card className="glass-card">
        <CardHeader>
            <CardTitle className="flex items-center gap-3">
                <Info className="text-primary" />
                About The Platform
            </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
            <p>
                WebIntel is a next-generation website analysis and intelligence platform meticulously crafted to empower developers, digital strategists, cybersecurity experts, and businesses with actionable insights derived from real-time data. Designed to merge precision, privacy, and performance, WebIntel enables users to conduct comprehensive evaluations of websites and web applications through an advanced, AI-driven interface.
            </p>
            <p>
                Built on modern web architecture, WebIntel provides a unified analytical ecosystem capable of identifying a site’s performance metrics, underlying technologies, security posture, SEO readiness, and hosting infrastructure — all without compromising user privacy or data control. Unlike conventional analytics platforms, WebIntel operates on a client-first model, meaning all historical data and analytical interactions are stored locally within the user’s browser. No centralized database is used for tracking, profiling, or retaining user behavior, ensuring absolute privacy and transparency in line with global data protection principles.
            </p>
            <p>
                At its core, WebIntel integrates multiple layers of intelligence — leveraging public APIs such as Google PageSpeed Insights, IP-API, and Google Gemini — to assemble a holistic, verifiable overview of any target domain. Whether analyzing a personal portfolio site, a high-traffic eCommerce platform, or an enterprise-grade infrastructure, WebIntel delivers structured intelligence through an elegant, user-centric interface that reflects modern UI/UX standards.
            </p>
            <p>
                The platform’s engineering approach follows a modular and privacy-preserving philosophy, blending innovation with accountability. Users retain full control over their analytical data and activity records through browser-based local storage. The application uses Firebase Authentication exclusively for login and session validation — without persistent user tracking or data harvesting. All analysis data fetched through external APIs is processed in real time and is never stored or reused outside the user's active session.
            </p>
            <p>
                WebIntel stands as a symbol of next-generation digital responsibility — combining transparency, AI-assisted intelligence, and ethical design to redefine how website analytics should function in a privacy-conscious digital era.
            </p>
        </CardContent>
      </Card>

       <Card className="glass-card">
        <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-3">
                <User className="text-primary"/>
                About the Developer
            </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center space-y-6">
            <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src="https://github.com/fortunesad.png" alt="Fortune"/>
                <AvatarFallback>F</AvatarFallback>
            </Avatar>
            <div className="max-w-3xl">
                <h3 className="text-2xl font-bold">Esho Fortune Adebayo Emmanuel</h3>
                <p className="text-primary font-semibold">Software Engineer | Database Developer | UI/UX Designer | Innovator</p>
                
                <div className="mt-4 text-left text-muted-foreground space-y-4">
                     <p>
                       Fortune is an 18-year-old Nigerian software developer and technology innovator dedicated to building solutions at the intersection of AI, Web3, and modern web infrastructure. Guided by a deep passion for creativity and engineering precision, he has become known for transforming complex ideas into intuitive, scalable, and visually compelling digital products.
                    </p>
                    <p>
                        With an unwavering belief in technological empowerment, Fortune’s work on WebIntel reflects his mission to democratize access to analytical intelligence and redefine what responsible innovation means in the modern web ecosystem. His development philosophy emphasizes privacy by design, clarity in function, and beauty in user experience — values that have shaped the DNA of WebIntel from its earliest conceptual stages.
                    </p>
                    <p>
                        Throughout his projects, Fortune has displayed a remarkable ability to bridge technical rigor with imaginative foresight. From crafting blockchain-powered financial systems to designing immersive digital experiences, his development process blends research, experimentation, and an acute sensitivity to user needs. The same philosophy underpins WebIntel — a tool engineered not merely as a product, but as a technological statement on digital ethics and autonomy.
                    </p>
                     <p>
                        Beyond software development, Fortune is a creative strategist who draws inspiration from the narrative complexity of cinema, the competitiveness of gaming, and the logic of systems engineering. These influences inform his vision of building platforms that are both functional and philosophically resonant — tools that engage, educate, and empower their users.
                    </p>
                    <p>
                        Every line of code within WebIntel represents a commitment to purpose, precision, and progress. Fortune’s approach extends beyond technological innovation; it embodies a belief that data should serve humanity, not exploit it. This belief defines not only the essence of WebIntel but also the broader trajectory of his work as a next-generation technologist.
                    </p>
                    <p>
                        As the sole developer and creative architect behind WebIntel, Fortune continues to refine and expand the platform’s capabilities, ensuring that it remains accessible, transparent, and compliant with international digital standards. His forward-thinking approach aims to make WebIntel not just a tool for analysis, but a global benchmark for ethical AI and web intelligence systems.
                    </p>
                </div>
            </div>
             <Button asChild className="mt-6">
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
