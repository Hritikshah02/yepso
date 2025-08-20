"use client"; // Required for Next.js to render this client-side

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

// Define the prop types for the component
interface CarouselProps {
  images: string[]; // Array of image URLs to be displayed
  autoplayDelay?: number; // Autoplay delay in milliseconds
  slidesPerView?: number; // Number of slides visible at once
  spaceBetween?: number; // Space between slides
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  autoplayDelay = 3000,
  slidesPerView = 1,
  spaceBetween = 20,
}) => {
  return (
    <div className="w-full mx-auto">
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden rounded-2xl bg-white">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={spaceBetween}
          slidesPerView={slidesPerView}
          loop={true}
          autoplay={{ delay: autoplayDelay }}
          navigation
          pagination={{ clickable: true }}
          className="rounded-2xl shadow-lg h-full"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <Image
                  src={src}
                  alt={`Slide ${index + 1}`}
                  fill
                  className="object-contain"
                  priority={index === 0}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default Carousel;
