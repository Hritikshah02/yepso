"use client"; // Required for Next.js to render this client-side

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// Using plain <img> for reliability with external Cloudinary URLs

// Define the prop types for the component
interface CarouselProps {
  images: string[]; // Array of image URLs to be displayed
  autoplayDelay?: number; // Autoplay delay in milliseconds
  slidesPerView?: number; // Number of slides visible at once
  spaceBetween?: number; // Space between slides
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'; // Object fit behavior for images
}

const Carousel: React.FC<CarouselProps> = ({
  images,
  autoplayDelay = 3000,
  slidesPerView = 1,
  spaceBetween = 20,
  objectFit = 'contain',
}) => {
  // If no images are provided, render nothing
  if (!images || images.length === 0) return null;

  return (
    <div className="w-full mx-auto">
      <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden bg-white">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={spaceBetween}
          slidesPerView={slidesPerView}
          loop={true}
          autoplay={{ delay: autoplayDelay }}
          navigation
          pagination={{ clickable: true }}
          className="shadow-lg h-full"
        >
          {images.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="relative w-full h-full">
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className="absolute inset-0 w-full h-full"
                  style={{ objectFit }}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  onError={(e) => {
                    // Surface a useful error in the console for debugging
                    // @ts-ignore
                    console.error('Carousel image failed to load:', src, e?.nativeEvent ?? e);
                  }}
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
