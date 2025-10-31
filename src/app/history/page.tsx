

import { HistoryClient } from "@/components/history-client";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import Link from "next/link";


export default function HistoryPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Analysis History</h1>
            </div>
            <HistoryClient />
        </div>
    )
}
