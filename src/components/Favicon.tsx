"use client";

import { Globe } from "lucide-react";
import { useState } from "react";

export function Favicon({ domain }: { domain: string }) {
  const [hasError, setHasError] = useState(false);
  // Using the correct `domain` parameter for the service.
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

  const handleError = () => {
    setHasError(true);
  };

  if (!domain || hasError) {
    return <Globe className="h-5 w-5 text-muted-foreground" />;
  }

  return (
    <img
      src={faviconUrl}
      alt={`${domain} favicon`}
      width={20}
      height={20}
      className="rounded-full flex-shrink-0"
      onError={handleError}
      crossOrigin="anonymous"
    />
  );
}
