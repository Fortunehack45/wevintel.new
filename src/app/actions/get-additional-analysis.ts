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
