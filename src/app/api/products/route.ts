import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { randomUUID } from 'crypto'
import { FALLBACK_PRODUCTS, ensureRuntimeProducts } from './seed'

// List products (seeds defaults on first call)
export async function GET(req: Request) {
  const url = new URL(req.url)
  const slug = url.searchParams.get('slug')?.trim() || ''
  const includeInactive = url.searchParams.get('includeInactive') === 'true'

  // Single product by slug
  if (slug) {
    try {
      const product = await prisma.product.findUnique({ where: { slug } })
      if (product) return NextResponse.json(product)
      // DB returned null -> try runtime store then static seeds
      const store = ensureRuntimeProducts()
      const runtimeItem = store.find((p) => p.slug === slug)
      if (runtimeItem) return NextResponse.json(runtimeItem)
      const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug)
      if (fallback) return NextResponse.json(fallback)
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    } catch (e) {
      // runtime store first
      const store = ensureRuntimeProducts()
      const runtimeItem = store.find((p) => p.slug === slug)
      if (runtimeItem) return NextResponse.json(runtimeItem)
      const fallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug)
      if (fallback) return NextResponse.json(fallback)
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
  }

  // List
  try {
    const products = await prisma.product.findMany({
      where: includeInactive ? {} : { active: true },
      include: { _count: { select: { cartItems: true } } },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(products)
  } catch (e) {
    console.error('[api/products] DB error', e)
    const store = ensureRuntimeProducts()
    const filtered = includeInactive ? store : store.filter((p) => p.active)
    return NextResponse.json(filtered)
  }
}

// Create a new product
export async function POST(req: Request) {
  // Parse once; invalid JSON should 400
  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const nameRaw = typeof (body as any)?.name === 'string' ? (body as any).name.trim() : ''
  const priceRaw = (body as any)?.price
  const imageUrlRaw = typeof (body as any)?.imageUrl === 'string' ? (body as any).imageUrl.trim() : ''
  const discountPercentRaw = (body as any)?.discountPercent
  const descriptionRaw = typeof (body as any)?.description === 'string' ? (body as any).description.trim() : ''
  const shippingRaw = typeof (body as any)?.shipping === 'string' ? (body as any).shipping.trim() : ''
  const specificationsRaw = typeof (body as any)?.specifications === 'string' ? (body as any).specifications.trim() : ''
  const activeRaw = (body as any)?.active

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

  try {
    // Ensure unique slug in DB
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
  } catch (e) {
    // Serverless fallback: write to runtime store
    const store = ensureRuntimeProducts()
    // ensure unique slug in runtime store
    if (store.some(p => p.slug === slug)) slug = `${slug}-${randomUUID().slice(0, 6)}`
    const nextId = (store.reduce((m, p) => Math.max(m, p.id), 0) || 0) + 1
    const now = new Date().toISOString()
    const created = {
      id: nextId,
      slug,
      name: nameRaw,
      price,
      imageUrl: imageUrl ?? undefined,
      discountPercent: discountPercent ?? undefined,
      active,
      createdAt: now,
      _count: { cartItems: 0 },
      description: description ?? undefined,
      shipping: shipping ?? undefined,
      specifications: specifications ?? undefined,
    } as any
    store.unshift(created)
    return NextResponse.json(created, { status: 201 })
  }
}
