import { NextResponse } from 'next/server'
import { seedProducts } from '../products/seed'

export async function POST() {
  await seedProducts()
  return NextResponse.json({ ok: true })
}


