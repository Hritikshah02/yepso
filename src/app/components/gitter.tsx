"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Image from "next/image";
import parse from "html-react-parser";

type CatalogCard = {
  id: number | string;
  card_title: string;
  card_image: string;
  catalogs_desc: string;
};

const fetchDataFromApis = async (): Promise<CatalogCard[][]> => {
  const urls = [
    'http://127.0.0.1:8000/catalog/catalogs_ac_stabalizer/',
    'http://127.0.0.1:8000/catalog/catalogs_inveter/',
    'http://127.0.0.1:8000/catalog/catalogs_new_drops/',
    'http://127.0.0.1:8000/catalog/catalogs_aio_lithium/',
  ];

  const responses = await Promise.all(urls.map((url) => fetch(url)));
  const data = await Promise.all(responses.map((response) => response.json() as Promise<CatalogCard[]>));
  return data as CatalogCard[][];
};

export default function ScrollCards() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [scrollX, setScrollX] = useState<number>(0);
  const [touchStartX, setTouchStartX] = useState<number>(0);
  const [allCards, setAllCards] = useState<CatalogCard[]>([]);

  useEffect(() => {
    const getData = async () => {
      const catalogs = await fetchDataFromApis();
      const allCards = catalogs.flat();
      setAllCards(allCards);
    };
    getData();
  }, []);

  useEffect(() => {
    if (!containerRef.current || !wrapperRef.current) return;

    const container = containerRef.current;
    const handleWheelScroll = (event: WheelEvent) => {
      event.preventDefault();
      const totalWidth = (wrapperRef.current as HTMLDivElement).scrollWidth - container.clientWidth;
      const moveDistance = event.deltaY;
      const newPos = Math.min(Math.max(0, scrollX + moveDistance), totalWidth);
      setScrollX(newPos);

      gsap.to(wrapperRef.current as HTMLDivElement, {
        x: -newPos,
        ease: "power2.out",
        duration: 0.5,
        overwrite: "auto",
      });
    };

    const handleTouchStart = (event: TouchEvent) => {
      setTouchStartX(event.touches[0].clientX);
    };

    const handleTouchMove = (event: TouchEvent) => {
      event.preventDefault();
      const totalWidth = (wrapperRef.current as HTMLDivElement).scrollWidth - container.clientWidth;
      const touchMoveX = event.touches[0].clientX;
      const moveDistance = touchStartX - touchMoveX;
      const newPos = Math.min(Math.max(0, scrollX + moveDistance), totalWidth);
      setScrollX(newPos);

      gsap.to(wrapperRef.current as HTMLDivElement, {
        x: -newPos,
        ease: "power2.out",
        duration: 0.5,
        overwrite: "auto",
      });
      setTouchStartX(touchMoveX);
    };

    container.addEventListener("wheel", handleWheelScroll, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheelScroll);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [scrollX, touchStartX]);

  return (
    <main className="h-full flex items-center justify-center py-10 bg-pink-500">
      <div ref={containerRef} className="relative w-full overflow-hidden">
        <div ref={wrapperRef} className="flex gap-6 w-max py-10 px-6">
          {allCards.map((card, index) => (
            <div
              key={`${card.id}-${card.card_title}-${index}`}
              className="max-w-sm mx-auto group transform transition-all duration-300 ease-in-out hover:scale-107"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-lg relative group">
                <div className="relative w-full h-64">
                  <Image
                    src={card.card_image}
                    alt={card.card_title}
                    fill
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 400px"
                    className="object-cover"
                  />
                  <div className="absolute bottom-2 left-2 text-white font-semibold text-lg bg-black bg-opacity-50 p-2 rounded">
                    {card.card_title}
                  </div>
                </div>
                <div className="bg-white shadow-lg w-full opacity-0 max-h-0 overflow-hidden transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:max-h-[100px]">
                  <p className="text-gray-700 p-4">{parse(card.catalogs_desc)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
