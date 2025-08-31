"use client";

import { ABOUT_SECTION_IMAGE_URL } from "../../lib/assets";

export default function AboutYepso() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full px-4 sm:px-8 md:px-16 lg:px-24 py-12 gap-8">
      {/* About Us Card */}
      <div className="relative bg-white shadow-lg rounded-2xl p-8 h-full min-h-[413px] flex flex-col justify-between">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-medium text-black text-left mb-4">
          About Yepso
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-black leading-7 flex-1 mb-4">
          Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece
          of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, 
          a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure 
          Latin words, consectetur, from a Lorem Ipsum passage.
        </p>

        {/* Read More Link */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <a href="#" className="text-lg font-medium text-black group-hover:text-gray-700">
            Read More About our Journey
          </a>
          <span className="w-6 sm:w-10 text-black transition-transform transform group-hover:scale-x-125">→</span>
        </div>
      </div>

      {/* Image Section (single Cloudinary-configurable image) */}
      <div className="flex justify-center items-center bg-white shadow-lg rounded-2xl p-6 h-full min-h-[413px] overflow-hidden">
        <img
          src={ABOUT_SECTION_IMAGE_URL}
          alt="About Yepso products"
          className="object-contain h-auto w-auto max-w-full"
          loading="lazy"
          decoding="async"
        />
      </div>
    </div>
  );
}
