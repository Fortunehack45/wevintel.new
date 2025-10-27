
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


export async function getAdditionalAnalysis(url: string): Promise<{ domain?: DomainData; status: StatusData }> {
  const urlObject = new URL(url);
  const domainName = urlObject.hostname;
  
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
    
  const whoisPromise = fetch(`https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${process.env.WHOIS_API_KEY}&domainName=${domainName}&outputFormat=JSON`)
    .then(res => res.json())
    .then(data => {
        if (data.WhoisRecord) {
            const record = data.WhoisRecord;
            return {
                registrar: record.registrarName,
                creationDate: record.createdDate,
                expirationDate: record.expiresDate,
                updatedDate: record.updatedDate,
                status: record.status ? (Array.isArray(record.status) ? record.status : [record.status]) : [],
                nameservers: record.nameServers?.hostNames,
            };
        }
        return undefined;
    })
    .catch(e => {
        console.error("Whois fetch failed:", e);
        return undefined;
    });

  const [status, domain] = await Promise.all([statusPromise, whoisPromise]);
  
  return { status, domain };
}
