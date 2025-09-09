// Read cookies from Request headers and set them via NextResponse
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'
import { FALLBACK_PRODUCTS, ensureRuntimeProducts } from '../products/seed'

const CART_COOKIE = 'cartId'
const USER_COOKIE = 'userId'
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
  // If logged in, force cart id to user id so cart is unique per member
  const userId = getCookieFromRequest(req, USER_COOKIE)
  const existing = getCookieFromRequest(req, CART_COOKIE)
  if (userId) {
    const shouldSet = existing !== userId
    return { cartId: userId, shouldSet }
  }
  if (existing) return { cartId: existing, shouldSet: false }
  return { cartId: randomUUID(), shouldSet: true }
}

function getCartIdFromRequest(req: Request): { cartId: string | undefined; shouldSet: boolean } {
  const userId = getCookieFromRequest(req, USER_COOKIE)
  const existing = getCookieFromRequest(req, CART_COOKIE)
  if (userId) {
    return { cartId: userId, shouldSet: existing !== userId }
  }
  return { cartId: existing, shouldSet: false }
}

// Runtime in-memory cart store: cartId -> (productId -> quantity)
type RuntimeCart = Record<string, Record<number, number>>
let RUNTIME_CARTS: RuntimeCart = Object.create(null)

function getRuntimeCart(cartId: string): Record<number, number> {
  if (!RUNTIME_CARTS[cartId]) RUNTIME_CARTS[cartId] = Object.create(null)
  return RUNTIME_CARTS[cartId]
}

async function getProductById(productId: number) {
  try {
    const p = await prisma.product.findUnique({ where: { id: productId } })
    if (p) return p
  } catch (_) {
    // ignore prisma errors in serverless
  }
  const store = ensureRuntimeProducts()
  const runtime = store.find(p => p.id === productId)
  if (runtime) return runtime
  const fb = FALLBACK_PRODUCTS.find(p => p.id === productId)
  return fb ?? null
}

export async function GET(req: Request) {
  const { cartId, shouldSet } = getCartIdFromRequest(req)
  if (!cartId) return NextResponse.json({ items: [], total: 0 })

  try {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    })
    const items = cart?.items ?? []
    if (items.length > 0) {
      // Include discountPercent in subtotal; match UI logic which rounds per-unit discounted price
      const total = items.reduce((sum: number, item: any) => {
        const price = item.product?.price ?? 0
        const discount = item.product?.discountPercent ?? 0
        const unit = Math.round(price * (1 - discount / 100))
        return sum + unit * item.quantity
      }, 0)
      const res = NextResponse.json({ items, total })
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
  } catch (_) {
    // fall back to runtime
  }

  // Runtime fallback
  const map = getRuntimeCart(cartId)
  const entries = Object.entries(map)
  const mapped = await Promise.all(entries.map(async ([pidStr, qty]) => {
    const productId = Number(pidStr)
    const product = await getProductById(productId)
    if (!product) return null
    return {
      id: productId,
      cartId,
      productId,
      quantity: qty as number,
      product,
    }
  }))
  const items = (mapped.filter(Boolean) as Array<{ id: number; cartId: string; productId: number; quantity: number; product: any }>)
  // Include discountPercent in subtotal for runtime fallback as well
  const total = items.reduce((sum: number, it: { quantity: number; product?: { price?: number; discountPercent?: number } }) => {
    const price = it.product?.price ?? 0
    const discount = it.product?.discountPercent ?? 0
    const unit = Math.round(price * (1 - discount / 100))
    return sum + unit * it.quantity
  }, 0)
  const res = NextResponse.json({ items, total })
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

export async function POST(req: Request) {
  const body = await req.json()
  const { productId, quantity = 1 } = body ?? {}
  if (!productId || quantity < 1) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

  const { cartId, shouldSet } = getOrCreateCartIdFromRequest(req)
  try {
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
  } catch (_) {
    // Runtime fallback
    const prod = await getProductById(productId)
    if (!prod) return NextResponse.json({ error: 'Invalid product' }, { status: 400 })
    const map = getRuntimeCart(cartId)
    map[productId] = (map[productId] ?? 0) + quantity
    const res = NextResponse.json({ cartId, productId, quantity: map[productId] }, { status: 201 })
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
}

export async function PATCH(req: Request) {
  const { cartId, shouldSet } = getCartIdFromRequest(req)
  if (!cartId) return NextResponse.json({ error: 'No cart' }, { status: 400 })
  const body = await req.json()
  const { productId, quantity } = body ?? {}
  if (!productId || typeof quantity !== 'number' || quantity < 1) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
  try {
    const item = await prisma.cartItem.update({
      where: { cartId_productId: { cartId, productId } },
      data: { quantity },
    })
    const res = NextResponse.json(item)
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
  } catch (_) {
    const map = getRuntimeCart(cartId)
    map[productId] = quantity
    const res = NextResponse.json({ cartId, productId, quantity })
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
}

export async function DELETE(req: Request) {
  const { cartId, shouldSet } = getCartIdFromRequest(req)
  if (!cartId) return NextResponse.json({ ok: true })
  const { searchParams } = new URL(req.url)
  const productId = Number(searchParams.get('productId'))
  if (!productId) return NextResponse.json({ error: 'Invalid productId' }, { status: 400 })
  try {
    await prisma.cartItem.delete({ where: { cartId_productId: { cartId, productId } } })
    const res = NextResponse.json({ ok: true })
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
  } catch (_) {
    const map = getRuntimeCart(cartId)
    delete map[productId]
    const res = NextResponse.json({ ok: true })
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
}


