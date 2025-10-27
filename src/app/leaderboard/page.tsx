import { LeaderboardClient } from "@/components/leaderboard-client";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";


export default function LeaderboardPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold">Top Sites Leaderboard</h1>
                    <p className="text-muted-foreground">A curated list of popular websites to analyze and explore.</p>
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
