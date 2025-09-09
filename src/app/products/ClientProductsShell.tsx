"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
const Carousel = dynamic(() => import("../components/crousal"), { ssr: false });
import { PRODUCT_CAROUSEL_IMAGES } from "../../lib/assets";
import Categories from "./components/catagory";
import ProductCatalogue from "./components/product";
import { Suspense } from "react";

export default function ClientProductsShell() {
  const [catLoaded, setCatLoaded] = useState(false);
  const [catalogueLoaded, setCatalogueLoaded] = useState(false);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [show, setShow] = useState(false);
  const mountStartRef = useRef<number>(Date.now());
  const failSafeRef = useRef<number | null>(null);

  // Ensure we start at the top on navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  // Preload first hero image so we don't reveal before it paints
  useEffect(() => {
    const first = PRODUCT_CAROUSEL_IMAGES?.[0];
    if (!first) { setHeroLoaded(true); return; }
    const img = new Image();
    const done = () => setHeroLoaded(true);
    img.onload = done;
    img.onerror = done;
    img.src = first;
    return () => { img.onload = null; img.onerror = null; };
  }, []);

  // Ensure a minimum loader time from mount to avoid flicker (e.g., 600ms)
  useEffect(() => {
    if (catLoaded && catalogueLoaded && heroLoaded) {
      const elapsed = Date.now() - mountStartRef.current;
      const remaining = Math.max(0, 600 - elapsed);
      const id = window.setTimeout(() => setShow(true), remaining);
      return () => window.clearTimeout(id);
    }
  }, [catLoaded, catalogueLoaded, heroLoaded]);

  // Failsafe: never show an infinite loader. Reveal after 4s max.
  useEffect(() => {
    if (show) return;
    const id = window.setTimeout(() => setShow(true), 4000);
    failSafeRef.current = id as unknown as number;
    return () => { if (failSafeRef.current) window.clearTimeout(failSafeRef.current); };
  }, [show]);

  return (
    <div className="bg-[#F8F8F8] min-h-screen relative">
      {/* Cover slider or top loader placeholder */}
      <div className="px-0">
        {show ? (
          <Carousel
            images={PRODUCT_CAROUSEL_IMAGES}
            autoplayDelay={5000}
            slidesPerView={1}
            spaceBetween={30}
            objectFit="cover"
          />
        ) : (
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-white">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 rounded-full border-2 border-gray-300 border-t-red-600 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={show ? "opacity-100" : "opacity-0"}>
        <Categories onLoaded={() => setCatLoaded(true)} />
        <Suspense fallback={null}>
          <ProductCatalogue onLoaded={() => setCatalogueLoaded(true)} />
        </Suspense>
      </div>

      {/* No full-screen overlay; loader is confined to the hero area above */}
    </div>
  );
}
