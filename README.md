This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Cloudinary Setup (Images)

This project uses Cloudinary for product image hosting and uploads.

### 1) Environment variables (.env.local)

Create a `.env.local` at the project root:

```ini
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
- `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET`: An unsigned upload preset

You can copy from `.env.local.example`.

### 2) Create an unsigned upload preset

- Cloudinary Dashboard → Settings → Upload → Add upload preset
- Set as "Unsigned"
- Optionally restrict allowed formats (e.g., jpg, png, webp)

### 3) Next.js image configuration

`next.config.ts` already allows Cloudinary images via `res.cloudinary.com` in `images.remotePatterns`.

### 4) Admin dashboard uploader

- Go to `/admin`
- Use the uploader to select an image; it uploads to Cloudinary and stores `secure_url` as the product image URL

### 5) Seed data

- Default product images use Cloudinary demo URLs so images work out-of-the-box.

### Notes

- Unsigned uploads are convenient but less secure. Consider signed uploads or stricter presets in production.
- If images don't render, verify the URL is HTTPS and `res.cloudinary.com` is allowed in `next.config.ts`.
