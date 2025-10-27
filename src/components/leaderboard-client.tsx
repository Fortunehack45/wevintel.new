
"use client";
import { useState, useMemo } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { topSites } from "@/lib/top-sites";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { BarChart, Tv, ShoppingCart, Newspaper, Cpu, Code, Brush, Music, Video, VenetianMask, MessageCircle, Gamepad, BookOpen, Building2, Cloud, DollarSign, Plane, Car, Utensils, Home, Bot, FlaskConical, Search, Globe, Wind, Building as BuildingIcon, Package, Clapperboard, Palette, Headphones, Drama, Play, Library, Landmark, Brain, Heart, ChefHat, Briefcase, Trophy, Sun, Ship, Mail, Handshake, PenTool, Tv2, Webhook, Rss, Book, University, Atom, Stethoscope, Salad, UtensilsCrossed, Hand, Tent, Bus, Forklift, NewspaperIcon, Palette as ArtIcon, Network, GitBranch, SortAsc, SortDesc } from "lucide-react";


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
    'Business': BuildingIcon,
    'Sports': Trophy,
    'Cloud Storage': Cloud,
    'Productivity': Bot,
    'Q&A': MessageCircle,
    'Blogging': PenTool,
    'Travel': Plane,
    'Transportation': Bus,
    'Food Delivery': UtensilsCrossed,
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

type SortOrder = 'rank' | 'alpha';

export function LeaderboardClient() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('rank');

  const handleAnalyze = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    const encodedUrl = encodeURIComponent(url);
    router.push(`/analysis/${encodedUrl}`);
  };

  const filteredSites = useMemo(() => {
    let sites = [...topSites];
    if (searchTerm) {
      sites = sites.filter(site =>
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.domain.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    return sites;
  }, [searchTerm]);

  const groupedAndSortedSites = useMemo(() => {
    const grouped = filteredSites.reduce((acc, site) => {
      const category = site.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(site);
      return acc;
    }, {} as Record<string, typeof topSites>);
    
    // Sort sites within each category
    Object.keys(grouped).forEach(category => {
        grouped[category].sort((a, b) => {
            if (sortOrder === 'rank') {
                return a.rank - b.rank;
            }
            return a.name.localeCompare(b.name);
        });
    });

    return grouped;
  }, [filteredSites, sortOrder]);
  
  const sortedCategories = useMemo(() => {
      const categories = Object.keys(groupedAndSortedSites);
      if (sortOrder === 'rank') {
          // A bit complex to sort categories by the rank of their best site
          // For now, let's keep them alphabetically sorted for predictability
          return categories.sort((a, b) => {
              const rankA = groupedAndSortedSites[a][0]?.rank || Infinity;
              const rankB = groupedAndSortedSites[b][0]?.rank || Infinity;
              if (rankA === rankB) return a.localeCompare(b);
              return rankA - rankB;
          });
      }
      return categories.sort();
  }, [groupedAndSortedSites, sortOrder]);


  return (
    <div>
        <div className="mb-6 grid md:grid-cols-2 gap-4 items-center">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search for a site..."
                    className="w-full pl-10 h-12 text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
             <div className="flex items-center space-x-4 justify-self-start md:justify-self-end">
                <Label>Sort by:</Label>
                <RadioGroup defaultValue="rank" onValueChange={(value) => setSortOrder(value as SortOrder)} className="flex items-center">
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="rank" id="rank" />
                        <Label htmlFor="rank" className="flex items-center gap-2"><SortDesc />Rank</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="alpha" id="alpha" />
                        <Label htmlFor="alpha" className="flex items-center gap-2"><SortAsc />A-Z</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>

        <div className="rounded-xl border bg-card/60 dark:bg-card/40 backdrop-blur-lg shadow-lg dark:shadow-black/40 p-2 md:p-4">
          {sortedCategories.length > 0 ? (
            <Accordion type="multiple" defaultValue={sortedCategories.slice(0, 3)} className="w-full">
              {sortedCategories.map(category => {
                const Icon = categoryIcons[category] || categoryIcons['Default'];
                return (
                  <AccordionItem value={category} key={category} className="border-b-0">
                    <AccordionTrigger className="hover:no-underline px-4 rounded-lg hover:bg-muted/50">
                      <div className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-base">{category}</span>
                        <span className="text-sm text-muted-foreground">({groupedAndSortedSites[category].length} sites)</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="pt-2">
                        <ul className="divide-y divide-border">
                          {groupedAndSortedSites[category].map(site => (
                             <li key={site.name} className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-md">
                                <div className="flex items-center gap-4">
                                   <span className="font-mono text-sm text-muted-foreground w-6 text-center">{sortOrder === 'rank' ? site.rank : '•'}</span>
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
