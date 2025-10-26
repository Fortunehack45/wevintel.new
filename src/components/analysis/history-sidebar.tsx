'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { AnalysisResult } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { Globe, History } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export function HistorySidebar() {
  const params = useParams();
  const currentUrl = params.url ? decodeURIComponent(params.url as string) : null;
  const [history, setHistory] = useLocalStorage<AnalysisResult[]>('analysis-history', []);

  const sortedHistory = history.sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });


  return (
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className='p-4'>
            <div className='flex items-center gap-2'>
                <History className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">History</span>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {!history && (
              <>
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSkeleton showIcon />
              </>
            )}
            
            {sortedHistory && sortedHistory.map((analysis) => {
              if (!analysis?.overview?.url) return null;
              const isActive = analysis.overview.url === currentUrl;
              return (
                <SidebarMenuItem key={analysis.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={{
                      children: (
                        <>
                          <p>{analysis.overview.domain}</p>
                          <p className="text-xs text-muted-foreground">
                            {analysis.createdAt ? formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true }) : ''}
                          </p>
                        </>
                      ),
                    }}
                  >
                    <Link href={`/analysis/${encodeURIComponent(analysis.overview.url)}`}>
                      <Globe />
                      <div className="flex flex-col items-start overflow-hidden">
                        <span className="truncate w-full">{analysis.overview.domain}</span>
                        {analysis.createdAt && (
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(analysis.createdAt), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
             {history && history.length === 0 && (
                <div className='p-4 text-center text-sm text-muted-foreground group-data-[collapsible=icon]:hidden'>
                    Your analysis history will appear here.
                </div>
            )}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
  );
}

export function HistorySidebarTrigger() {
    return <SidebarTrigger className="md:hidden" />;
}
