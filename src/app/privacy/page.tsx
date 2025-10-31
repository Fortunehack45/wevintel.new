'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Shield, ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { privacyContent } from "@/lib/privacy-content";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PrivacyPage() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = privacyContent.length;

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1));
  };

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0));
  };

  const currentArticle = privacyContent[currentPage];
  const progressValue = ((currentPage + 1) / totalPages) * 100;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          Privacy Policy
        </h1>
        <Button asChild variant="outline">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <CardTitle>{currentArticle.title}</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Go to Article... <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {privacyContent.map((article, index) => (
                  <DropdownMenuItem key={index} onSelect={() => setCurrentPage(index)}>
                    {article.title}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm text-muted-foreground pt-2">Last Updated: October 31, 2025</p>
        </CardHeader>
        <CardContent className="prose prose-sm sm:prose-base dark:prose-invert max-w-none prose-h3:font-bold prose-h3:text-lg prose-p:leading-relaxed prose-ul:list-disc prose-ul:pl-6 prose-li:my-2 text-foreground/90">
          <Progress value={progressValue} className="w-full mb-6" />
          
          <div
            dangerouslySetInnerHTML={{ __html: currentArticle.content }}
          />

          <div className="flex justify-between items-center mt-12 not-prose">
            <Button onClick={handlePrev} disabled={currentPage === 0} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <p className="text-sm font-medium">
              Page {currentPage + 1} of {totalPages}
            </p>
            <Button onClick={handleNext} disabled={currentPage === totalPages - 1} variant="outline">
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}