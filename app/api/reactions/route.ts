import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// GET /api/reactions?postId=123
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const postId = parseInt(searchParams.get('postId') ?? '')

  if (!postId) return NextResponse.json([], { status: 400 })

  const reactions = await prisma.reaction.groupBy({
    by: ['emoji'],
    where: { postId },
    _count: true
  })

  return NextResponse.json(reactions)
}

// POST /api/reactions
export async function POST(req: Request) {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('session_id')?.value

  const body = await req.json()
  const { postId, emoji } = body

  if (!sessionId) sessionId = crypto.randomUUID()

  try {
    await prisma.reaction.create({
      data: { postId, emoji, sessionId }
    })
  } catch {
    // @@unique constraint hit — already reacted, silently ignore
  }

  const reactions = await prisma.reaction.groupBy({
    by: ['emoji'],
    where: { postId },
    _count: true
  })

  const response = NextResponse.json(reactions)
  response.cookies.set('session_id', sessionId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/'
  })

  return response
}