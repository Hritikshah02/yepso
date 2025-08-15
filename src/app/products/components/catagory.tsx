"use client";
import ProductCardCatalog from "./productcard"; 
import Image from "next/image";
import Link from "next/link";

interface PromoBannerProps {
  image: string;
  discountText: string;
  title: string;
  buttonText: string;
}

const SolorBanner: React.FC<PromoBannerProps> = ({ image, discountText, title, buttonText }) => (
  <div
    className="relative w-full aspect-[16/9]"
    style={{
      // Keep text box and border perfectly aligned regardless of screen size
      // by sharing the same inset and radius values.
      ['--frame' as any]: 'clamp(12px, 2.5vw, 24px)',
      ['--radius' as any]: 'clamp(12px, 2vw, 24px)',
    }}
  >
    <Image
      src={image}
      alt={title}
      fill
      priority={false}
      sizes="(min-width:1024px) 50vw, (min-width:640px) 50vw, 100vw"
      className="object-cover rounded-[var(--radius)]"
    />

    {/* White framed overlay to match the image structure */}
    <div className="absolute inset-0">
      {/* Border frame with fluid inset */}
      <div className="absolute inset-[var(--frame)] border-white border-[3px] md:border-[4px] rounded-[var(--radius)] pointer-events-none" />

      {/* Centered overlay content, confined to the same frame inset */}
      <div className="absolute inset-[var(--frame)] flex items-center justify-center">
        <div className="text-white text-center space-y-1 sm:space-y-3 max-w-[min(88%,800px)]">
          <p className="uppercase tracking-wide opacity-90 text-[clamp(0.6rem,1.5vw,0.95rem)]">{discountText}</p>
          <h3 className="font-bold leading-[1.05] drop-shadow text-[clamp(1.8rem,7vw,4rem)]">{title}</h3>
          <button className="inline-flex items-center justify-center bg-red-600 text-white rounded-full shadow-lg text-[clamp(0.75rem,1.8vw,1.05rem)] px-[clamp(16px,3vw,32px)] py-[clamp(9px,1.6vw,15px)]">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  </div>
)
;

const Categories: React.FC = () => {
  return (
    <div className="px-4 sm:px-6 md:px-12 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center gap-6 mt-6 text-black">
        <div className="flex flex-col lg:flex-col mb-4 border-b pb-4">
          <h1 className="text-5xl font-bold border-b-[5px] border-red-600 pb-4 leading-[3.5rem]">
            Shop by <br /> Categories
          </h1>
          <div className="flex-col items-center gap-4">
            <div className="flex gap-4 items-center justify-center">
              <Image
                src="/Static/Image/about3.png"
                alt="Category Icon"
                width={150}
                height={50}
              />
              <p className="text-lg font-semibold text-left">
                10+ <br /> New Products
              </p>
            </div>
            <Link href="/products" className=" font-semibold text-xl flex items-center gap-2">
              <span className="border-b-[3px] border-b-red-600 pb-1 pr-2">All Categories →</span>
            </Link>
          </div>
        </div>
        <div> {/* cards in the catalog section*/}
          <ProductCardCatalog image="/Static/Image/about2.png" title="Inverter 1" />
        </div>
        <div>
          <ProductCardCatalog image="/Static/Image/about2.png" title="Inverter 2" />
        </div>
        <div>
          <ProductCardCatalog image="/Static/Image/about2.png" title="Inverter 3" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
        <div> {/* Solar cards in the catalog section*/}
          <SolorBanner
            image="/Static/product/image.png"
            discountText="30% OFF ON STUFF"
            title="Solar Panels"
            buttonText="Shop Now"
          />
        </div>
        <div>
          <SolorBanner
            image="/Static/product/image.png"
            discountText="50% OFF ON STUFF"
            title="Solar Panels"
            buttonText="Shop Now"
          />
        </div>
      </div>
    </div>
  );
};

export default Categories;
