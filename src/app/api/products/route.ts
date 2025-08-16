import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { seedProducts } from './seed'
import { randomUUID } from 'crypto'

// List products (seeds defaults on first call)
export async function GET() {
  await seedProducts()
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(products)
}

// Create a new product
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const nameRaw = typeof body?.name === 'string' ? body.name.trim() : ''
    const priceRaw = body?.price
    const imageUrlRaw = typeof body?.imageUrl === 'string' ? body.imageUrl.trim() : ''

    if (!nameRaw) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const price = Number(priceRaw)
    if (!Number.isInteger(price) || price < 0) {
      return NextResponse.json({ error: 'Price must be a non-negative integer (in INR)' }, { status: 400 })
    }

    const imageUrl = imageUrlRaw || null

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
      data: { name: nameRaw, price, imageUrl: imageUrl ?? undefined, slug },
    })
    return NextResponse.json(product, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
