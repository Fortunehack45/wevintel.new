
"use client";
import { useState, useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { topSites } from "@/lib/top-sites";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "./ui/input";
import { BarChart, Tv, ShoppingCart, Newspaper, Cpu, Code, Brush, Music, Video, VenetianMask, MessageCircle, Gamepad, BookOpen, Building2, Cloud, DollarSign, Plane, Car, Utensils, Home, Bot, FlaskConical, Search, Globe, Wind, Building, Package, Clapperboard, Palette, Headphones, Drama, Play, Library, Landmark, Brain, Heart, ChefHat, Briefcase, Trophy, Sun, Ship, Mail, Handshake, PenTool, Tv2, Webhook, Rss, Book, University, Atom, Stethoscope, Salad, UtensilsCross, Hand, Tent, Bus, Forklift, NewspaperIcon, Palette as ArtIcon, Network, GitBranch } from "lucide-react";


const categoryIcons: { [key: string]: React.ElementType } = {
    'Search Engine': Search,
    'Video': Video,
    'Social Media': MessageCircle,
    'Reference': Library,
    'E-commerce': ShoppingCart,
    'Streaming': Tv,
    'Professional': Briefcase,
    'News': Newspaper,
    'Technology': Cpu,
    'Developer': Code,
    'Design': Palette,
    'Music': Headphones,
    'Entertainment': Drama,
    'Gaming': Gamepad,
    'Education': University,
    'Science': Atom,
    'Health': Stethoscope,
    'Food': ChefHat,
    'Business': Building,
    'Sports': Trophy,
    'Cloud Storage': Cloud,
    'Productivity': Bot,
    'Q&A': MessageCircle,
    'Blogging': PenTool,
    'Travel': Plane,
    'Transportation': Bus,
    'Food Delivery': UtensilsCross,
    'CMS': Webhook,
    'Website Builder': Tv2,
    'Tech News': Rss,
    'Real Estate': Home,
    'Finance': DollarSign,
    'Weather': Sun,
    'Logistics': Ship,
    'Classifieds': NewspaperIcon,
    'Art': ArtIcon,
    'Portal': Network,
    'Software': GitBranch,
    'Default': Globe,
};

export function LeaderboardClient() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const handleAnalyze = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    const encodedUrl = encodeURIComponent(url);
    router.push(`/analysis/${encodedUrl}`);
  };

  const filteredSites = useMemo(() => {
    if (!searchTerm) {
      return topSites;
    }
    return topSites.filter(site =>
      site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      site.domain.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const groupedSites = useMemo(() => {
    return filteredSites.reduce((acc, site) => {
      const category = site.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(site);
      // Sort sites alphabetically within each category
      acc[category].sort((a, b) => a.name.localeCompare(b.name));
      return acc;
    }, {} as Record<string, typeof topSites>);
  }, [filteredSites]);

  const sortedCategories = Object.keys(groupedSites).sort();

  return (
    <div>
        <div className="mb-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                type="text"
                placeholder="Search for a site or category..."
                className="w-full pl-10 h-12 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        <div className="rounded-xl border bg-card/60 dark:bg-card/40 backdrop-blur-lg shadow-lg dark:shadow-black/40 p-2 md:p-4">
          {sortedCategories.length > 0 ? (
            <Accordion type="multiple" defaultValue={sortedCategories} className="w-full">
              {sortedCategories.map(category => {
                const Icon = categoryIcons[category] || categoryIcons['Default'];
                return (
                  <AccordionItem value={category} key={category} className="border-b-0">
                    <AccordionTrigger className="hover:no-underline px-4 rounded-lg hover:bg-muted/50">
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
          ) : (
            <div className="text-center p-8">
                <h3 className="text-xl font-semibold">No sites found.</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your search term.</p>
            </div>
          )}
        </div>
    </div>
  );
}
