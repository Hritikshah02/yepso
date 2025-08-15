import { NextResponse } from 'next/server'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Minimal signup handler to prevent 404s and accept form submissions.
// NOTE: This implementation does not persist users yet. Hook it up to Prisma if needed.
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const name = typeof body?.name === 'string' ? body.name.trim() : ''
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : ''
    const password = typeof body?.password === 'string' ? body.password : ''

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Name, email and password are required' }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ message: 'Invalid email' }, { status: 400 })
    }

    // Placeholder success response. Replace with Prisma logic to persist users.
    // Example (when wired to Prisma):
    // const existing = await prisma.user.findUnique({ where: { email } })
    // if (existing) return NextResponse.json({ message: 'Email already in use' }, { status: 409 })
    // const passwordHash = hashPassword(password)
    // const user = await prisma.user.create({ data: { name, email, passwordHash } })

    return NextResponse.json({ ok: true, user: { name, email } }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ message: 'Invalid request body' }, { status: 400 })
  }
}
