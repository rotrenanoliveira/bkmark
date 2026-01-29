import { Redis } from '@upstash/redis'

export const upstashRedis = new Redis({
  url: process.env.UPSTASH_URL,
  token: process.env.UPSTASH_TOKEN,
})
