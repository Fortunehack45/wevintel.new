
import { Suspense } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AnalysisPageContent } from '@/components/analysis/analysis-page-content';

function ErrorAlert({title, description}: {title: string, description: string}) {
    return (
        <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
        </Alert>
    );
}

// This is the main page component, now a pure SERVER component.
// It is async and handles the params object from the URL.
export default function AnalysisPage({ params }: { params: { url: string } }) {
  let decodedUrl = '';
  try {
    // The params object is handled here, in a Server Component.
    decodedUrl = decodeURIComponent(params.url);
    const urlObject = new URL(decodedUrl);
    if (urlObject.protocol !== 'http:' && urlObject.protocol !== 'https:') {
        throw new Error('Invalid protocol');
    }
  } catch (e) {
    return (
        <ErrorAlert title="Invalid URL" description="The provided URL is not valid. Please go back and try again with a valid URL (e.g., https://example.com)." />
    )
  }

  // We pass the clean, validated string as a prop to the client component.
  return <AnalysisPageContent decodedUrl={decodedUrl} />;
}
