

'use client';
import { LeaderboardClient } from "@/components/leaderboard-client";
import { Trophy } from "lucide-react";
import { useAuth, useAuthContext } from "@/firebase/provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { LoadingOverlay } from "@/components/loading-overlay";


export default function LeaderboardPage() {
    return (
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold flex items-center gap-3"><Trophy className="text-primary h-8 w-8" /> Leaderboard</h1>
                    <p className="text-muted-foreground">Explore and analyse a curated list of top websites from various categories.</p>
                </div>
            </div>
            <LeaderboardClient />
        </div>
    )
}

