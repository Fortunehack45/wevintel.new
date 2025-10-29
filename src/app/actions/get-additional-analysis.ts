
'use server';

import type { DomainData, StatusData, DomainContact } from '@/lib/types';
import { getCache, setCache } from '@/lib/cache';


export async function getAdditionalAnalysis(url: string): Promise<{ status: StatusData }> {
  const cacheKey = `additional-analysis:${url}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

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
  
  const result = { status };
  await setCache(cacheKey, result);
  return result;
}
