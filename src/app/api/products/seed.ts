import { prisma } from '@/lib/prisma'

export async function seedProducts() {
  const defaults = [
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
