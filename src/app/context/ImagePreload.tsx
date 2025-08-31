"use client";

import { useEffect } from "react";
import { HOME_CAROUSEL_IMAGES, PRODUCT_CAROUSEL_IMAGES, NAV_LOGO_URL, FOOTER_LOGO_URL, HOME_PROMO_IMAGE_URL } from "@/lib/assets";

// Best-effort session preloader for Cloudinary and other remote images
// - Runs once per browser session (sessionStorage flag)
// - Warms cache for nav/footer logos, home & product carousels, and product images
export default function ImagePreload() {
  useEffect(() => {
    const KEY = "__img_preload_v2";
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(KEY)) return;

    const urls = new Set<string>(); // original sources
    const nextOptimized = new Set<string>(); // Next.js optimizer URLs for same-session instant loads

    const push = (u?: string | null) => {
      if (!u) return;
      // Only warm remote images; Next/Image already optimizes local assets
      try {
        const url = new URL(u, window.location.href);
        urls.add(url.href);
        // If this is a remote image that will be rendered via Next/Image, also warm the optimizer endpoint
        if (url.origin !== window.location.origin) {
          // Prefetch a few common widths so responsive sets hit cache
          const widths = [640, 1080, 1920];
          widths.forEach((w) => {
            const opt = new URL("/_next/image", window.location.origin);
            opt.searchParams.set("url", url.href);
            opt.searchParams.set("w", String(w));
            opt.searchParams.set("q", "75");
            nextOptimized.add(opt.href);
          });
        }
      } catch {
        // ignore invalid URLs
      }
    };

    // From centralized assets
    [NAV_LOGO_URL, FOOTER_LOGO_URL, HOME_PROMO_IMAGE_URL, ...HOME_CAROUSEL_IMAGES, ...PRODUCT_CAROUSEL_IMAGES].forEach(push);

    // Also fetch current products and warm their imageUrl for instant catalogue load
    (async () => {
      try {
        const res = await fetch("/api/products", { cache: "no-store" });
        if (res.ok) {
          const products: Array<{ imageUrl?: string | null }> = await res.json();
          products.forEach((p) => push(p.imageUrl ?? undefined));
        }
      } catch {
        // ignore network errors
      }

      // Try to include catalog card images from the proxy as well (card_image/product_image)
      try {
        const res2 = await fetch("/api/catalogs", { cache: "no-store" });
        if (res2.ok) {
          const json = await res2.json();
          const catalogs: any[][] = Array.isArray(json?.catalogs) ? json.catalogs : [];
          catalogs.flat().forEach((item: any) => {
            push(item?.card_image);
            push(item?.product_image);
          });
        }
      } catch {
        // ignore
      }

      // Now warm the browser cache. Prefer Cache Storage for same-session re-use; fallback to Image element.
      try {
        if ("caches" in window) {
          const cache = await caches.open("img-preload-v2");
          // Combine optimizer URLs (same-origin) and original URLs
          const toAdd = Array.from(new Set<string>([...nextOptimized, ...urls]));
          await Promise.all(
            toAdd.map(async (u) => {
              try {
                // Use no-cors so opaque responses (e.g., Cloudinary) can be cached
                const req = new Request(u, { mode: "no-cors", cache: "reload" });
                const res = await fetch(req);
                await cache.put(req, res);
              } catch {
                // ignore individual failures
              }
            })
          );
        } else {
          // Fallback: pre-create Image objects
          urls.forEach((u) => {
            const img = new Image();
            img.decoding = "async";
            (img as any).loading = "eager";
            img.src = u;
          });
        }
      } finally {
        sessionStorage.setItem(KEY, "1");
      }
    })();
  }, []);

  return null;
}
