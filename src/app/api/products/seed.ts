import { prisma } from '@/lib/prisma'

export async function seedProducts() {
  const defaults = [
    { slug: 'smart-inverter', name: 'Smart Inverter', price: 20000, imageUrl: '/Static/Image/about2.png' },
    { slug: 'smart-fan', name: 'Smart Fan', price: 15000, imageUrl: '/Static/Image/about2.png' },
    { slug: 'air-conditioner', name: 'Air Conditioner', price: 50000, imageUrl: '/Static/Image/about2.png' },
    { slug: 'led-bulb', name: 'LED Bulb', price: 500, imageUrl: '/Static/Image/about2.png' },
    { slug: 'washing-machine', name: 'Washing Machine', price: 30000, imageUrl: '/Static/Image/about2.png' },
    { slug: 'refrigerator', name: 'Refrigerator', price: 25000, imageUrl: '/Static/Image/about2.png' },
    { slug: 'laptop', name: 'Laptop', price: 60000, imageUrl: '/Static/Image/about2.png' },
    { slug: 'smartphone', name: 'Smartphone', price: 30000, imageUrl: '/Static/Image/about2.png' },
    { slug: 'smart-watch', name: 'Smart Watch', price: 12000, imageUrl: '/Static/Image/about2.png' },
  ] as const

  // Upsert each product so new ones are added over time without duplicates
  for (const p of defaults) {
    // eslint-disable-next-line no-await-in-loop
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: { ...p },
    })
  }
}


