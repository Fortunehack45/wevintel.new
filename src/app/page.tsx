import { UrlForm } from '@/components/url-form';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full -mt-16">
      <div className="max-w-3xl w-full">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent/80">
            Web Insights
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
            Uncover the secrets of any website. Enter a URL to generate a complete intelligence report.
          </p>
        </div>
        <UrlForm />
        <p className="mt-4 text-sm text-muted-foreground">
          Get insights on performance, security, SEO, and more.
        </p>
      </div>
    </div>
  );
}
