"use client";

import Image from "next/image";
import Link from "next/link";
import QuantityControls from "../products/components/QuantityControls";
import "@fortawesome/fontawesome-free/css/all.min.css";

// TODO: Replace these with your actual Cloudinary URLs for the product images
const specialProducts = [
  {
    id: 1,
    title: "3 in 1 Hybrid Inverter",
    // Image shows: White and yellow solar inverter with digital display showing "280"
    image: "https://res.cloudinary.com/dkxflu8nz/image/upload/v1757260144/HYBRID_inverter_3_in_1_trending_kbojos.jpg",
    slug: "3-in-1-inverter"
  },
  {
    id: 2,
    title: "All in One Lithium Battery System",
    // Image shows: White and black lithium battery unit with blue digital display showing "230"
    image: "https://res.cloudinary.com/dkxflu8nz/image/upload/v1757260143/all_in_one_trending_product_kyhvag.jpg",
    slug: "all-in-one-lithium-battery"
  }
];

export default function SpecialProducts() {
  return (
    <section className="w-full px-4 sm:px-6 md:px-12 lg:px-16 py-12 bg-gray-50">
      {/* Section Header */}
      <div className="mb-8">
        <h2 className="text-4xl md:text-5xl font-bold text-black mb-2 inline-block">
          Special Products
          <div className="h-1 w-3/4 bg-red-600 mt-2"></div>
        </h2>
        {/* <p className="text-gray-600 text-base md:text-lg mt-4">
          At this part we will highlight our
        </p> */}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {specialProducts.map((product) => (
          <div
            key={product.id}
            className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
          >
            {/* Product Image */}
            <div className="relative w-full h-64 bg-gray-100">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-300 transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />

              {/* Hover Overlay with Quick View and Add to Cart */}
              <div className="absolute inset-0 hidden sm:flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 bg-black/30 duration-500">
                {/* Quick View Button */}
                <Link 
                  href={`/products/${product.slug}`} 
                  className="relative flex items-center justify-center w-44 h-11 bg-white text-black rounded-full mx-2 mb-2 transition-all duration-300 hover:bg-gray-800 hover:text-white group/button"
                >
                  <span className="group-hover/button:opacity-0 transition-opacity duration-200">
                    Quick View
                  </span>
                  <i className="fa-solid fa-eye absolute opacity-0 group-hover/button:opacity-100 transition-opacity duration-200"></i>
                </Link>

                {/* Add to Cart / Quantity Controls */}
                <div className="relative flex items-center justify-center mx-2 mt-2">
                  <QuantityControls slug={product.slug} title={product.title} />
                </div>
              </div>
            </div>

            {/* Product Title */}
            <div className="p-6 bg-white border-t border-gray-200">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                {product.title}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* BLDC Ceiling Fans Section */}
      <div className="mt-12 max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer">
          {/* Text Content - Left Side */}
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">
              BLDC Ceiling Fans
            </h3>
            <p className="text-gray-600 text-base md:text-lg">
              Energy-efficient and powerful ceiling fans for your home
            </p>
          </div>
          
          {/* Image Placeholder - Right Side */}
          <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center">
            <Image
              src="https://res.cloudinary.com/dkxflu8nz/image/upload/v1759320097/IMG_2524_n9p9ed.png"
              alt="BLDC Ceiling Fans"
              fill
              className="object-inherit"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
