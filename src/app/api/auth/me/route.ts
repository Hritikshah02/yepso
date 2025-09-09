import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { RUNTIME_USERS } from '@/lib/runtimeStore'

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

  if (userId === 'admin') {
    return NextResponse.json({ user: { id: 'admin', role: 'admin', firstName: 'Admin', lastName: '', email: 'admin@yepso.local' } })
  }

  try {
    const user = await (prisma as any).user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    const { id, firstName, lastName, email, role } = user
    return NextResponse.json({ user: { id, firstName, lastName, email, role } })
  } catch (e) {
    // Fallback to runtime users (search by id)
    for (const u of RUNTIME_USERS.values()) {
      if (u.id === userId) {
        const { id, firstName, lastName, email, role } = u
        return NextResponse.json({ user: { id, firstName, lastName, email, role } })
      }
    }
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }
}

export const runtime = 'nodejs'
