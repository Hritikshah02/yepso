import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Create a review
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const orderId = typeof body?.orderId === 'string' && body.orderId.trim() ? body.orderId.trim() : undefined
    const name = typeof body?.name === 'string' && body.name.trim() ? body.name.trim() : undefined
    const email = typeof body?.email === 'string' && body.email.trim() ? body.email.trim().toLowerCase() : undefined
    const ratingRaw = body?.rating
    const comment = typeof body?.comment === 'string' && body.comment.trim() ? body.comment.trim() : undefined

    const rating = Number.isFinite(Number(ratingRaw)) ? Number(ratingRaw) : NaN
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 })
    }

    // Use any-cast to avoid TS issues until Prisma client is regenerated with Review/Order models
    const p: any = prisma as any
    // Optional: If orderId is provided, ensure it exists
    if (orderId) {
      try {
        const order = await p.order.findUnique({ where: { id: orderId } })
        if (!order) return NextResponse.json({ error: 'Invalid orderId' }, { status: 400 })
      } catch (e) {
        return NextResponse.json({ error: 'Server is not migrated for orders. Please run prisma migrate/generate.' }, { status: 500 })
      }
    }

    let review
    try {
      review = await p.review.create({ data: { orderId, name, email, rating, comment } })
    } catch (e) {
      return NextResponse.json({ error: 'Server is not migrated for reviews. Please run prisma migrate/generate.' }, { status: 500 })
    }
    return NextResponse.json(review, { status: 201 })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
