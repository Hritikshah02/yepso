'use client'
import { useState } from "react";
import ProductCardDetailed from "./productcarddetailed"; // Import the reusable component

// Tabs Names (Custom Names)
const tabNames = {
  latest: "Latest Products",
  popular: "Most Popular",
  reviewed: "Most Reviewed",
};

// Tabs Component
const Tabs = ({ tabs, selectedTab, onTabClick }) => (
  <div className="flex space-x-6 text-gray-500 font-semibold text-2xl gap-5">
    {tabs.map((tab) => (
      <span
        key={tab}
        className={`cursor-pointer ${selectedTab === tab ? "text-black border-b-2 border-black pb-1" : ""}`}
        onClick={() => onTabClick(tab)}
      >
        {tabNames[tab]} {/* Use custom tab names */}
      </span>
    ))}
  </div>
);

// ProductCatalogue Component
const ProductCatalogue = ({ tabs, products, useDetailedCards }) => {
  const [selectedTab, setSelectedTab] = useState(tabs[0]); // Default to the first tab

  // Function to handle tab click
  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  // Render products based on selected tab
  const renderProducts = () => {
    return products[selectedTab]?.map((product, index) => (
      useDetailedCards ? (
        <ProductCardDetailed key={index} {...product} /> // Use the reusable ProductCardDetailed
      ) : (
        <ProductCard key={index} image={product.image} title={product.title} />
      )
    ));
  };

  return (
    <div className="px-4 sm:px-6 md:px-12 py-10">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 border-b pb-4">
        <h2 className="text-5xl font-bold text-black">Catalogue<div className="w-[60%] h-[3px] bg-red-600 mt-4"></div></h2>
        <Tabs tabs={tabs} selectedTab={selectedTab} onTabClick={handleTabClick} />
        <button className="border-[1px] border-black px-4 py-2 flex items-center gap-2">
          All Products →
        </button>
      </div>

      <div className="flex flex-wrap justify-center items-center gap-7 mt-6">
        {renderProducts()}
      </div>
    </div>
  );
};

// Sample data (same as before)
const products = {
  latest: [
    { image: "/Static/Image/about2.png", discount: "-30%", title: "Smart Inverter", reviews: "4", price: "20000", timer: "255d : 45h : 44m : 52s" },
    { image: "/Static/Image/about2.png", discount: "-20%", title: "Smart Fan", reviews: "5", price: "15000", timer: "125d : 23h : 14m : 10s" },
    { image: "/Static/Image/about2.png", discount: "-10%", title: "LED Bulb", reviews: "3", price: "500", timer: "15d : 12h : 30m : 5s" },
  ],
  popular: [
    { image: "/Static/Image/about2.png", discount: "-50%", title: "Air Conditioner", reviews: "500", price: "50000", timer: "365d : 10h : 12m : 30s" },
    { image: "/Static/Image/about2.png", discount: "-40%", title: "Washing Machine", reviews: "420", price: "30000", timer: "200d : 12h : 14m : 50s" },
    { image: "/Static/Image/about2.png", discount: "-30%", title: "Refrigerator", reviews: "380", price: "25000", timer: "120d : 5h : 30m : 5s" },
  ],
  reviewed: [
    { image: "/Static/Image/about2.png", discount: "-25%", title: "Laptop", reviews: "1000", price: "60000", timer: "45d : 18h : 30m : 15s" },
    { image: "/Static/Image/about2.png", discount: "-15%", title: "Smartphone", reviews: "900", price: "30000", timer: "75d : 20h : 25m : 30s" },
    { image: "/Static/Image/about2.png", discount: "-10%", title: "Smart Watch", reviews: "600", price: "12000", timer: "35d : 12h : 10m : 45s" },
  ],
};

// Tabs options
const tabs = ["latest", "popular", "reviewed"];

export default function App() {
  return (
    <div>
         <ProductCatalogue tabs={tabs} products={products} useDetailedCards={true} />
    </div>
  );
}
