import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const CART_COOKIE = 'cartId'
const USER_COOKIE = 'userId' // TODO: replace with real auth session

function getCookieFromRequest(req: Request, name: string): string | undefined {
  const header = req.headers.get('cookie') || ''
  const parts = header.split(';')
  for (const part of parts) {
    const [k, ...rest] = part.trim().split('=')
    if (k === name) return decodeURIComponent(rest.join('='))
  }
  return undefined
}

export async function POST(req: Request) {
  try {
    const userId = getCookieFromRequest(req, USER_COOKIE)
    if (!userId) return NextResponse.json({ error: 'Auth required' }, { status: 401 })

    const cartId = getCookieFromRequest(req, CART_COOKIE)
    if (!cartId) return NextResponse.json({ error: 'Cart not found' }, { status: 400 })

    const body = await req.json()
    const { email, shipping, billing } = body ?? {}
    if (!email || !shipping || !billing) {
      return NextResponse.json({ error: 'Missing email/shipping/billing' }, { status: 400 })
    }

    const p: any = prisma as any
    const cart = await p.cart.findUnique({
      where: { id: cartId },
      include: { items: { include: { product: true } } },
    })
    const items = cart?.items ?? []
    if (items.length === 0) return NextResponse.json({ error: 'Cart empty' }, { status: 400 })

    const subtotal = items.reduce((sum: number, it: any) => sum + it.quantity * (it.product?.price ?? 0), 0)
    const shippingAmt = 0
    const taxAmt = 0
    const total = subtotal + shippingAmt + taxAmt

    const order = await p.order.create({
      data: {
        cartId,
        userId,
        email,
        status: 'cod_pending',
        subtotal,
        shipping: shippingAmt,
        tax: taxAmt,
        total,
        currency: 'INR',
        items: {
          create: items.map((it: any) => ({
            productId: it.productId,
            name: it.product?.name ?? '',
            price: it.product?.price ?? 0,
            quantity: it.quantity,
            imageUrl: it.product?.imageUrl ?? undefined,
          })),
        },
        addresses: {
          create: [
            { type: 'shipping', ...shipping },
            { type: 'billing', ...billing },
          ],
        },
        payments: {
          create: {
            provider: 'cod',
            amount: total,
            status: 'created',
          },
        },
      },
    })

    // Clear cart items after placing COD order
    await p.cartItem.deleteMany({ where: { cartId } })

    return NextResponse.json({ orderId: order.id })
  } catch (e) {
    console.error('cod error', e)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
