"use client";
import Image from "next/image";
import type { StaticImageData } from "next/image";

interface ProductCardProps {
  image: string | StaticImageData;
  title: string;
}

const ProductCardCatalog: React.FC<ProductCardProps> = ({ image, title }) => (
  <div className="bg-white shadow-lg rounded-xl p-4 sm:p-5 flex flex-col items-center">
    <div className="relative w-full aspect-square">
      <Image
        src={image}
        alt={title}
        fill
        sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 200px"
        className="object-contain"
      />
    </div>
    <h1 className="mt-2 font-medium text-black text-sm sm:text-base text-center w-full truncate">{title}</h1>
  </div>
);
//this is for card of Shop by Categoriey
export default ProductCardCatalog;

