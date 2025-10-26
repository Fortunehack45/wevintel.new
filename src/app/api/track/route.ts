
import { NextRequest, NextResponse } from 'next/server';
import { shouldTrackEvent, type VisitorEventInput } from '@/ai/flows/should-track-event';

export const runtime = 'edge'; // Or 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Basic validation
    if (!body || typeof body !== 'object') {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const visitorInfo: VisitorEventInput = {
        ip: req.ip || body.ip, // req.ip is available in Vercel Edge functions
        country: req.geo?.country || body.country,
        city: req.geo?.city || body.city,
        region: req.geo?.region || body.region,
        timestamp: body.timestamp,
        referrer: body.referrer,
        pathname: body.pathname,
    };
    
    const decision = await shouldTrackEvent(visitorInfo);
    
    if (decision.shouldTrack) {
        // In a real application, you would save the visitorInfo to your database (e.g., Firestore, Postgres).
        // For this demo, we'll just log it to the server console.
        console.log('✅ AI decided to TRACK this event:', { ...visitorInfo, reason: decision.reason });
    } else {
        console.log('❌ AI decided NOT to track this event:', { ...visitorInfo, reason: decision.reason });
    }

    return NextResponse.json({ tracked: decision.shouldTrack, reason: decision.reason });

  } catch (error: any) {
    console.error('Error in /api/track:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
