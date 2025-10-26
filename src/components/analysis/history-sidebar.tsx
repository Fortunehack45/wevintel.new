'use client';

import { useCollection } from 'react-firebase-hooks/firestore';
import { useUser } from '@/firebase/auth/use-user';
import { collection, query, where, orderBy, getFirestore } from 'firebase/firestore';
import { app } from '@/firebase/config';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Globe, History, PanelLeft } from 'lucide-react';
import { useParams } from 'next/navigation';

const db = getFirestore(app);

export function HistorySidebar() {
  const { user } = useUser();
  const params = useParams();
  const currentUrl = params.url ? decodeURIComponent(params.url as string) : null;

  const [value, loading, error] = useCollection(
    user ? query(collection(db, 'analyses'), where('userId', '==', user.uid), orderBy('createdAt', 'desc')) : null
  );

  return (
    <SidebarProvider>
      <Sidebar side="left" variant="sidebar" collapsible="icon">
        <SidebarHeader className='p-4'>
            <div className='flex items-center gap-2'>
                <History className="h-6 w-6 text-primary" />
                <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">History</span>
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {loading && (
              <>
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSkeleton showIcon />
                <SidebarMenuSkeleton showIcon />
              </>
            )}
            {error && <p className="p-2 text-sm text-destructive">Error loading history.</p>}
            {value && value.docs.map((doc) => {
              const analysis = doc.data();
              const isActive = analysis.overview.url === currentUrl;
              return (
                <SidebarMenuItem key={doc.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    tooltip={{
                      children: (
                        <>
                          <p>{analysis.overview.domain}</p>
                          <p className="text-xs text-muted-foreground">
                            {analysis.createdAt ? formatDistanceToNow(analysis.createdAt.toDate(), { addSuffix: true }) : ''}
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
                            {formatDistanceToNow(analysis.createdAt.toDate(), { addSuffix: true })}
                          </span>
                        )}
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
             {value && value.empty && (
                <div className='p-4 text-center text-sm text-muted-foreground group-data-[collapsible=icon]:hidden'>
                    Your analysis history will appear here.
                </div>
            )}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

export function HistorySidebarTrigger() {
    return <SidebarTrigger className="md:hidden" />;
}
