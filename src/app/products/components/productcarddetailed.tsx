"use client";
import Image from "next/image";
import Link from 'next/link'
import { useMemo, useState } from "react";
import { useCart } from "../../context/CartContext";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome
import QuantityControls from "./QuantityControls";
import type { StaticImageData } from "next/image";
import { useRouter } from 'next/navigation';

type Props = { image: string | StaticImageData; hoverImage?: string | StaticImageData; discount?: string; title: string; reviews: string; price: number; timer: string; slug?: string; discountPercent?: number | null }

const ProductCardDetailed = ({ image, hoverImage, discount, title, reviews, price, timer, slug: slugProp, discountPercent }: Props) => {
  const { addToCart, updateQuantity, items } = useCart();
  const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const slug = useMemo(() => slugProp || toSlug(title), [slugProp, title])
  const pct = typeof discountPercent === 'number' ? discountPercent : 0
  const hasDiscount = pct > 0
  const originalPrice = hasDiscount && (1 - pct / 100) > 0 ? Math.round(price / (1 - pct / 100)) : null
  const router = useRouter();
  return (
    <div
      className="group relative shadow-lg rounded-xl bg-white mx-auto w-full h-full overflow-hidden"
      onClick={(e) => {
        // On small screens, tap anywhere on the card navigates to product page
        if (typeof window !== 'undefined' && window.innerWidth < 640) {
          e.preventDefault();
          e.stopPropagation();
          router.push(`/products/${slug}`);
        }
      }}
    >
      <div className="relative h-64 sm:h-72 md:h-80 bg-gradient-to-tr from-white via-red-50 to-white">
        {/* Main Image */}
        {image && (
          <Image
            src={image}
            alt={title}
            fill
            sizes="(max-width: 1200px) 33vw, 400px"
            className="object-contain p-4 sm:p-6 transition-transform duration-300 transform group-hover:scale-105"
          />
        )}

        {/* Hover Image */}
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={title}
            fill
            sizes="(max-width: 1200px) 33vw, 400px"
            className="absolute inset-0 object-contain p-4 sm:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {discount && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-sm pb-1 rounded px-4">
            {discount}
          </span>
        )}

        {/* Buttons (hidden below sm; appear on hover for >= sm) */}
        <div className="absolute inset-0 hidden sm:flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 bg-black/30 duration-500">
          {/* Quick View Button */}
          <Link href={`/products/${slug}`} className="relative flex items-center justify-center w-44 h-11 bg-white text-black rounded-full mx-2 mb-2 transition-all duration-300 hover:bg-gray-800 hover:text-white group/button">
            <span className="group-hover/button:opacity-0 transition-opacity duration-200">
              Quick View
            </span>
            <i className="fa-solid fa-eye absolute opacity-0 group-hover/button:opacity-100 transition-opacity duration-200"></i>
          </Link>

          {/* Add to Cart / Quantity Controls */}
          <div className="relative flex items-center justify-center mx-2 mt-2">
            <QuantityControls slug={slug} title={title} />
          </div>
        </div>
      </div>

      <div className="border-t-[3px] border-b-[3px] border-red-600 text-base md:text-lg font-medium px-4 py-2">
        SALES END IN: {timer}
      </div>
      <p className="text-gray-500 text-xs sm:text-sm mt-2 px-4">
        ⭐ ⭐ ⭐ ⭐ ⭐ ({reviews} Reviews)
      </p>
      <h3 className="text-base sm:text-xl md:text-2xl font-semibold px-4">{title}</h3>
      <div className="flex items-center justify-between px-4 pb-3">
        <p className="text-red-600 font-bold text-sm sm:text-lg md:text-xl">
          {hasDiscount && originalPrice ? (
            <>
              <span className="line-through text-gray-400 mr-2">Rs {originalPrice}</span>
              Rs {price}
            </>
          ) : (
            <>Rs {price}</>
          )}
        </p>
        {discount && (
          <span className="bg-red-600/10 text-red-700 text-xs md:text-sm font-semibold rounded px-2 py-1">
            {discount}
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductCardDetailed;
