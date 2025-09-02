'use client';
import { useState, useEffect } from 'react';
import textBanner from '../../../public/Static/Image/text2background.png';
import Image from 'next/image';

export default function VoltageEngineer() {
  const [highlighted, setHighlighted] = useState(false); // Track if highlight effect is applied
  const [textColorWhite, setTextColorWhite] = useState(false); // Track if text color should be white
  const fullText = 'is customer satisfaction!!';
  const [typedOnce, setTypedOnce] = useState(false);
  const [displayed, setDisplayed] = useState('');

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

  // Start typewriter once when highlighted comes into view
  useEffect(() => {
    if (!highlighted || typedOnce) return;
    let i = 0;
    setDisplayed('');
    const id = window.setInterval(() => {
      i += 1;
      setDisplayed(fullText.slice(0, i));
      if (i >= fullText.length) {
        window.clearInterval(id);
        setTypedOnce(true);
      }
    }, 45); // typing speed (ms per char)
    return () => window.clearInterval(id);
  }, [highlighted, typedOnce, fullText]);

  return (
    <div className="relative flex flex-col justify-center items-center p-10 bg-pink">
      {/* First text without background */}
      <div
        className="text-black font-bold text-4xl md:text-5xl lg:text-6xl text-center px-4 py-2"
        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
      >
        Your Voltage Engineer whose first priority
      </div>

      {/* Second text with background and highlighter effect */}
      <div
        id="highlightText"
        className={`relative w-3/5 text-xl md:text-5xl lg:text-6xl text-center mx-10 px-4 py-2 transition-all duration-500 ease-in-out ${
          highlighted ? 'p-2' : ''
        } ${textColorWhite ? 'text-white' : 'text-black'}`} // Apply text color change after highlight
        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
      >
        <Image
          src={textBanner}
          alt="Background Red"
          fill
          className="absolute inset-0 -z-10 object-cover"
        />
        {displayed}
        {!typedOnce && highlighted ? <span className="caret" aria-hidden="true"></span> : null}
        <style jsx>{`
          @keyframes caretBlink { 0%, 100% { opacity: 0 } 50% { opacity: 1 } }
          .caret { display:inline-block; width:1px; height:1em; background: currentColor; margin-left:2px; vertical-align:-.15em; animation: caretBlink 1s steps(1) infinite; }
        `}</style>
      </div>
    </div>
  );
}
