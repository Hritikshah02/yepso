'use client'
import { useEffect, useMemo, useState } from "react";
import ProductCardDetailed from "./productcarddetailed"; // Import the reusable component
 import ProductCardCatalog from "./productcard";
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
      useDetailedCards ? (
        <ProductCardDetailed key={product.slug} image={product.image} hoverImage={product.hoverImage} discount={product.discount} title={product.title} reviews={product.reviews} price={product.price} timer={product.timer} slug={product.slug} discountPercent={product.discountPercent} />
      ) : (
        <ProductCardCatalog key={product.slug} image={product.image} title={product.title} />
      )
    ));
  };

  return (
    <div className="px-4 sm:px-6 md:px-12 py-8 sm:py-10 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 border-b pb-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black">Catalogue<div className="w-1/2 sm:w-2/3 lg:w-[60%] h-[3px] bg-red-600 mt-3 sm:mt-4"></div></h2>
        <Tabs tabs={tabs} selectedTab={selectedTab} onTabClick={handleTabClick} />
      </div>

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
