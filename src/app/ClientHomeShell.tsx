"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
const Carousel = dynamic(() => import("./components/crousal"), { ssr: false });
import VoltageEngineer from "./components/section2";
import AboutYepso from "./components/about";
import Cards from "./components/Card_copy";
import { HOME_CAROUSEL_IMAGES, HOME_PROMO_IMAGE_URL } from "../lib/assets";

export default function ClientHomeShell() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [show, setShow] = useState(false);
  const mountStartRef = useRef<number>(Date.now());

  // Ensure we start at the top on navigation
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, []);

  // Derive filtered images at runtime as a safeguard during dev HMR
  const filteredImages = (() => {
    const tokens = (process.env.NEXT_PUBLIC_HOME_CAROUSEL_EXCLUDE || "")
      .toLowerCase()
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (!tokens.length) return HOME_CAROUSEL_IMAGES;
    return HOME_CAROUSEL_IMAGES.filter((u) => !tokens.some((t) => u.toLowerCase().includes(t)));
  })();

  // Preload first hero image to avoid revealing before it's ready
  useEffect(() => {
    const first = filteredImages?.[0];
    if (!first) { setHeroLoaded(true); return; }
    const img = new Image();
    const done = () => setHeroLoaded(true);
    img.onload = done;
    img.onerror = done;
    img.src = first;
    return () => { img.onload = null; img.onerror = null; };
  }, []);

  // Ensure a minimum loader time (e.g., 600ms) to avoid flicker
  useEffect(() => {
    if (heroLoaded) {
      const elapsed = Date.now() - mountStartRef.current;
      const remaining = Math.max(0, 600 - elapsed);
      const id = window.setTimeout(() => setShow(true), remaining);
      return () => window.clearTimeout(id);
    }
  }, [heroLoaded]);

  return (
    <div className="bg-white min-h-screen relative">
      {/* Hero carousel */}
      <div>
        {show ? (
          <Carousel
            images={filteredImages}
            autoplayDelay={5000}
            slidesPerView={1}
            spaceBetween={30}
            objectFit="fill"
          />
        ) : (
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-white">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-10 w-10 rounded-full border-2 border-gray-300 border-t-red-600 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Page content */}
      <div className={show ? "opacity-100" : "opacity-0"}>
        <VoltageEngineer />
        <Cards />
        <AboutYepso />
        {/* Bottom promo photo (render only if configured) */}
        {HOME_PROMO_IMAGE_URL ? (
          <div className="px-4 sm:px-6 md:px-12 mt-4 sm:mt-6">
            <img
              src={HOME_PROMO_IMAGE_URL}
              alt="Family using Yepso products at home"
              className="block mx-auto w-[88%] sm:w-[82%] md:w-[75%] lg:w-[70%] h-auto rounded-2xl shadow-xl ring-1 ring-black/5"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : null}
        {/* Tagline */}
        <section className="px-4 sm:px-6 md:px-12 mt-3 sm:mt-5 mb-6">
          <div className="mx-auto max-w-5xl text-center">
            <p className="text-black font-bold uppercase tracking-wide text-[clamp(1.2rem,3.8vw,2.4rem)] leading-tight lg:leading-none lg:whitespace-nowrap">
              YOUR TRUSTED VOLTAGE ENGINEER
            </p>
            <p className="mt-1 text-gray-700 tracking-wide text-[clamp(0.78rem,2.2vw,0.95rem)]">
              TRUSTED BY 10K+ CUSTOMERS
            </p>
          </div>
        </section>
      </div>

      {/* Loader confined to hero above; no full-screen overlay */}
    </div>
  );
}
