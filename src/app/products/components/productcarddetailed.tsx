"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useCart } from "../../context/CartContext";
import "@fortawesome/fontawesome-free/css/all.min.css"; // Import Font Awesome
import QuantityControls from "./QuantityControls";

type Props = { image: string; hoverImage?: string; discount?: string; title: string; reviews: string; price: string; timer: string }

const ProductCardDetailed = ({ image, hoverImage, discount, title, reviews, price, timer }: Props) => {
  const { addToCart, updateQuantity, items } = useCart();
  const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const slug = useMemo(() => toSlug(title), [title])
  return (
    <div className="group relative shadow-lg mx-auto max-w-[394px] max-h-[447px] gap-5">
      <div className="relative bg-[#EDEDED]">
        {/* Main Image */}
        {image && (
          <Image
            src={image}
            alt={title}
            width={280}
            height={280}
            className="rounded-lg mx-auto transition-transform duration-300 transform group-hover:scale-105"
          />
        )}

        {/* Hover Image */}
        {hoverImage && (
          <Image
            src={hoverImage}
            alt={title}
            width={280}
            height={280}
            className="absolute inset-0 rounded-lg mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {discount && (
          <span className="absolute top-2 right-2 bg-red-600 text-white text-sm pb-1 rounded px-4">
            {discount}
          </span>
        )}

        {/* Buttons (hidden by default and appear on hover) */}
        <div className="absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 bg-black/40 duration-500">
          {/* Quick View Button */}
          <button className="relative flex items-center justify-center w-40 h-10 bg-white text-black rounded-full mx-2 mb-2 transition-all duration-300 hover:bg-gray-800 hover:text-white group/button">
            <span className="group-hover/button:opacity-0 transition-opacity duration-200">
              Quick View
            </span>
            <i className="fa-solid fa-eye absolute opacity-0 group-hover/button:opacity-100 transition-opacity duration-200"></i>
          </button>

          {/* Add to Cart / Quantity Controls */}
          <div className="relative flex items-center justify-center mx-2 mt-2">
            <QuantityControls slug={slug} title={title} />
          </div>
        </div>
      </div>

      <div className="border-t-[3px] border-b-[3px] border-red-600 text-lg font-medium px-4 py-2 lg:text-xl">
        SALES END IN: {timer}
      </div>
      <p className="text-gray-500 text-sm mt-2 px-4">
        ⭐ ⭐ ⭐ ⭐ ⭐ ({reviews} Reviews)
      </p>
      <h3 className="text-xl font-semibold px-4">{title}</h3>
      <p className="text-red-600 font-bold px-4 pb-2">Rs {price}</p>
    </div>
  );
};

export default ProductCardDetailed;
