import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { FALLBACK_PRODUCTS, ensureRuntimeProducts } from '../seed'

export async function GET(_req: Request, ctx: any) {
  const slug = (ctx?.params?.slug ?? '') as string
  try {
    const product = await prisma.product.findUnique({ where: { slug } })
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch (e) {
    // Fallback to seeded static data in serverless/read-only environments
    const fallback = FALLBACK_PRODUCTS.find(p => p.slug === slug)
    if (!fallback) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(fallback)
  }
}

export async function DELETE(_req: Request, ctx: any) {
  const slug = (ctx?.params?.slug ?? '') as string
  try {
    const product = await prisma.product.findUnique({ where: { slug } })
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Prevent deletion if referenced in carts
    const cartRefs = await prisma.cartItem.count({ where: { productId: product.id } })
    if (cartRefs > 0) {
      return NextResponse.json(
        { error: 'Cannot delete: product is present in one or more carts' },
        { status: 409 }
      )
    }

    await prisma.product.delete({ where: { id: product.id } })
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (_e) {
    // Runtime fallback: delete from in-memory store
    const store = ensureRuntimeProducts()
    const idx = store.findIndex(p => p.slug === slug)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    store.splice(idx, 1)
    return NextResponse.json({ ok: true }, { status: 200 })
  }
}

// Update fields (e.g., active toggle, discountPercent, description, shipping, specifications)
export async function PATCH(req: Request, ctx: any) {
  const slug = (ctx?.params?.slug ?? '') as string
  const body = await req.json().catch(() => ({}))

  const data: any = {}

  if (typeof body?.active === 'boolean') data.active = body.active

  if (body?.discountPercent !== undefined) {
    const d = Number(body.discountPercent)
    if (!Number.isInteger(d) || d < 0 || d > 90) {
      return NextResponse.json({ error: 'discountPercent must be an integer between 0 and 90' }, { status: 400 })
    }
    data.discountPercent = d
  }

  if (typeof body?.description === 'string') data.description = body.description.trim() || null
  if (typeof body?.shipping === 'string') data.shipping = body.shipping.trim() || null
  if (typeof body?.specifications === 'string') data.specifications = body.specifications.trim() || null

  if (body?.price !== undefined) {
    const price = Number(body.price)
    if (!Number.isInteger(price) || price < 0) {
      return NextResponse.json({ error: 'Price must be a non-negative integer (in INR)' }, { status: 400 })
    }
    data.price = price
  }

  if (typeof body?.imageUrl === 'string') {
    const trimmed = body.imageUrl.trim()
    data.imageUrl = trimmed || null
  }

  try {
    const updated = await prisma.product.update({ where: { slug }, data })
    return NextResponse.json(updated)
  } catch (e) {
    // Runtime fallback: update in-memory store
    const store = ensureRuntimeProducts()
    const idx = store.findIndex(p => p.slug === slug)
    if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const merged = { ...store[idx], ...data }
    store[idx] = merged as any
    return NextResponse.json(merged)
  }
}
