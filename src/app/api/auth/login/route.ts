import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { scryptSync, timingSafeEqual } from 'crypto'
import { RUNTIME_USERS } from '@/lib/runtimeStore'

const USER_COOKIE = 'userId'
const ROLE_COOKIE = 'role'
const NAME_COOKIE = 'name'
const EMAIL_COOKIE = 'email'
const CART_COOKIE = 'cartId'

function setAuthCookies(res: NextResponse, user: { id: string; role: string; firstName?: string; lastName?: string; email?: string }) {
  const common = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  }
  res.cookies.set(USER_COOKIE, user.id, common)
  res.cookies.set(ROLE_COOKIE, user.role, common)
  res.cookies.set(NAME_COOKIE, `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(), { ...common, httpOnly: false })
  if (user.email) res.cookies.set(EMAIL_COOKIE, user.email, { ...common, httpOnly: false })
  // Scope cart id to user to make cart unique per member
  res.cookies.set(CART_COOKIE, user.id, common)
}

function verifyPassword(password: string, stored: string) {
  const [salt, hashed] = stored.split(':')
  const newHash = scryptSync(password, salt, 64)
  const bufStored = Buffer.from(hashed, 'hex')
  return bufStored.length === newHash.length && timingSafeEqual(bufStored, newHash)
}

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json()
    if (!identifier || !password) {
      return NextResponse.json({ error: 'Missing identifier/password' }, { status: 400 })
    }

    // Admin backdoor
    if (identifier === 'admin' && password === 'admin') {
      const res = NextResponse.json({ ok: true, user: { id: 'admin', role: 'admin', firstName: 'Admin', lastName: '', email: 'admin@yepso.local' } })
      setAuthCookies(res, { id: 'admin', role: 'admin', firstName: 'Admin', lastName: '', email: 'admin@yepso.local' })
      return res
    }

    // Look up by email or phone
    const idLower = String(identifier).toLowerCase()
    try {
      const user = await (prisma as any).user.findFirst({
        where: {
          OR: [
            { email: idLower },
            { phone: identifier },
          ],
        },
      })
      if (!user || !user.passwordHash || !verifyPassword(password, user.passwordHash)) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      const res = NextResponse.json({ ok: true, user: { id: user.id, role: user.role, firstName: user.firstName, lastName: user.lastName, email: user.email } })
      setAuthCookies(res, { id: user.id, role: user.role, firstName: user.firstName, lastName: user.lastName, email: user.email })
      return res
    } catch (_) {
      // Fallback to runtime store
      const ru = RUNTIME_USERS.get(idLower)
      if (!ru || !ru.passwordHash || !verifyPassword(password, ru.passwordHash)) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }
      const res = NextResponse.json({ ok: true, user: { id: ru.id, role: ru.role, firstName: ru.firstName, lastName: ru.lastName, email: ru.email } })
      setAuthCookies(res, { id: ru.id, role: ru.role, firstName: ru.firstName, lastName: ru.lastName, email: ru.email })
      return res
    }
  } catch (e) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export const runtime = 'nodejs'
