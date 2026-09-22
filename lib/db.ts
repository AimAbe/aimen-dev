import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaPg(new Pool({ connectionString: process.env.DATABASE_URL })),
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

function isDatabaseStartingUpError(err: unknown): boolean {
  if (!(err instanceof Error)) return false
  const cause = (err as { cause?: { code?: string } }).cause
  return cause?.code === '57P03' || err.message.includes('the database system is starting up')
}

// Railway's Postgres can be asleep (serverless/scale-to-zero) when `next build`
// runs static generation, which fails the whole build on a cold-start race.
// Retry with backoff so the build waits out the wake-up window instead of failing.
export async function withDbRetry<T>(fn: () => Promise<T>, retries = 5): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn()
    } catch (err) {
      if (attempt >= retries || !isDatabaseStartingUpError(err)) throw err
      await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt))
    }
  }
}