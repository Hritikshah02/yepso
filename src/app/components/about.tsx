"use client";

import { ABOUT_SECTION_IMAGE_URL } from "../../lib/assets";

export default function AboutYepso() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full px-4 sm:px-8 md:px-16 lg:px-24 pt-12 pb-4 sm:pb-6 gap-8">
      {/* About Us Card */}
      <div className="relative bg-white shadow-lg rounded-2xl p-8 h-full min-h-[413px] flex flex-col transition-transform duration-300 ease-out will-change-transform hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-0.5 motion-reduce:transform-none cursor-pointer">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-medium text-black text-left mb-4">
          About Yepso
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg text-black leading-7">
        The Company has started its journey in 2015, with the vision
of making smart energy saving products. With that aspect R&D facility
was established in the year 2015.
In its endeavour to reach every corner of the country Yepsois
equipped with the vast network of Distributors, Direct
Dealers and Retailers. Now, Yepso has established
as a strong Brand in the Indian electrical and
electronic goods market.
After a long research company has developed
Lithium lon Battery Pack, wide range of inverters,
Smart Hybrid Voltage Stabilizers, Solar Services.
We have number of models for Schools, Hospitals,Petrol Pumps and Offices.
        </p>
      </div>

      {/* Image Section (single Cloudinary-configurable image) */}
      <div className="flex justify-center items-center bg-white shadow-lg rounded-2xl p-6 h-full min-h-[413px] overflow-hidden transition-transform duration-300 ease-out will-change-transform hover:scale-[1.02] hover:shadow-2xl hover:-translate-y-0.5 motion-reduce:transform-none cursor-pointer">
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
