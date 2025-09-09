import { NextResponse } from 'next/server'

const USER_COOKIE = 'userId'
const ROLE_COOKIE = 'role'
const NAME_COOKIE = 'name'
const EMAIL_COOKIE = 'email'
const CART_COOKIE = 'cartId'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  const common = { path: '/', maxAge: 0 }
  res.cookies.set(USER_COOKIE, '', common)
  res.cookies.set(ROLE_COOKIE, '', common)
  res.cookies.set(NAME_COOKIE, '', { ...common, httpOnly: false })
  res.cookies.set(EMAIL_COOKIE, '', { ...common, httpOnly: false })
  res.cookies.set(CART_COOKIE, '', common)
  return res
}

export const runtime = 'nodejs'
