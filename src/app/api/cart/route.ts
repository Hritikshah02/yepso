// Read cookies from Request headers and set them via NextResponse
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'

const CART_COOKIE = 'cartId'
const CART_COOKIE_MAX_AGE_DAYS = 30

function getCookieFromRequest(req: Request, name: string): string | undefined {
  const header = req.headers.get('cookie') || ''
  const parts = header.split(';')
  for (const part of parts) {
    const [k, ...rest] = part.trim().split('=')
    if (k === name) return decodeURIComponent(rest.join('='))
  }
  return undefined
}

function getOrCreateCartIdFromRequest(req: Request): { cartId: string; shouldSet: boolean } {
  const existing = getCookieFromRequest(req, CART_COOKIE)
  if (existing) return { cartId: existing, shouldSet: false }
  return { cartId: randomUUID(), shouldSet: true }
}

export async function GET(req: Request) {
  const cartId = getCookieFromRequest(req, CART_COOKIE)
  if (!cartId) return NextResponse.json({ items: [], total: 0 })

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: { include: { product: true } } },
  })
  const items = cart?.items ?? []
  const total = items.reduce((sum, item) => sum + item.quantity * (item.product?.price ?? 0), 0)
  return NextResponse.json({ items, total })
}

export async function POST(req: Request) {
  const body = await req.json()
  const { productId, quantity = 1 } = body ?? {}
  if (!productId || quantity < 1) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const { cartId, shouldSet } = getOrCreateCartIdFromRequest(req)
  await prisma.cart.upsert({
    where: { id: cartId },
    update: {},
    create: { id: cartId },
  })

  const item = await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId, productId } },
    update: { quantity: { increment: quantity } },
    create: { cartId, productId, quantity },
  })

  const res = NextResponse.json(item, { status: 201 })
  if (shouldSet) {
    res.cookies.set(CART_COOKIE, cartId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: CART_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60,
    })
  }
  return res
}

export async function PATCH(req: Request) {
  const cartId = getCookieFromRequest(req, CART_COOKIE)
  if (!cartId) return NextResponse.json({ error: 'No cart' }, { status: 400 })
  const body = await req.json()
  const { productId, quantity } = body ?? {}
  if (!productId || typeof quantity !== 'number' || quantity < 1) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
  const item = await prisma.cartItem.update({
    where: { cartId_productId: { cartId, productId } },
    data: { quantity },
  })
  return NextResponse.json(item)
}

export async function DELETE(req: Request) {
  const cartId = getCookieFromRequest(req, CART_COOKIE)
  if (!cartId) return NextResponse.json({ ok: true })
  const { searchParams } = new URL(req.url)
  const productId = Number(searchParams.get('productId'))
  if (!productId) return NextResponse.json({ error: 'Invalid productId' }, { status: 400 })
  await prisma.cartItem.delete({ where: { cartId_productId: { cartId, productId } } })
  return NextResponse.json({ ok: true })
}


