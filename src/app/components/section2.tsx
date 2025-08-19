'use client';
import { useState, useEffect } from 'react';
import textBanner from '../../../public/Static/Image/text2background.png';
import Image from 'next/image';

export default function VoltageEngineer() {
  const [hasScrolled, setHasScrolled] = useState(false);
  const [highlighted, setHighlighted] = useState(false); // Track if highlight effect is applied
  const [textColorWhite, setTextColorWhite] = useState(false); // Track if text color should be white

  useEffect(() => {
    const handleScroll = () => {
      const textElement = document.getElementById('highlightText');
      if (!textElement) return; // guard against null
      const bounding = textElement.getBoundingClientRect();

      // Check if the element is in view
      if (bounding.top < window.innerHeight && bounding.bottom >= 0) {
        // Apply highlight effect and delay text color change
        if (!highlighted) {
          setHighlighted(true);
          setTimeout(() => {
            setTextColorWhite(true); // Change text color to white after highlight
          }, 300); // Set delay for color change (1000ms = 1 second)
        }
      } else {
        setHighlighted(false); // Reset if element is out of view
        setTextColorWhite(false); // Reset text color if out of view
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [highlighted]);

  return (
    <div className="relative flex flex-col justify-center items-center p-10 bg-pink">
      {/* First text without background */}
      <div
        className="text-black font-bold text-4xl md:text-5xl lg:text-6xl text-center px-4 py-2"
        style={{ fontFamily: 'Cabinet Grotesk' }}
      >
        Your Voltage Engineer whose first priority
      </div>

      {/* Second text with background and highlighter effect */}
      <div
        id="highlightText"
        className={`relative w-3/5 text-xl md:text-5xl lg:text-6xl text-center mx-10 px-4 py-2 transition-all duration-500 ease-in-out ${
          highlighted ? 'p-2' : ''
        } ${textColorWhite ? 'text-white' : 'text-black'}`} // Apply text color change after highlight
        style={{ fontFamily: 'Cabinet Grotesk' }}
      >
        <Image
          src={textBanner}
          alt="Background Red"
          fill
          className="absolute inset-0 -z-10 object-cover"
        />
        is customer satisfaction!!
      </div>
    </div>
  );
}
