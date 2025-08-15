import { NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { createHmac } from 'crypto'
import { sendOrderEmail } from '@/lib/email'

const prisma = new PrismaClient()

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET
  if (!secret) return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 })

  const raw = await req.text()
  const signature = req.headers.get('x-razorpay-signature') || ''
  const expected = createHmac('sha256', secret).update(raw).digest('hex')
  if (signature !== expected) return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })

  let payload: any
  try { payload = JSON.parse(raw) } catch { return NextResponse.json({ ok: true }) }

  const event: string = payload?.event || ''
  const payment = payload?.payload?.payment?.entity
  const order = payload?.payload?.order?.entity

  // Determine provider order id and payment id
  const providerOrderId: string | undefined = payment?.order_id || order?.id
  const providerPaymentId: string | undefined = payment?.id

  if (!providerOrderId) return NextResponse.json({ ok: true })

  const dbPayment = await prisma.payment.findFirst({ where: { providerOrderId } })
  if (!dbPayment) return NextResponse.json({ ok: true })

  // Only mark paid for captured payments or order paid
  const isPaid = event === 'payment.captured' || event === 'order.paid' || payment?.status === 'captured'

  await prisma.payment.update({
    where: { id: dbPayment.id },
    data: {
      providerPaymentId: providerPaymentId ?? dbPayment.providerPaymentId ?? null,
      status: isPaid ? 'paid' : (payment?.status === 'failed' ? 'failed' : dbPayment.status),
      raw: payload,
    },
  })

  const dbOrder = await prisma.order.findUnique({ where: { id: dbPayment.orderId } })
  if (dbOrder) {
    if (isPaid && dbOrder.status !== 'paid') {
      await prisma.order.update({ where: { id: dbOrder.id }, data: { status: 'paid' } })
      // clear cart items
      if (dbOrder.cartId) {
        await prisma.cartItem.deleteMany({ where: { cartId: dbOrder.cartId } })
      }
      // send confirmation email
      if (dbOrder.email) {
        await sendOrderEmail({
          to: dbOrder.email,
          subject: `Order ${dbOrder.id} confirmed`,
          html: `<p>Thank you! Your payment for order <b>${dbOrder.id}</b> has been received.</p>`
        })
      }
    }
  }

  return NextResponse.json({ ok: true })
}
