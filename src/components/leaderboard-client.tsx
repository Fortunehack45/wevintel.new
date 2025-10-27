
"use client";
import { useState, useMemo, useEffect } from "react";
import { topSites } from "@/lib/top-sites";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input } from "./ui/input";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  const [currentPage, setCurrentPage] = useState(1);
  const sitesPerPage = 10;

  const handleAnalyse = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    const encodedUrl = encodeURIComponent(url);
    router.push(`/analysis/${encodedUrl}`);
  };

  const sortedSites = useMemo(() => {
    let sites = [...topSites];
    
    if (searchTerm) {
      sites = sites.filter(site =>
        site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
        site.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    sites.sort((a, b) => {
        if (sortOrder === 'rank') {
            return a.rank - b.rank;
        }
        return a.name.localeCompare(b.name);
    });

    return sites;
  }, [searchTerm, sortOrder]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOrder]);

  const totalPages = Math.ceil(sortedSites.length / sitesPerPage);
  const paginatedSites = sortedSites.slice(
    (currentPage - 1) * sitesPerPage,
    currentPage * sitesPerPage
  );

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(page + 1, totalPages));
  };

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(page - 1, 1));
  };


  return (
    <div>
        <div className="mb-6 grid md:grid-cols-2 gap-4 items-center">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search by site, domain, or category..."
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
                        <Label htmlFor="rank" className="flex items-center gap-2 cursor-pointer"><SortDesc />Rank</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="alpha" id="alpha" />
                        <Label htmlFor="alpha" className="flex items-center gap-2 cursor-pointer"><SortAsc />A-Z</Label>
                    </div>
                </RadioGroup>
            </div>
        </div>

        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
          <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center">Rank</TableHead>
                  <TableHead>Site</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedSites.length > 0 ? (
                  paginatedSites.map(site => {
                    const Icon = categoryIcons[site.category] || categoryIcons['Default'];
                    return (
                        <TableRow key={site.rank}>
                            <TableCell className="font-mono text-center text-muted-foreground">{site.rank}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=32`}
                                        alt={`${site.name} favicon`}
                                        width={24}
                                        height={24}
                                        className="rounded-full flex-shrink-0 bg-slate-100 dark:bg-white/10 p-0.5"
                                        crossOrigin="anonymous"
                                    />
                                    <div>
                                        <p className="font-medium">{site.name}</p>
                                        <p className="text-sm text-muted-foreground">{site.domain}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Icon className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{site.category}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  onClick={(e) => handleAnalyse(e, site.url)}
                                >
                                  Analyse
                                </Button>
                            </TableCell>
                        </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No sites found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between mt-4">
            <div>
                <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <Button 
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        </div>
    </div>
  );
}
