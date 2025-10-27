
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
    const apiKey = process.env.WHOIS_API_KEY;
    if (!apiKey) {
        console.error("WHOIS_API_KEY is not set in environment variables.");
        return null;
    }

    const whoisApiUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apiKey}&domainName=${domainName}&outputFormat=JSON`;

    try {
        const res = await fetch(whoisApiUrl);
        if (!res.ok) {
            console.error("Whois API request failed with status:", res.status);
            return null;
        }

        const data: WhoisResponse = await res.json();

        if (data.ErrorMessage) {
            // Specifically check for API key related errors
            if (data.ErrorMessage.msg.includes('API key') || data.ErrorMessage.msg.includes('credits')) {
                console.error(`Whois API Error: ${data.ErrorMessage.msg}. Please check your WHOIS_API_KEY.`);
            } else {
                console.error("Whois API Error:", data.ErrorMessage.msg);
            }
            return null;
        }
        
        if (data && data.WhoisRecord) {
            const record = data.WhoisRecord;
            
            let statusArray: string[] = [];
            if(record.status) {
                const statusString = Array.isArray(record.status) ? record.status.join(' ') : record.status;
                statusArray = statusString.split(' ').map(s => s.trim()).filter(Boolean);
            }
            
            let nameservers: string[] = [];
            if(record.nameServers?.rawText) {
                nameservers = record.nameServers.rawText.split('\n').map(ns => ns.trim()).filter(Boolean);
            }
            
            const parseContact = (contact: any): DomainContact | undefined => {
                if (!contact) return undefined;
                return {
                    name: contact.name,
                    organization: contact.organization,
                    email: contact.email,
                    telephone: contact.telephone,
                    street: contact.street,
                    city: contact.city,
                    state: contact.state,
                    postalCode: contact.postalCode,
                    country: contact.country
                }
            }

            return {
                registrar: record.registrarName,
                creationDate: record.createdDate,
                expirationDate: record.expiresDate,
                updatedDate: record.updatedDate,
                status: statusArray,
                nameservers: nameservers,
                registrant: parseContact(record.registrant),
                admin: parseContact(record.administrativeContact),
                tech: parseContact(record.technicalContact),
            };
        }
        return undefined; // No record found, but not an error
    } catch (e) {
        console.error("Whois fetch failed:", e);
        return null; // Represents an error state
    }
}
