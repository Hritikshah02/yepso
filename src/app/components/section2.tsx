'use client';
import { useState, useEffect } from 'react';
import textBanner from '../../../public/Static/Image/text2background.png';

export default function VoltageEngineer() {
  const [highlighted, setHighlighted] = useState(false); // Track if highlight effect is applied
  const [textColorWhite, setTextColorWhite] = useState(true); // Keep text white from start
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
          // text remains white consistently
        }
      } else {
        setHighlighted(false); // Reset if element is out of view
        // Keep text white; do not toggle to black
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
    <div className="relative flex flex-col justify-center items-center p-6 md:p-10 w-full overflow-x-hidden">
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
        className={`relative z-0 inline-block max-w-full text-[clamp(18px,3.4vw,38px)] leading-tight text-center px-5 sm:px-6 md:px-8 lg:px-10 py-2 md:py-3 whitespace-nowrap transition-all duration-500 ease-in-out mt-3 md:mt-5 ${
          highlighted ? '' : ''
        } ${textColorWhite ? 'text-white' : 'text-black'}`}
        style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
      >
        {/* Brush image behind text, keeps natural aspect ratio */}
        <img
          src={(textBanner as unknown as { src: string }).src}
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[155%] sm:w-[150%] md:w-[145%] lg:w-[140%] h-auto -z-10 transform origin-center scale-y-150 sm:scale-y-145 md:scale-y-140 lg:scale-y-135"
          loading="lazy"
          decoding="async"
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
