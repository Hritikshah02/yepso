'use client'
import { useEffect, useState } from 'react';

const PromoBanner = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size for mobile (<= 768px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-red-600 py-2 text-center font-semibold relative w-full overflow-x-hidden animate-slide-down-fade anim-delay-100 will-change">
      <div
        className={`flex justify-evenly items-center whitespace-nowrap overflow-x-hidden ${
          isMobile ? 'marquee animate-marquee ' : ''
        }`}
      >
        <span className="mr-6 flex-c justify-evenly items-center">
          Use COUPONXX to Get Flat ₹5000 off on your Order!
        </span>
        <span><i className="fa-solid fa-phone mr-4"></i>Customer Care: +91-xxxxOOOOOx / xxxxOOOOOO</span>
        <span> <i className="fa-solid fa-phone mr-4"></i>Toll Free Number - 1800-xxx-1111</span>
      </div>

      {/* Tailwind CSS Marquee Animation */}
      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-marquee {
          animation: marquee 10s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PromoBanner;
