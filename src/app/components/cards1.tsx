'use client'
import { useState, useRef } from 'react';
import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import Image1 from "../../../public/Static/Image/image1.png"
import Image2 from "../../../public/Static/Image/image2.png"
import Image3 from "../../../public/Static/Image/image3.png"
import Image4 from "../../../public/Static/Image/image4.png"
import Image5 from "../../../public/Static/Image/image4.png"
interface CardData {
  id: number;
  img: StaticImageData;
  text: string;
}

const cardsData: CardData[] = [
  { id: 1, img: Image1, text: 'Card 1' },
  { id: 2, img: Image2, text: 'Card 2' },
  { id: 3, img: Image3, text: 'Card 3' },
  { id: 4, img: Image4, text: 'Card 4' },
  { id: 5, img: Image5, text: 'Card 5' },
];

const Home = () => {
  const [selectedBtn, setSelectedBtn] = useState<number>(0);
  const cardContainerRef = useRef<HTMLDivElement | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    if (cardContainerRef.current) {
      cardContainerRef.current.scrollLeft += e.deltaY;
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      {/* Button Navigation */}
      <div className="flex space-x-4 mb-8">
        {['Button 1', 'Button 2', 'Button 3', 'Button 4'].map((btnText, idx) => (
          <button
            key={idx}
            className={`px-6 py-2 border border-gray-300 rounded-lg transition-colors duration-300 ${
              selectedBtn === idx ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'
            }`}
            onClick={() => setSelectedBtn(idx)}
          >
            {btnText}
          </button>
        ))}
      </div>

      {/* Card Container */}
      <div
        className="flex overflow-x-auto gap-6 p-4"
        ref={cardContainerRef}
        onWheel={handleWheel}
      >
        {cardsData.map((card) => (
          <div
            key={card.id}
            className="relative w-72 h-96 overflow-hidden rounded-lg transition-transform duration-300 hover:scale-105"
          >
            <Image
              src={card.img}
              alt={`Card ${card.id}`}
              fill
              sizes="(max-width: 768px) 80vw, 18rem"
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 text-white bg-black bg-opacity-50 p-4 w-full">
              <p>{card.text}</p>
              <p className="opacity-0 transition-opacity duration-300 hover:opacity-100 text-sm">
                Additional Info
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
