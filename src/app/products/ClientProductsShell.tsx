"use client";

import { useEffect, useRef, useState } from "react";
import Carousel from "../components/crousal";
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

  return (
    <div className="bg-[#F8F8F8] min-h-screen relative">
      {/* Cover slider */}
      <div className="px-0">
        <Carousel
          images={PRODUCT_CAROUSEL_IMAGES}
          autoplayDelay={5000}
          slidesPerView={1}
          spaceBetween={30}
          objectFit="cover"
        />
      </div>

      {/* Content */}
      <div className={show ? "opacity-100" : "opacity-0"}>
        <Categories onLoaded={() => setCatLoaded(true)} />
        <Suspense fallback={null}>
          <ProductCatalogue onLoaded={() => setCatalogueLoaded(true)} />
        </Suspense>
      </div>

      {/* Fullscreen clean loader overlay */}
      {!show && (
        <div className="fixed inset-0 z-[1100] bg-white/95 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 rounded-full border-2 border-gray-300 border-t-red-600 animate-spin" />
            <div className="text-sm text-gray-600">Loading…</div>
          </div>
        </div>
      )}
    </div>
  );
}
