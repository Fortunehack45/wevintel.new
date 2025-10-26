import { HistoryClient } from "@/components/history-client";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function HistoryPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Analysis History</h1>
            </div>
            <HistoryClient />
        </div>
    )
}
