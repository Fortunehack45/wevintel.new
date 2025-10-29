

import { HistoryClient } from "@/components/history-client";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";


export default function HistoryPage() {
    return (
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-16 pt-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Analysis History</h1>
                <Button asChild variant="outline">
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </Button>
            </div>
            <HistoryClient />
        </div>
    )
}
