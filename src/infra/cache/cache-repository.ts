import { upstashRedis } from '@/lib/upstash-redis'

const CACHE_EXPIRE = 60 * 1 * 1440 // 7 days

export const cacheRepository = {
  /**
   * Set a key-value pair in the cache with an optional expiration time.
   *
   * @param {string} key - the key for the cache entry
   * @param {string} value - the value to be stored in the cache
   * @param {number} ex - (optional) the expiration time for the cache entry in seconds. Defaults to 1 day.
   * @return {Promise<void>} a Promise that resolves when the key-value pair is set in the cache
   */
  async set(key: string, value: string, ex: number = CACHE_EXPIRE): Promise<void> {
    await upstashRedis.set(key, value, {
      ex,
    })
  },
  async get<T = string>(key: string): Promise<T | null> {
    return await upstashRedis.get<T>(key)
  },
  async delete(key: string): Promise<void> {
    await upstashRedis.del(key)
  },
  async mdel(keys: string[]): Promise<void> {
    await upstashRedis.del(...keys)
  },
}
