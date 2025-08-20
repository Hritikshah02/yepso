"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type CatalogCard = {
  id: string | number;
  card_title: string;
  card_image?: string | null;
  product_image?: string | null;
  apiIndex: number;
};

type ApiProduct = {
  id: number;
  slug: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  createdAt: string;
};

const fetchCatalogFallback = async () => {
  try {
    const res = await fetch('/api/catalogs', { cache: 'no-store' });
    if (!res.ok) {
      console.error('Catalog proxy failed', res.status);
      return [] as any[];
    }
    const json = await res.json();
    // API returns { catalogs: Array<Array<Item & { apiIndex:number }>> }
    return (json?.catalogs ?? []) as any[];
  } catch (err) {
    console.error('Failed to fetch catalogs', err);
    return [] as any[];
  }
};

export default function ScrollCards() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<HTMLDivElement[]>([]);
  const [allCards, setAllCards] = useState<CatalogCard[]>([]);
  const [activeApiIndex, setActiveApiIndex] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [labels, setLabels] = useState<string[]>(["New Drops", "Inverter", "AIO Lithium", "AC Stabiliser"]);

  useEffect(() => {
    const getData = async () => {
      try {
        // Try real products first
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (res.ok) {
          const products: ApiProduct[] = await res.json();
          const list = Array.isArray(products) ? products : [];

          // Build categories dynamically
          const text = (p: ApiProduct) => (p.name + ' ' + p.slug).toLowerCase();
          const byDateDesc = (a: ApiProduct, b: ApiProduct) => +new Date(b.createdAt) - +new Date(a.createdAt);

          const defs = [
            { label: 'New Drops', match: (_p: ApiProduct) => true, items: [...list].sort(byDateDesc) },
            { label: 'Inverter', match: (p: ApiProduct) => /inverter/.test(text(p)), items: list.filter((p) => /inverter/.test(text(p))) },
            { label: 'AIO Lithium', match: (p: ApiProduct) => /(lithium|battery)/.test(text(p)), items: list.filter((p) => /(lithium|battery)/.test(text(p))) },
            { label: 'AC Stabiliser', match: (p: ApiProduct) => /(stabiliser|stabilizer|voltage)/.test(text(p)), items: list.filter((p) => /(stabiliser|stabilizer|voltage)/.test(text(p))) },
          ];

          // Keep only non-empty categories
          const withData = defs.filter((d) => d.items.length > 0);
          const finalLabels = withData.map((d) => d.label);

          // Build cards flattened in category blocks; apiIndex must match label index
          const cards: CatalogCard[] = [];
          withData.forEach((d, idx) => {
            d.items.forEach((p) => {
              cards.push({
                id: p.id,
                card_title: p.name,
                card_image: p.imageUrl || '/placeholder.svg',
                product_image: p.imageUrl || null,
                apiIndex: idx,
              });
            });
          });

          if (cards.length) {
            setLabels(finalLabels);
            setAllCards(cards);
            setActiveApiIndex(0);
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        // fall through to fallback
      }

      // Fallback to demo catalogs
      const catalogs = (await fetchCatalogFallback()) as any[];
      const cards = Array.isArray(catalogs) ? (catalogs.flat() as CatalogCard[]) : [];
      setLabels(["New Drops", "Inverter", "AIO Lithium", "AC Stabiliser"]);
      setAllCards(cards);
      setLoading(false);
    };
    getData();
  }, []);

  // Use native horizontal scroll; no transform-based scrolling

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const idx = parseInt(el.dataset.apiIndex || "0", 10);
            setActiveApiIndex(isNaN(idx) ? 0 : idx);
          }
        });
      },
      { threshold: 0.7 } // Adjusted threshold to 50% visibility
    );

    const cardsElements = document.querySelectorAll('.card');
    cardsElements.forEach((card) => observer.observe(card));
    return () => cardsElements.forEach((card) => observer.unobserve(card));
  }, [allCards]);

  const handleScrollToCategory = (index: number) => {
    const cardElement = cardRefs.current.find((card: HTMLDivElement) => card?.dataset?.apiIndex == String(index));
    const container = containerRef.current;
    if (cardElement && container) {
      const containerWidth = container.clientWidth;
      const cardLeftOffset = cardElement.offsetLeft;
      const scrollLeft = Math.max(0, cardLeftOffset - containerWidth / 2 + cardElement.clientWidth / 2);
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
      setActiveApiIndex(index);
    }
  };

  return (
    <main className="w-screen max-w-none h-full flex items-center justify-center py-8 px-0 flex-col">
      <div className="flex flex-row justify-start items-center whitespace-nowrap overflow-x-auto w-full px-4 lg:px-8 gap-6">
        {labels.map((label, index) => (
          <button
            key={index}
            onClick={() => handleScrollToCategory(index)}
            className={`px-5 py-2 gap-15 rounded-full transition-all text-sm font-semibold whitespace-nowrap lg:px-10 ${
              activeApiIndex === index
                ? "bg-red-600 text-white"
                : "text-black hover:text-gray-600"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div ref={containerRef} className="relative w-full overflow-x-auto scroll-smooth">
        <div className="flex gap-6 w-max py-8 px-6">
          {loading && (
            <div className="text-gray-500">Loading catalogs…</div>
          )}
          {!loading && allCards.length === 0 && (
            <div className="text-gray-600">No items found. Check the <a className="underline" href="/api/catalogs">/api/catalogs</a> response and backend endpoints.</div>
          )}
          {!loading && allCards.length > 0 && allCards.map((card, index) => (
            <div
              key={`${card.id}-${card.card_title}-${index}`}
              data-api-index={card.apiIndex}
              className="relative w-[400px] h-[300px] rounded-xl bg-white shadow-lg overflow-hidden group card lg:gap-10"
              ref={(el) => { if (el) cardRefs.current[index] = el; }}
            >
              {/* Main Image: Render only if a valid URL exists */}
              <div className="relative w-full h-full bg-white">
                {card.card_image ? (
                  <Image
                    src={card.card_image}
                    alt={card.card_title}
                    fill
                    className="rounded-xl object-contain"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                ) : null}
              </div>

              {/* Small Product Image Overlay: Render only if product_image exists */}
              {card.product_image && (
                <div className="absolute bottom-3 right-3 w-20 h-14">
                  <Image
                    src={card.product_image || ""}
                    alt="Product"
                    width={80}
                    height={56}
                    className="rounded-md shadow-md object-contain"
                  />
                </div>
              )}

              {/* Title Section */}
              <div className="absolute bottom-0 left-0 w-full bg-white p-2">
                <p className="text-gray-800 font-semibold text-xl px-4 rounded-lg border-solid">
                  {card.card_title}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
