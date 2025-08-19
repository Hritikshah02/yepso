import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'
import { FALLBACK_PRODUCTS } from './seed'

// List products (seeds defaults on first call)
export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const includeInactive = url.searchParams.get('includeInactive') === 'true'
    const products = await prisma.product.findMany({
      where: includeInactive ? {} : { active: true },
      include: { _count: { select: { cartItems: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(products)
  } catch (e) {
    console.error('[api/products] DB error', e)
    // Avoid 500 in read-only/serverless env; return seeded fallback products
    return NextResponse.json(FALLBACK_PRODUCTS)
  }
}

// Create a new product
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const nameRaw = typeof body?.name === 'string' ? body.name.trim() : ''
    const priceRaw = body?.price
    const imageUrlRaw = typeof body?.imageUrl === 'string' ? body.imageUrl.trim() : ''
    const discountPercentRaw = body?.discountPercent
    const descriptionRaw = typeof body?.description === 'string' ? body.description.trim() : ''
    const shippingRaw = typeof body?.shipping === 'string' ? body.shipping.trim() : ''
    const specificationsRaw = typeof body?.specifications === 'string' ? body.specifications.trim() : ''
    const activeRaw = body?.active

    if (!nameRaw) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const price = Number(priceRaw)
    if (!Number.isInteger(price) || price < 0) {
      return NextResponse.json({ error: 'Price must be a non-negative integer (in INR)' }, { status: 400 })
    }

    const imageUrl = imageUrlRaw || null

    let discountPercent: number | null = null
    if (discountPercentRaw !== undefined && discountPercentRaw !== null && String(discountPercentRaw).trim() !== '') {
      const d = Number(discountPercentRaw)
      if (!Number.isInteger(d) || d < 0 || d > 90) {
        return NextResponse.json({ error: 'discountPercent must be an integer between 0 and 90' }, { status: 400 })
      }
      discountPercent = d
    }

    const description = descriptionRaw || null
    const shipping = shippingRaw || null
    const specifications = specificationsRaw || null
    const active = typeof activeRaw === 'boolean' ? activeRaw : true

    const makeSlug = (s: string) =>
      s
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')

    let slug = makeSlug(nameRaw)
    if (!slug) slug = `product-${randomUUID().slice(0, 8)}`

    // Ensure unique slug
    const existing = await prisma.product.findUnique({ where: { slug } })
    if (existing) slug = `${slug}-${randomUUID().slice(0, 6)}`

    const product = await prisma.product.create({
      data: {
        name: nameRaw,
        price,
        imageUrl: imageUrl ?? undefined,
        slug,
        discountPercent: discountPercent ?? undefined,
        description: description ?? undefined,
        shipping: shipping ?? undefined,
        specifications: specifications ?? undefined,
        active,
      },
    })
    return NextResponse.json(product, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
