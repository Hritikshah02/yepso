'use client';
import { useState } from 'react';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import Image1 from "../../../public/Static/Image/image1.png";
import Image2 from "../../../public/Static/Image/image2.png";
import Image3 from "../../../public/Static/Image/image3.png";
import Image4 from "../../../public/Static/Image/image4.png";

const categories = [
  { id: 'new-drops', label: 'New Drops' },
  { id: 'inverter', label: 'Inverter' },
  { id: 'aio-lithium', label: 'AIO Lithium' },
  { id: 'ac-stabiliser', label: 'Ac Stabiliser' },
] as const;

type CategoryId = typeof categories[number]['id'];
type ProductCard = { image: StaticImageData; title: string };

const products: Record<CategoryId, ProductCard[]> = {
  'new-drops': [
    { image: Image1, title: 'Solar Inverter' },
    { image: Image2, title: 'AC St' },
    { image: Image3, title: 'AC St' },
  ],
  inverter: [],
  'aio-lithium': [],
  'ac-stabiliser': [],
};

export default function ProductShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('new-drops');

  return (
    <div className="flex flex-col items-center w-full p-4">
      {/* Buttons */}
      <div className="flex space-x-4 mb-6">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`px-4 py-2 rounded-full text-black font-semibold ${
              selectedCategory === category.id ? 'bg-red-500 text-white' : 'bg-gray-200'
            }`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
        {products[selectedCategory].map((product, index) => (
          <div key={index} className="relative bg-white rounded-lg shadow-lg overflow-hidden">
            <Image
              src={product.image}
              alt={product.title}
              width={400}
              height={250}
              className="w-full h-48 object-cover"
            />
            <div className="absolute bottom-2 left-2 bg-white p-2 rounded-md shadow-md text-black font-bold">
              {product.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
