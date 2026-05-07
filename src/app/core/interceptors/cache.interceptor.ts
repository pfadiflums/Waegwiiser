import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, tap } from 'rxjs';

interface CacheEntry {
  response: HttpResponse<unknown>;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const TTL_MS = 5 * 60 * 1000;

export const cacheInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET' || req.url.includes('/admin/')) {
    return next(req);
  }

  const cached = cache.get(req.url);
  if (cached && Date.now() < cached.expiresAt) {
    return of(cached.response.clone());
  }

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        cache.set(req.url, { response: event, expiresAt: Date.now() + TTL_MS });
      }
    })
  );
};

export function clearCache(urlSubstring?: string): void {
  if (!urlSubstring) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.includes(urlSubstring)) cache.delete(key);
  }
}
