/**
 * Image caching utility using the Cache API.
 * Caches images so they load instantly from cache on page reload.
 */

const CACHE_NAME = '9ja-buyer-images-v1';

const isCacheSupported = (): boolean => {
  return typeof caches !== 'undefined';
};

/**
 * Get a cached image URL. If the image is in cache, returns an object URL.
 * Otherwise fetches, caches, and returns an object URL.
 * Caller must revoke the object URL when done (e.g. on unmount).
 */
export const getCachedImageUrl = async (url: string): Promise<{ url: string; revoke: boolean }> => {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return { url: '', revoke: false };
  }

  if (!isCacheSupported()) {
    return { url, revoke: false };
  }

  try {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(url);

    if (cached) {
      const blob = await cached.blob();
      return { url: URL.createObjectURL(blob), revoke: true };
    }

    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error('Failed to fetch');

    await cache.put(url, response.clone());
    const blob = await response.blob();
    return { url: URL.createObjectURL(blob), revoke: true };
  } catch {
    return { url, revoke: false };
  }
};
