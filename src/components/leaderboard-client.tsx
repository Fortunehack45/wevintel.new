
"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { topSites } from "@/lib/top-sites";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BarChart, Tv, ShoppingCart, Newspaper, Cpu, Code, Brush, Music, Video, VenetianMask, MessageCircle, Gamepad, BookOpen, Building2, Cloud, DollarSign, Plane, Car, Utensils, Home, Bot, FlaskConical, Search, Globe, Wind } from "lucide-react";
import { useMemo } from "react";

const categoryIcons: { [key: string]: React.ElementType } = {
  'Search Engine': Search,
  'Video': Video,
  'Social Media': MessageCircle,
  'Reference': BookOpen,
  'E-commerce': ShoppingCart,
  'Streaming': Tv,
  'Professional': Building2,
  'News': Newspaper,
  'Technology': Cpu,
  'Developer': Code,
  'Design': Brush,
  'Music': Music,
  'Entertainment': VenetianMask,
  'Gaming': Gamepad,
  'Education': BookOpen,
  'Science': FlaskConical,
  'Health': FlaskConical,
  'Food': Utensils,
  'Business': Building2,
  'Sports': BarChart,
  'Cloud Storage': Cloud,
  'Productivity': Bot,
  'Q&A': MessageCircle,
  'Blogging': Brush,
  'Travel': Plane,
  'Transportation': Car,
  'Food Delivery': Utensils,
  'CMS': Code,
  'Website Builder': Code,
  'Tech News': Cpu,
  'Real Estate': Home,
  'Finance': DollarSign,
  'Weather': Wind,
  'Logistics': Car,
  'Classifieds': Newspaper,
  'Art': Brush,
  'Portal': Globe,
  'Default': Globe,
}


export function LeaderboardClient() {
  const router = useRouter();

  const handleAnalyze = (e: React.MouseEvent, url: string) => {
    e.stopPropagation(); // prevent accordion from toggling
    const encodedUrl = encodeURIComponent(url);
    router.push(`/analysis/${encodedUrl}`);
  };

  const groupedSites = useMemo(() => {
    return topSites.reduce((acc, site) => {
      const category = site.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(site);
      return acc;
    }, {} as Record<string, typeof topSites>);
  }, []);

  const sortedCategories = Object.keys(groupedSites).sort();

  return (
    <div className="rounded-xl border bg-card/60 dark:bg-card/40 backdrop-blur-lg shadow-lg dark:shadow-black/40 p-2 md:p-4">
       <Accordion type="multiple" className="w-full">
        {sortedCategories.map(category => {
          const Icon = categoryIcons[category] || categoryIcons['Default'];
          return (
            <AccordionItem value={category} key={category}>
              <AccordionTrigger className="hover:no-underline px-4">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-base">{category}</span>
                  <span className="text-sm text-muted-foreground">({groupedSites[category].length} sites)</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="pt-2">
                  <ul className="divide-y divide-border">
                    {groupedSites[category].map(site => (
                       <li key={site.name} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md">
                          <div className="flex items-center gap-4">
                            <Image
                              src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=32`}
                              alt={`${site.name} favicon`}
                              width={24}
                              height={24}
                              className="rounded-full"
                              crossOrigin="anonymous"
                            />
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{site.name}</span>
                              <span className="text-xs text-muted-foreground">{site.domain}</span>
                            </div>
                          </div>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => handleAnalyze(e, site.url)}
                          >
                            Analyze
                          </Button>
                       </li>
                    ))}
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          )
        })}
       </Accordion>
    </div>
  );
}
