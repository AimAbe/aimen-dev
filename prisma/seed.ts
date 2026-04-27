import 'dotenv/config'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.post.upsert({
    where: { slug: 'building-aimen-dev-part-1' },
    update: {},
    create: {
      slug: 'building-aimen-dev-part-1',
      title: 'Building aimen.dev from scratch — Part 1: Design & Database',
      excerpt: 'I built the frontend, designed a backend architecture, set up a live PostgreSQL database on Railway, and pushed it all to GitHub.',
      tag: 'build log',
      published: true,
      content: `# Building aimen.dev from scratch

There's something fitting about the first post on a developer blog being about building the developer blog...

## The stack decision

Next.js, PostgreSQL on Railway, Prisma, NextAuth.js, Resend, Vercel.

## Step 1: getting the database live

\`\`\`bash
npx prisma db push
\`\`\`

Tables confirmed in Prisma Studio. Schema live on Railway.
      `
    }
  })
  console.log('Seeded.')
}

main().catch(console.error).finally(() => prisma.$disconnect())