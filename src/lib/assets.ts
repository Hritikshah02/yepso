// Centralized assets with Cloudinary support via env vars
// Provide env overrides for production Cloudinary URLs; fall back to local public assets

export const FOOTER_LOGO_URL =
  process.env.NEXT_PUBLIC_FOOTER_LOGO_URL || 
  "/Static/Logo/image.png";

export const NAV_LOGO_URL =
  process.env.NEXT_PUBLIC_NAV_LOGO_URL ||
  "/Static/Logo/image.png";

export const HOME_PROMO_IMAGE_URL =
  process.env.NEXT_PUBLIC_HOME_PROMO_IMAGE_URL ||
  "https://res.cloudinary.com/dkxflu8nz/image/upload/v1756184944/families_hbmps8.jpg";

export const ABOUT_SECTION_IMAGE_URL =
  "https://res.cloudinary.com/dkxflu8nz/image/upload/v1756616623/All_product_png_lnxt1t.png";

function envList(name: string): string[] {
  const raw = process.env[name];
  if (!raw) return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

export const HOME_CAROUSEL_IMAGES: string[] = (() => {
  const fromEnv = envList("NEXT_PUBLIC_HOME_CAROUSEL");
  if (fromEnv.length) return fromEnv;
  return [
    "https://res.cloudinary.com/dkxflu8nz/image/upload/v1756722723/stage_fdmjr4.jpg",
    "https://res.cloudinary.com/dkxflu8nz/image/upload/v1756722729/website_iztjny.jpg",
    "https://res.cloudinary.com/dkxflu8nz/image/upload/v1756722724/website_1_dforku.jpg",
  ];
})();

export const PRODUCT_CAROUSEL_IMAGES: string[] = (() => {
  const fromEnv = envList("NEXT_PUBLIC_PRODUCT_CAROUSEL");
  if (fromEnv.length) return fromEnv;
  return [
    "/Static/Crousal/product/slide-1.jpg",
    "/Static/Crousal/product/slide-2.jpg",
    "/Static/Crousal/product/slide-3.png",
  ];
})();
