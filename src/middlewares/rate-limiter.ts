import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';

const timeWindow = 60 * 2000; // Janela de tempo em milissegundos (2 minuto)

interface CacheValue {
    count: number;
    startTime: number;
}

const cache = new LRUCache<string, CacheValue>({
    max: 500, // Número máximo de itens no cache
    ttl: timeWindow, // Tempo de vida dos itens no cache
});

export function rateLimiter(req: NextRequest, rateLimit: number) {
    const ip = (req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip')) as string;
    const now = Date.now();

    if (!cache.has(ip as string)) {
        cache.set(ip as string, { count: 1, startTime: now });
    } else {
        const cacheValue = cache.get(ip as string);
        if (cacheValue && now - cacheValue.startTime < timeWindow) {
            const { count, startTime } = cacheValue;
            if (count >= rateLimit) {
                return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
            }
            cache.set(ip, { count: count + 1, startTime });
        } else {
            cache.set(ip, { count: 1, startTime: now });
        }
    }

    return undefined;
}