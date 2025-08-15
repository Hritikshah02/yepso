import { NextResponse } from 'next/server'

// Proxy aggregator to fetch multiple catalogs from the Django backend.
// Avoids CORS in the browser by fetching server-side in Next.js.
export async function GET(_req: Request) {
  const baseEnv = process.env.CATALOG_API_BASE || ''
  const useDemo = process.env.USE_DEMO_CATALOGS === '1' || !baseEnv

  if (useDemo) {
    const mk = (apiIndex: number, title: string, i: number) => ({
      id: `${apiIndex}-${i}`,
      card_title: title,
      card_image: '/placeholder.svg',
      product_image: '/placeholder.svg',
      apiIndex,
    })
    const catalogs: any[][] = [
      Array.from({ length: 4 }, (_, i) => mk(0, `New Drop ${i + 1}`, i)),
      Array.from({ length: 4 }, (_, i) => mk(1, `Inverter ${i + 1}`, i)),
      Array.from({ length: 4 }, (_, i) => mk(2, `AIO Lithium ${i + 1}`, i)),
      Array.from({ length: 4 }, (_, i) => mk(3, `AC Stabiliser ${i + 1}`, i)),
    ]
    return NextResponse.json({ catalogs }, { status: 200 })
  }

  const base = baseEnv || 'http://127.0.0.1:8000'

  // For robustness, try multiple path variants per category (to handle typos or slug changes)
  const pathVariants: string[][] = [
    // New Drops
    ['/catalog/catalogs_new_drops/'],
    // Inverter (handle misspelling "inveter")
    ['/catalog/catalogs_inverter/', '/catalog/catalogs_inveter/'],
    // AIO Lithium
    ['/catalog/catalogs_aio_lithium/'],
    // AC Stabilizer (handle misspelling "stabalizer")
    ['/catalog/catalogs_ac_stabilizer/', '/catalog/catalogs_ac_stabalizer/'],
  ]

  async function fetchFirstOk(paths: string[], apiIndex: number) {
    for (const p of paths) {
      try {
        const res = await fetch(`${base}${p}`, { cache: 'no-store' })
        if (!res.ok) continue
        const json = await res.json()
        const arr = Array.isArray(json)
          ? json
          : Array.isArray((json as any)?.results)
            ? (json as any).results
            : null
        if (arr) return arr.map((item: any) => ({ ...item, apiIndex }))
      } catch {
        // try next variant
      }
    }
    return [] as any[]
  }

  try {
    const parsed = await Promise.all(
      pathVariants.map((variants, idx) => fetchFirstOk(variants, idx))
    )

    const catalogs: any[][] = parsed.map((arr) => arr)
    return NextResponse.json({ catalogs }, { status: 200 })
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to fetch catalogs' },
      { status: 502 }
    )
  }
}
