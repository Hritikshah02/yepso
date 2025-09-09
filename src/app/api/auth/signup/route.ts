import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomBytes, scryptSync, timingSafeEqual } from 'crypto'
import { RUNTIME_USERS } from '@/lib/runtimeStore'

function hashPassword(password: string, salt?: string) {
  const s = salt ?? randomBytes(16).toString('hex')
  const hash = scryptSync(password, s, 64).toString('hex')
  return `${s}:${hash}`
}

function verifyPassword(password: string, stored: string) {
  const [salt, hashed] = stored.split(':')
  const newHash = scryptSync(password, salt, 64)
  const bufStored = Buffer.from(hashed, 'hex')
  return bufStored.length === newHash.length && timingSafeEqual(bufStored, newHash)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { firstName, lastName, email, phone, password, confirmPassword } = body ?? {}
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    if (password !== confirmPassword) {
      return NextResponse.json({ error: 'Passwords do not match' }, { status: 400 })
    }

    const passwordHash = hashPassword(password)

    try {
      // Attempt Prisma create; also check for unique constraints in runtime store first
      if (RUNTIME_USERS.has(email.toLowerCase())) {
        return NextResponse.json({ error: 'User already exists' }, { status: 409 })
      }
      const user = await (prisma as any).user.create({
        data: { firstName, lastName, email: email.toLowerCase(), phone, passwordHash, role: 'user' },
      })
      return NextResponse.json({ ok: true, user: { id: user.id, firstName, lastName, email, phone, role: user.role } }, { status: 201 })
    } catch (e: any) {
      // Fallback to runtime store
      const existing = RUNTIME_USERS.get(email.toLowerCase())
      if (existing) {
        return NextResponse.json({ error: 'User already exists' }, { status: 409 })
      }
      const id = randomBytes(12).toString('hex')
      const user = { id, firstName, lastName, email: email.toLowerCase(), phone, passwordHash, role: 'user' as const }
      RUNTIME_USERS.set(user.email, user)
      return NextResponse.json({ ok: true, user: { id, firstName, lastName, email: user.email, phone, role: 'user' } }, { status: 201 })
    }
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
