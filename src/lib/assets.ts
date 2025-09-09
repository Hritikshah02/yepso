// Centralized assets with Cloudinary support via env vars
// Provide env overrides for production Cloudinary URLs; fall back to local public assets

export const FOOTER_LOGO_URL =
  process.env.NEXT_PUBLIC_FOOTER_LOGO_URL || 
  "/Static/Logo/image.png";

export const NAV_LOGO_URL =
  process.env.NEXT_PUBLIC_NAV_LOGO_URL ||
  "/Static/Logo/image.png";

const DISABLE_TOKENS = new Set(["none", "off", "false", "0", "disable", "disabled", "-"]);

function isDisabled(val?: string | null): boolean {
  if (val == null) return false;
  const v = String(val).trim().toLowerCase();
  return DISABLE_TOKENS.has(v) || v === "";
}

export const HOME_PROMO_IMAGE_URL = (() => {
  const raw = process.env.NEXT_PUBLIC_HOME_PROMO_IMAGE_URL;
  if (isDisabled(raw)) return ""; // disabled explicitly
  return (
    raw ||
    "https://res.cloudinary.com/dkxflu8nz/image/upload/v1756184944/families_hbmps8.jpg"
  );
})();

export const ABOUT_SECTION_IMAGE_URL =
  "https://res.cloudinary.com/dkxflu8nz/image/upload/v1757250300/IMG_2009_qd2dq6.jpg";

function envList(name: string): string[] {
  const raw = process.env[name];
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

// Use this for NEXT_PUBLIC_* variables so that Next.js can inline values at build/dev time.
function splitList(val?: string | null): string[] {
  if (!val) return [];
  return String(val).split(',').map((s) => s.trim()).filter(Boolean);
}

export const HOME_CAROUSEL_IMAGES: string[] = (() => {
  const raw = process.env.NEXT_PUBLIC_HOME_CAROUSEL;
  if (isDisabled(raw)) return [];
  const fromEnv = splitList(process.env.NEXT_PUBLIC_HOME_CAROUSEL);
  // If the env var is defined but parses to empty, treat as disabled
  if (raw !== undefined && fromEnv.length === 0) return [];
  // Base images from env or default list
  const base = fromEnv.length ? fromEnv : [
    "https://res.cloudinary.com/dkxflu8nz/image/upload/v1757250300/IMG_2009_qd2dq6.jpg",
    "https://res.cloudinary.com/dkxflu8nz/image/upload/v1757250300/cover1_knkqqh.jpg",
    "https://res.cloudinary.com/dkxflu8nz/image/upload/v1757250300/cover2_l4csri.jpg",
  ];
  // Optional exclusion: comma-separated tokens matched as substrings
  const excludeTokens = splitList(process.env.NEXT_PUBLIC_HOME_CAROUSEL_EXCLUDE).map((t) => t.toLowerCase());
  if (excludeTokens.length === 0) return base;
  return base.filter((url) => !excludeTokens.some((tok) => url.toLowerCase().includes(tok)));
})();

export const PRODUCT_CAROUSEL_IMAGES: string[] = (() => {
  const raw = process.env.NEXT_PUBLIC_PRODUCT_CAROUSEL;
  const fromEnv = splitList(process.env.NEXT_PUBLIC_PRODUCT_CAROUSEL);
  const base = fromEnv.length ? fromEnv : [
    "/Static/Crousal/product/slide-1.jpg",
    "/Static/Crousal/product/slide-2.jpg",
    "/Static/Crousal/product/slide-3.png",
  ];
  const excludeTokens = splitList(process.env.NEXT_PUBLIC_PRODUCT_CAROUSEL_EXCLUDE).map((t) => t.toLowerCase());
  if (excludeTokens.length === 0) return base;
  return base.filter((url) => !excludeTokens.some((tok) => url.toLowerCase().includes(tok)));
})();
