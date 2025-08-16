import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await prisma.product.findUnique({ where: { slug } })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
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

  try {
    await prisma.product.delete({ where: { id: product.id } })
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (_e) {
    // Likely referenced by order items (FK constraint)
    return NextResponse.json(
      { error: 'Cannot delete: product is referenced by existing orders' },
      { status: 409 }
    )
  }
}
