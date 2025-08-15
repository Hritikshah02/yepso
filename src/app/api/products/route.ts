import { NextResponse } from 'next/server'
import { PrismaClient } from '@/generated/prisma'
import { seedProducts } from './seed'

const prisma = new PrismaClient()

export async function GET() {
  await seedProducts()
  const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(products)
}


