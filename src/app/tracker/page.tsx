import { GeneratorForm } from '@/components/tracker/generator-form';

export default function TrackerPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full">
      <div className="max-w-3xl w-full">
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent/80">
            Smart Tracker Script
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-xl mx-auto">
            Generate an AI-powered tracking script for your website. It intelligently decides which visitor events to record.
          </p>
        </div>
        <GeneratorForm />
      </div>
    </div>
  );
}
