'use server';

import type { DomainData, StatusData, DomainContact } from '@/lib/types';

interface WhoisResponse {
    WhoisRecord: {
        createdDate?: string;
        expiresDate?: string;
        updatedDate?: string;
        registrarName?: string;
        status?: string;
        nameServers?: {
            rawText: string;
        };
        registrant?: any;
        administrativeContact?: any;
        technicalContact?: any;
    },
    ErrorMessage?: {
        msg: string;
    }
}


export async function getAdditionalAnalysis(url: string): Promise<{ status: StatusData }> {
  const startTime = Date.now();
  const statusPromise = fetch(url, { method: 'HEAD', redirect: 'follow', headers: { 'User-Agent': 'WebIntel-Status-Checker/1.0' } })
    .then(response => {
        const endTime = Date.now();
        return {
            isOnline: response.ok,
            httpStatus: response.status,
            responseTime: endTime - startTime,
            finalUrl: response.url,
        };
    })
    .catch(() => {
        const endTime = Date.now();
        return {
            isOnline: false,
            responseTime: endTime - startTime,
        };
    });

  const status = await statusPromise;
  
  return { status };
}


export async function getDomainInfo(domainName: string): Promise<DomainData | null | undefined> {
    try {
        // The base URL should be the one for your deployment, but /api/whois works for local dev
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002'}/api/whois?domainName=${domainName}`);

        if (!res.ok) {
            const errorData = await res.json();
            console.error(`Internal API Error for WHOIS lookup: ${errorData.error}`);
            return null;
        }

        const data = await res.json();
        
        if (data.error) {
             console.error(`WHOIS service error: ${data.error}`);
             return null;
        }
        
        if (Object.keys(data).length === 0) {
            return undefined; // No record found
        }
        
        return data as DomainData;

    } catch (e) {
        console.error("Failed to fetch from internal WHOIS API route:", e);
        return null; // Represents a network or other fetch error
    }
}