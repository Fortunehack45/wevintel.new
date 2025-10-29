
'use server';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// NOTE: This will not work in a Vercel serverless function environment if trying to write.
// It should be safe for reading from a pre-built cache file. For writing, a different
// solution like Vercel's KV store would be needed.

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cacheDir = path.resolve(process.cwd(), '.cache');
const cacheFilePath = path.join(cacheDir, 'analysis-cache.json');

type CacheData = {
    [key: string]: {
        timestamp: number;
        data: any;
    };
};

// Ensure cache directory and file exist
async function ensureCacheFile() {
    try {
        await fs.mkdir(cacheDir, { recursive: true });
        await fs.access(cacheFilePath);
    } catch (error) {
        // If file doesn't exist, create it with an empty object
        await fs.writeFile(cacheFilePath, JSON.stringify({}), 'utf-8');
    }
}

async function readCache(): Promise<CacheData> {
    try {
        await ensureCacheFile();
        const fileContent = await fs.readFile(cacheFilePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading cache file:', error);
        return {}; // Return empty cache on error
    }
}

async function writeCache(cache: CacheData): Promise<void> {
    try {
        await ensureCacheFile();
        await fs.writeFile(cacheFilePath, JSON.stringify(cache, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error writing to cache file:', error);
    }
}

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getCache<T>(key: string): Promise<T | null> {
    const cache = await readCache();
    const item = cache[key];

    if (item && (Date.now() - item.timestamp < CACHE_DURATION)) {
        return item.data as T;
    }

    return null;
}

export async function setCache(key: string, data: any): Promise<void> {
    const cache = await readCache();
    cache[key] = {
        timestamp: Date.now(),
        data,
    };
    await writeCache(cache);
}

export async function clearCacheForUrl(url: string): Promise<void> {
    const cache = await readCache();
    const keysToDelete = Object.keys(cache).filter(key => key.includes(url));
    
    if(keysToDelete.length > 0) {
        console.log("Clearing cache for keys:", keysToDelete);
        keysToDelete.forEach(key => {
            delete cache[key];
        });
        await writeCache(cache);
    }
}

export async function clearAllCache(): Promise<void> {
    await writeCache({});
}
