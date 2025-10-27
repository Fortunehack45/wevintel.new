import { LeaderboardClient } from "@/components/leaderboard-client";
import { Button } from "@/components/ui/button";
import { Home, Trophy } from "lucide-react";
import Link from "next/link";


export default function LeaderboardPage() {
    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold flex items-center gap-3"><Trophy className="text-primary h-8 w-8" /> Top Sites Leaderboard</h1>
                    <p className="text-muted-foreground">A curated list of popular websites, grouped by category for you to explore.</p>
                </div>
                <Button asChild variant="outline">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </Button>
            </div>
            <LeaderboardClient />
        </div>
    )
}
