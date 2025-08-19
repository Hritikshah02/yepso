'use client'
import { useState, useEffect } from 'react';
import Image from 'next/image';

const product = {
  name: 'Solar Inverter Model XYZ',
  price: 15000,
  originalPrice: 20000,
  discount: 30,
  images: [
    '/Static/Image/about1.png',
    '/Static/Image/about2.png',
    '/Static/Image/about3.png',
    '/Static/Image/about1.png',
  ],
  features: [
    'Pure Sine Wave',
    'True MPPT',
    'Wall Mount Design',
    'Fast Charging',
    'Advanced DSP Technology',
  ],
  tabs: {
    Description: 'Inverter Pure Sine Wave delivers outstanding performance for back-up power and off-grid systems.',
    Shipping: 'Fast and secure shipping within 3-5 business days.',
    FAQ: 'Common questions and answers about the product.',
    Review: '4.0 (4 Reviews)',
    Specifications: 'Input Voltage: 12V, Output: 220V, Efficiency: 95%+',
  },
} as const;

type TabKey = keyof typeof product.tabs;

export default function ProductPage() {
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<TabKey>('Description');
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    if (isInteracting) return;

    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % product.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isInteracting]);

  return (
    <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Image Section */}
      <div>
        <div 
          className="relative w-full aspect-video"
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => setIsInteracting(false)}
        >
          <Image
            src={product.images[activeImage]}
            alt={product.name}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex mt-4 gap-4">
          {product.images.map((img, index) => (
            <button key={index} onClick={() => { setActiveImage(index); setIsInteracting(true); }}>
              <div className="w-20 h-20 relative border rounded-lg overflow-hidden">
                <Image src={img} alt={product.name} fill className="object-cover" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Product Info Section */}
      <div>
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-xl text-red-500">Rs {product.price} <span className="line-through text-gray-400">Rs {product.originalPrice}</span></p>
        <span className="bg-red-500 text-white px-3 py-1 rounded-full">-{product.discount}%</span>

        <p className="mt-4 text-gray-600">{product.tabs.Description.slice(0, 150)}...</p>

        {/* Add to Cart Section */}
        <div className="mt-6 flex items-center gap-4">
          <button className="bg-black text-white px-6 py-2 rounded-lg">Add to Cart</button>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          {product.features.map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="flex gap-6 border-b">
            {(Object.keys(product.tabs) as TabKey[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 ${activeTab === tab ? 'border-b-2 border-black' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="mt-4 text-gray-700">{product.tabs[activeTab]}</div>
        </div>
      </div>
    </div>
  );
}
