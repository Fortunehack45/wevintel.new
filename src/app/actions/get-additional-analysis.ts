
'use server';

import type { DomainData, StatusData } from '@/lib/types';

interface WhoisResponse {
    creation_date?: string;
    expiration_date?: string;
    updated_date?: string;
    registrar?: string;
    status?: string[];
    name_servers?: string[];
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


export async function getDomainInfo(domainName: string): Promise<DomainData | undefined> {
    // Using a free, public Whois API that doesn't require a key.
    const whoisPromise = fetch(`https://whois.freeaiapi.xyz/?name=${domainName}`)
    .then(res => res.json())
    .then(data => {
        if (data && data.registrar) {
            return {
                registrar: data.registrar,
                creationDate: data.creation_date,
                expirationDate: data.expiration_date,
                updatedDate: data.updated_date,
                status: data.status ? (Array.isArray(data.status) ? data.status : [data.status]) : [],
                nameservers: data.name_servers,
            };
        }
        return undefined;
    })
    .catch(e => {
        console.error("Whois fetch failed:", e);
        return undefined;
    });

    return whoisPromise;
}

