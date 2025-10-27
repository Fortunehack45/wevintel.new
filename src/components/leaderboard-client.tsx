"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { topSites } from "@/lib/top-sites";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Badge } from "./ui/badge";

export function LeaderboardClient() {
  const router = useRouter();

  const handleAnalyze = (url: string) => {
    const encodedUrl = encodeURIComponent(url);
    router.push(`/analysis/${encodedUrl}`);
  };

  return (
    <div className="rounded-xl border bg-card/60 dark:bg-card/40 backdrop-blur-lg shadow-lg dark:shadow-black/40 p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Rank</TableHead>
            <TableHead>Site</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topSites.map((site, index) => (
            <TableRow key={site.name}>
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Image
                    src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=32`}
                    alt={`${site.name} favicon`}
                    width={20}
                    height={20}
                    className="rounded"
                    crossOrigin="anonymous"
                  />
                  <span className="font-medium">{site.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">{site.category}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAnalyze(site.url)}
                >
                  Analyze
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
