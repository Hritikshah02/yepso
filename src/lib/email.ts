export type OrderEmailPayload = {
  to: string
  subject: string
  html: string
}

async function sendViaResend(payload: OrderEmailPayload) {
  const key = process.env.RESEND_API_KEY
  if (!key) return false
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || 'orders@example.com',
        to: [payload.to],
        subject: payload.subject,
        html: payload.html
      })
    })
    return res.ok
  } catch {
    return false
  }
}

export async function sendOrderEmail(payload: OrderEmailPayload) {
  const ok = await sendViaResend(payload)
  if (!ok) {
    console.log('[email:dev]', payload.subject, '->', payload.to)
  }
}
