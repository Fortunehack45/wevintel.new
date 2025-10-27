import { NextResponse } from 'next/server';
import type { DomainData, DomainContact } from '@/lib/types';

// Define the structure of the raw response from the WHOIS API
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

// Helper function to parse contact details from the raw response
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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const domainName = searchParams.get('domainName');

  if (!domainName) {
    return NextResponse.json({ error: 'Domain name is required' }, { status: 400 });
  }

  const apiKey = process.env.WHOIS_API_KEY;

  if (!apiKey) {
    console.error("WHOIS_API_KEY is not set in server environment variables.");
    return NextResponse.json({ error: 'Server configuration error: Missing API key.' }, { status: 500 });
  }

  const whoisApiUrl = `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${apiKey}&domainName=${domainName}&outputFormat=JSON`;

  try {
    const res = await fetch(whoisApiUrl);
    
    if (!res.ok) {
        console.error(`Whois API request failed with status: ${res.status}.`);
        return NextResponse.json({ error: `Failed to fetch data from WHOIS provider. Status: ${res.status}` }, { status: res.status });
    }

    const data: WhoisResponse = await res.json();

    if (data.ErrorMessage) {
        const errorMessage = data.ErrorMessage.msg;
        console.error(`Whois API returned an error: ${errorMessage}`);
        // Do not return sensitive parts of the error message to the client
        if (errorMessage.includes('API key') || errorMessage.includes('credits')) {
            return NextResponse.json({ error: "Invalid API key or insufficient credits." }, { status: 400 });
        }
        return NextResponse.json({ error: "Could not retrieve WHOIS information for this domain." }, { status: 400 });
    }
    
    if (data && data.WhoisRecord) {
        const record = data.WhoisRecord;
        
        let statusArray: string[] = [];
        if (record.status) {
            const statusString = Array.isArray(record.status) ? record.status.join(' ') : record.status;
            statusArray = statusString.split(' ').map(s => s.trim()).filter(Boolean);
        }
        
        let nameservers: string[] = [];
        if (record.nameServers?.rawText) {
            nameservers = record.nameServers.rawText.split('\\n').map(ns => ns.trim()).filter(Boolean);
        }

        const domainData: DomainData = {
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
        
        return NextResponse.json(domainData);
    }

    // Return empty object if no record is found but no error was thrown
    return NextResponse.json({});

  } catch (e: any) {
    console.error("Internal error in WHOIS API route:", e);
    return NextResponse.json({ error: e.message || 'An unknown internal server error occurred.' }, { status: 500 });
  }
}