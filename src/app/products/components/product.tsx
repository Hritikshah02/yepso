'use client'
import { useEffect, useMemo, useState } from "react";
import ProductCardDetailed from "./productcarddetailed"; // Import the reusable component
 import ProductCardCatalog from "./productcard";
import { useSearchParams, useRouter } from 'next/navigation'
 type TabKey = "latest" | "popular" | "reviewed";

 type ApiProduct = {
  id: number
  slug: string
  name: string
  price: number
  imageUrl?: string | null
  createdAt: string
  _count?: { cartItems: number }
  discountPercent?: number | null
  active?: boolean
 }

 type CardProduct = {
  image: string
  hoverImage?: string
  discount?: string
  title: string
  reviews: string
  price: number
  timer: string
  slug: string
  discountPercent?: number | null
 }
 
// Tabs Names (Custom Names)
const tabNames: Record<TabKey, string> = {
  latest: "Latest Products",
  popular: "Most Popular",
  reviewed: "Most Reviewed",
};

// Tabs Component
const Tabs: React.FC<{ tabs: TabKey[]; selectedTab: TabKey; onTabClick: (tab: TabKey) => void }> = ({ tabs, selectedTab, onTabClick }) => (
  <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-gray-500 font-semibold text-base sm:text-lg md:text-2xl">
    {tabs.map((tab: TabKey) => (
      <span
        key={tab}
        className={`cursor-pointer ${selectedTab === tab ? "text-black border-b-2 border-black pb-1" : ""}`}
        onClick={() => onTabClick(tab)}
      >
        {tabNames[tab]} {/* Use custom tab names */}
      </span>
    ))}
  </div>
);

// ProductCatalogue Component
const ProductCatalogue: React.FC<{ tabs: TabKey[]; useDetailedCards?: boolean }> = ({ tabs, useDetailedCards = true }) => {
  const [selectedTab, setSelectedTab] = useState<TabKey>(tabs[0]); // Default to the first tab
  const [items, setItems] = useState<ApiProduct[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchInfo, setSearchInfo] = useState<{ query: string; suggestions: CardProduct[] } | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/products', { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: ApiProduct[] = await res.json()
        if (active) setItems(data)
      } catch (e: any) {
        if (active) setError(e?.message || 'Failed to load products')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  // (removed; replaced by improved effect after 'grouped' definition below)

  const discountFor = (slug: string) => {
    let sum = 0
    for (const ch of slug) sum = (sum + ch.charCodeAt(0)) % 1000
    const pct = 10 + (sum % 31) // 10% - 40%
    const rounded = Math.min(50, Math.max(10, Math.round(pct / 5) * 5))
    return `-${rounded}%`
  }

  // Numeric counterpart so cards can compute strike-through pricing even when DB doesn't have discountPercent
  const discountPctFor = (slug: string): number => {
    let sum = 0
    for (const ch of slug) sum = (sum + ch.charCodeAt(0)) % 1000
    const pct = 10 + (sum % 31)
    const rounded = Math.min(50, Math.max(10, Math.round(pct / 5) * 5))
    return rounded
  }

  const toCard = (p: ApiProduct): CardProduct => {
    const pct = p.discountPercent ?? discountPctFor(p.slug)
    return {
      image: p.imageUrl || '/placeholder.svg',
      title: p.name,
      price: p.price,
      reviews: String(p._count?.cartItems ?? 0), // placeholder until reviews exist
      timer: '—',
      slug: p.slug,
      discount: `-${pct}%`,
      discountPercent: pct,
    }
  }

  const grouped = useMemo(() => {
    const list = items ?? []
    const latest = [...list]
      .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
      .map(toCard)
    const popular = [...list]
      .sort((a, b) => (b._count?.cartItems ?? 0) - (a._count?.cartItems ?? 0))
      .map(toCard)
    // Placeholder for Most Reviewed until real review counts exist
    const reviewed = [...list]
      .sort((a, b) => b.name.localeCompare(a.name))
      .map(toCard)
    return { latest, popular, reviewed }
  }, [items])

  // After lists are prepared, if there's a search query (?q=), scroll to the matching product
  useEffect(() => {
    const q = (searchParams?.get('q') || '').trim()
    if (!q) return

    setSearchLoading(true)

    const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const lower = q.toLowerCase()

    // Simple fuzzy score combining multiple rules
    const fuzzyScore = (query: string, target: string): number => {
      const t = target.toLowerCase()
      const ql = query.toLowerCase()
      if (t === ql) return 100
      if (t.startsWith(ql)) return 90
      if (t.includes(ql)) return 80
      // subsequence match ratio
      let i = 0, j = 0
      while (i < ql.length && j < t.length) {
        if (ql[i] === t[j]) i++
        j++
      }
      const ratio = i / Math.max(1, ql.length)
      return ratio >= 0.6 ? Math.round(60 + 40 * ratio) : 0
    }

    // Build unique list across all tabs
    const allTabs = ['latest', 'popular', 'reviewed'] as TabKey[]
    const seen = new Set<string>()
    const all: Array<{ tab: TabKey; product: CardProduct; score: number }> = []
    for (const tab of allTabs) {
      const list = (grouped[tab] as CardProduct[]) || []
      for (const p of list) {
        if (seen.has(p.slug)) continue
        seen.add(p.slug)
        const score = Math.max(
          fuzzyScore(lower, p.title),
          fuzzyScore(lower, p.slug)
        )
        if (score > 0) all.push({ tab, product: p, score })
      }
    }

    if (all.length === 0) {
      setSearchLoading(false)
      setSearchInfo({ query: q, suggestions: [] })
      return
    }

    all.sort((a, b) => b.score - a.score)
    const best = all[0]
    const suggestionList = all.filter(x => x.score >= Math.max(60, best.score - 10)).slice(0, 5).map(x => x.product)

    if (suggestionList.length > 1) {
      setSearchInfo({ query: q, suggestions: suggestionList })
    } else {
      setSearchInfo(null)
    }

    let targetTab: TabKey | null = best.tab !== selectedTab ? best.tab : null
    const match = best.product

    const doScroll = () => {
      const el = document.getElementById(`prod-${match!.slug}`)
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el.classList.add('ring-2', 'ring-red-500', 'rounded-xl', 'transition')
        window.setTimeout(() => el.classList.remove('ring-2', 'ring-red-500'), 2200)
        // Clear the query param so the same search can be repeated later
        try { router.replace('/products', { scroll: false }) } catch {}
        setSearchLoading(false)
        // Auto-dismiss suggestions after a few seconds
        if (suggestionList.length > 1) {
          const hideId = window.setTimeout(() => setSearchInfo(null), 8000)
          // returning cleanup from nested timeout is not straightforward here; acceptable
        }
      }
    }

    if (targetTab && targetTab !== selectedTab) {
      setSelectedTab(targetTab)
      // wait for tab content to render
      const id = window.setTimeout(doScroll, 150)
      return () => window.clearTimeout(id)
    } else {
      const id = window.setTimeout(doScroll, 100)
      return () => window.clearTimeout(id)
    }
  }, [searchParams, grouped, selectedTab])

  // Function to handle tab click
  const handleTabClick = (tab: TabKey) => {
    setSelectedTab(tab);
  };

  // Render products based on selected tab
  const renderProducts = () => {
    if (loading) return <div className="py-10 text-gray-500">Loading products...</div>
    if (error) return <div className="py-10 text-red-600">{error}</div>
    const list = grouped[selectedTab] as CardProduct[]
    return list?.map((product) => (
      <div key={product.slug} id={`prod-${product.slug}`} className="scroll-mt-24">
        {useDetailedCards ? (
          <ProductCardDetailed image={product.image} hoverImage={product.hoverImage} discount={product.discount} title={product.title} reviews={product.reviews} price={product.price} timer={product.timer} slug={product.slug} discountPercent={product.discountPercent} />
        ) : (
          <ProductCardCatalog image={product.image} title={product.title} />
        )}
      </div>
    ));
  };

  return (
    <div id="catalog" className="px-4 sm:px-6 md:px-12 py-8 sm:py-10 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 border-b pb-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black">Catalogue<div className="w-1/2 sm:w-2/3 lg:w-[60%] h-[3px] bg-red-600 mt-3 sm:mt-4"></div></h2>
        <Tabs tabs={tabs} selectedTab={selectedTab} onTabClick={handleTabClick} />
      </div>

      {/* Search status / suggestions */}
      {searchLoading && (
        <div className="mb-3 flex items-center gap-2 text-sm text-gray-700">
          <svg className="animate-spin h-4 w-4 text-red-600" viewBox="0 0 24 24" aria-hidden>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span>Finding your product...</span>
        </div>
      )}

      {searchInfo && searchInfo.suggestions.length > 1 && (
        <div className="mb-4 text-sm">
          <div className="mb-1 text-gray-700">Multiple matches found for "{searchInfo.query}"</div>
          <div className="flex flex-wrap gap-2">
            {searchInfo.suggestions.map(s => (
              <button
                key={s.slug}
                onClick={() => {
                  const el = document.getElementById(`prod-${s.slug}`)
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }}
                className="px-2.5 py-1 rounded-full border border-gray-300 hover:border-red-500 hover:text-red-600"
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch gap-4 sm:gap-6 mt-6">
        {renderProducts()}
      </div>
    </div>
  );
};

// (Removed static sample data; now fetched from API)

// Tabs options
const tabs: TabKey[] = ["latest", "popular", "reviewed"];

export default function App() {
  return (
    <div>
         <ProductCatalogue tabs={tabs} useDetailedCards={true} />
    </div>
  );
}
