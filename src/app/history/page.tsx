

'use client';
import { HistoryClient } from "@/components/history-client";
import { useAuth, useAuthContext } from "@/firebase/provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { LoadingOverlay } from "@/components/loading-overlay";


export default function HistoryPage() {
    const auth = useAuthContext();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (auth) {
            const unsubscribe = useAuth((user) => {
                if (user) {
                    setUser(user);
                    setIsLoading(false);
                } else {
                    router.push('/login');
                }
            });
            return () => unsubscribe();
        } else {
            const timer = setTimeout(() => {
                if (!auth) {
                    router.push('/login');
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [auth, router]);
    
    if (isLoading || !user) {
        return <LoadingOverlay isVisible={true} />;
    }

    return (
        <div className="container mx-auto px-4 py-8 pb-24 md:pb-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Analysis History</h1>
            </div>
            <HistoryClient />
        </div>
    )
}
