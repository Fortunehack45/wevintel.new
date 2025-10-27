
'use server';

import type { DomainData, StatusData } from '@/lib/types';

interface WhoisResponse {
    WhoisRecord: {
        createdDate?: string;
        expiresDate?: string;
        updatedDate?: string;
        registrarName?: string;
        status?: string;
        nameServers?: {
            rawText: string;
        }
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


export async function getDomainInfo(domainName: string): Promise<DomainData | undefined> {
    const apiKey = process.env.WHOIS_API_KEY;
    if (!apiKey) {
        console.error("WHOIS_API_KEY is not set in environment variables.");
        return undefined;
    }

    const whoisApiUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apiKey}&domainName=${domainName}&outputFormat=JSON`;

    const whoisPromise = fetch(whoisApiUrl)
    .then(res => res.json())
    .then((data: WhoisResponse) => {
        if (data && data.WhoisRecord) {
            const record = data.WhoisRecord;
            
            // The status can be a single string or an array of strings.
            let statusArray: string[] = [];
            if(record.status) {
                const statusString = Array.isArray(record.status) ? record.status.join(' ') : record.status;
                // The status often comes as a single space-separated string.
                statusArray = statusString.split(' ').map(s => s.trim()).filter(Boolean);
            }
            
            // Nameservers can also come in different formats
            let nameservers: string[] = [];
            if(record.nameServers?.rawText) {
                nameservers = record.nameServers.rawText.split('\n').map(ns => ns.trim()).filter(Boolean);
            }

            return {
                registrar: record.registrarName,
                creationDate: record.createdDate,
                expirationDate: record.expiresDate,
                updatedDate: record.updatedDate,
                status: statusArray,
                nameservers: nameservers,
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
