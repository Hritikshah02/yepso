import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const USER_COOKIE = 'userId'
const ROLE_COOKIE = 'role'

function getCookieFromRequest(req: Request, name: string): string | undefined {
  const header = req.headers.get('cookie') || ''
  const parts = header.split(';')
  for (const part of parts) {
    const [k, ...rest] = part.trim().split('=')
    if (k === name) return decodeURIComponent(rest.join('='))
  }
  return undefined
}

export async function GET(req: Request) {
  const userId = getCookieFromRequest(req, USER_COOKIE)
  const role = getCookieFromRequest(req, ROLE_COOKIE)
  if (!userId || !role) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  try {
    const p: any = prisma as any
    const where = role === 'admin' ? {} : { userId }
    const orders = await p.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } }, payments: true },
    })
    return NextResponse.json({ orders })
  } catch (e) {
    // Fallback when DB is not initialized
    return NextResponse.json({ orders: [] })
  }
}

export const runtime = 'nodejs'
