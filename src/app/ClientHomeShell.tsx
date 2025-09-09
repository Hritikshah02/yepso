"use client";

import { useEffect, useRef, useState } from "react";
import Carousel from "./components/crousal";
import VoltageEngineer from "./components/section2";
import AboutYepso from "./components/about";
import Cards from "./components/Card_copy";
import { HOME_CAROUSEL_IMAGES, HOME_PROMO_IMAGE_URL } from "../lib/assets";

export default function ClientHomeShell() {
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [show, setShow] = useState(false);
  const mountStartRef = useRef<number>(Date.now());

  // Preload first hero image to avoid revealing before it's ready
  useEffect(() => {
    const first = HOME_CAROUSEL_IMAGES?.[0];
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
        <Carousel
          images={HOME_CAROUSEL_IMAGES}
          autoplayDelay={5000}
          slidesPerView={1}
          spaceBetween={30}
          objectFit="fill"
        />
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
