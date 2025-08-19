import { prisma } from '@/lib/prisma'

// Deterministic fallback discount percent based on slug (10%..50% rounded to 5%)
export const discountPctFor = (slug: string): number => {
  let sum = 0
  for (const ch of slug) sum = (sum + ch.charCodeAt(0)) % 1000
  const pct = 10 + (sum % 31)
  const rounded = Math.min(50, Math.max(10, Math.round(pct / 5) * 5))
  return rounded
}

// Raw defaults used for both DB seeding and runtime fallbacks
export const DEFAULT_PRODUCT_SEED = [
  {
    slug: '3-in-1-inverter',
    name: '3 in 1 inverter',
    price: 15000,
    imageUrl: '/Static/Image/products/3-in-1-inverter.png',
  },
  {
    slug: '5kva-mainline-voltage-stabilizer',
    name: '5kva mainline voltage stabilizer',
    price: 8000,
    imageUrl: '/Static/Image/products/5kva-mainline-voltage-stabilizer.png',
  },
  {
    slug: '10kva-mainline-voltage-stabilizer',
    name: '10kva mainline voltage stabilizer',
    price: 12000,
    imageUrl: '/Static/Image/products/10kva-mainline-voltage-stabilizer.png',
  },
  {
    slug: 'all-in-one-lithium-battery',
    name: 'all in one lithium battery',
    price: 30000,
    imageUrl: '/Static/Image/products/all-in-one-lithium-battery.png',
  },
  {
    slug: 'home-ups-inverter',
    name: 'home ups inerter',
    price: 10000,
    imageUrl: '/Static/Image/products/home-ups-inverter.png',
  },
  {
    slug: 'voltage-stabilizer-for-washing-machine',
    name: 'voltage stabilizer for washing machine',
    price: 4000,
    imageUrl: '/Static/Image/products/voltage-stabilizer-for-washing-machine.png',
  },
] as const

// Fully shaped fallback items for API responses when DB is unavailable
export const FALLBACK_PRODUCTS = DEFAULT_PRODUCT_SEED.map((p, idx) => ({
  id: 1000 + idx,
  slug: p.slug,
  name: p.name,
  price: p.price,
  imageUrl: p.imageUrl,
  discountPercent: discountPctFor(p.slug),
  active: true,
  createdAt: new Date(Date.now() - idx * 86400000).toISOString(),
  _count: { cartItems: 0 },
}))

export async function seedProducts() {
  // Upsert each product so new ones are added over time without duplicates
  for (const p of DEFAULT_PRODUCT_SEED) {
    // eslint-disable-next-line no-await-in-loop
    const existing = await prisma.product.findUnique({ where: { slug: p.slug } })
    const pct = discountPctFor(p.slug)
    if (!existing) {
      // Create with a default discountPercent so UI/Admin sees it
      // Note: price is treated as current discounted price elsewhere in UI
      await prisma.product.create({
        data: { ...p, discountPercent: pct },
      })
    } else if (existing.discountPercent == null) {
      // Backfill discountPercent for already seeded products that missed it
      await prisma.product.update({
        where: { slug: p.slug },
        data: { discountPercent: pct },
      })
    }
  }
}

