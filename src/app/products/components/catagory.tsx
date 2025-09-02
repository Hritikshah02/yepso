"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { StaticImageData } from "next/image";
import ProductCardCatalog from "./productcard";
import ProductCardDetailed from "./productcarddetailed";
import sampleImg from "../../../../all products front and side png images/sample.jpg";
import homeUpsImg from "../../../../all products front and side png images/Home UPS inverter.png";
import newImg from "../../../../all products front and side png images/3 in 1 Inverter UPS Front.png";
import washingMachineStabImg from "../../../../all products front and side png images/voltage stabilizer for washing macine yepd90 front.png";
// Removed left promo image; header will align with link similar to Catalogue

interface PromoBannerProps {
  image: string | StaticImageData;
  discountText: string;
  title: string;
  buttonText: string;
}

type ApiProduct = {
  id: number
  slug: string
  name: string
  price: number
  imageUrl?: string | null
  createdAt?: string
  _count?: { cartItems: number }
  discountPercent?: number | null
}

const SolorBanner: React.FC<PromoBannerProps> = ({ image, discountText, title, buttonText }) => (
  <div
    className="relative w-full aspect-[16/9]"
    style={{
      // Keep text box and border perfectly aligned regardless of screen size
      // by sharing the same inset and radius values.
      ['--frame' as any]: 'clamp(12px, 2.5vw, 24px)',
      ['--radius' as any]: 'clamp(12px, 2vw, 24px)',
    }}
  >
    <Image
      src={image}
      alt={title}
      fill
      priority={false}
      sizes="(min-width:1024px) 50vw, (min-width:640px) 50vw, 100vw"
      className="object-cover rounded-[var(--radius)]"
    />

    {/* White framed overlay to match the image structure */}
    <div className="absolute inset-0">
      {/* Border frame with fluid inset */}
      <div className="absolute inset-[var(--frame)] border-white border-[3px] md:border-[4px] rounded-[var(--radius)] pointer-events-none" />

      {/* Centered overlay content, confined to the same frame inset */}
      <div className="absolute inset-[var(--frame)] flex items-center justify-center">
        <div className="text-white text-center space-y-1 sm:space-y-3 max-w-[min(88%,800px)]">
          <p className="uppercase tracking-wide opacity-90 text-[clamp(0.6rem,1.5vw,0.95rem)]">{discountText}</p>
          <h3 className="font-bold leading-[1.05] drop-shadow text-[clamp(1.8rem,7vw,4rem)]">{title}</h3>
          <button
            className="relative overflow-hidden group inline-flex items-center justify-center bg-red-600 text-white rounded-full shadow-lg text-[clamp(0.75rem,1.8vw,1.05rem)] px-[clamp(16px,3vw,32px)] py-[clamp(9px,1.6vw,15px)] transition-colors duration-300"
          >
            <span className="relative z-10 transition-colors duration-300 group-hover:text-black">{buttonText}</span>
            <span
              aria-hidden
              className="absolute inset-0 bg-white origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
)
;

const Categories: React.FC = () => {
  const [list, setList] = useState<ApiProduct[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/products', { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: ApiProduct[] = await res.json()
        if (active) setList(data)
      } catch {
        if (active) setList([])
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [])

  const byName = (needle: string) => (p: ApiProduct) => (p.name ?? '').toLowerCase().includes(needle)
  const homeUps = useMemo(() => (list ?? []).find(p => byName('home')(p) && (byName('ups')(p) || byName('inverter')(p))) ?? null, [list])
  const latest = useMemo(() => {
    const arr = list ?? []
    const sorted = [...arr].sort((a, b) => +new Date(b.createdAt ?? 0) - +new Date(a.createdAt ?? 0))
    return sorted.find(p => p.slug !== homeUps?.slug) ?? sorted[0]
  }, [list, homeUps])
  const washing = useMemo(() => {
    const arr = list ?? []
    const sorted = [...arr]
    const prefer = sorted.find(p => (byName('washing')(p) || byName('stabilizer')(p)) && p.slug !== homeUps?.slug && p.slug !== latest?.slug)
    if (prefer) return prefer
    return sorted.find(p => p.slug !== homeUps?.slug && p.slug !== latest?.slug) ?? null
  }, [list, homeUps, latest])

  return (
    <div className="px-4 sm:px-6 md:px-12 py-6 sm:py-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 border-b pb-4 text-black">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">Top Products<div className="w-1/2 sm:w-2/3 lg:w-[60%] h-[3px] bg-red-600 mt-3 sm:mt-4"></div></h2>
        <Link href="/products#catalog" className="font-semibold text-base sm:text-lg text-gray-600 hover:text-black flex items-center gap-2">
          <span className="border-b-[3px] border-b-red-600 pb-1 pr-2">All Products →</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-stretch gap-6 lg:gap-8 mt-4">
        <div className="h-full"> {/* cards in the catalog section*/}
          {homeUps ? (
            <ProductCardDetailed
              image={homeUps.imageUrl || (homeUpsImg as unknown as string)}
              title={homeUps.name}
              reviews={String(homeUps._count?.cartItems ?? 0)}
              price={homeUps.price}
              timer="—"
              slug={homeUps.slug}
              discountPercent={homeUps.discountPercent ?? undefined}
              discount={homeUps.discountPercent ? `-${homeUps.discountPercent}%` : undefined}
            />
          ) : (
            <ProductCardCatalog image={homeUpsImg} title="Home UPS Inverter" />
          )}
        </div>
        <div className="h-full">
          {latest ? (
            <ProductCardDetailed
              image={latest.imageUrl || (newImg as unknown as string)}
              title={latest.name}
              reviews={String(latest._count?.cartItems ?? 0)}
              price={latest.price}
              timer="—"
              slug={latest.slug}
              discountPercent={latest.discountPercent ?? undefined}
              discount={latest.discountPercent ? `-${latest.discountPercent}%` : undefined}
            />
          ) : (
            <ProductCardCatalog image={newImg} title="New" />
          )}
        </div>
        <div className="h-full">
          {washing ? (
            <ProductCardDetailed
              image={washing.imageUrl || (washingMachineStabImg as unknown as string)}
              title={washing.name}
              reviews={String(washing._count?.cartItems ?? 0)}
              price={washing.price}
              timer="—"
              slug={washing.slug}
              discountPercent={washing.discountPercent ?? undefined}
              discount={washing.discountPercent ? `-${washing.discountPercent}%` : undefined}
            />
          ) : (
            <ProductCardCatalog image={washingMachineStabImg} title="Voltage Stabilizer for Washing Machine" />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        <div> {/* Solar cards in the catalog section*/}
          <SolorBanner
            image={sampleImg}
            discountText="30% OFF ON STUFF"
            title="Solar Panels"
            buttonText="Shop Now"
          />
        </div>
        <div>
          <SolorBanner
            image={sampleImg}
            discountText="50% OFF ON STUFF"
            title="Solar Panels"
            buttonText="Shop Now"
          />
        </div>
      </div>
    </div>
  );
};

export default Categories;
