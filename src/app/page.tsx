import VoltageEngineer from './components/section2';
import AboutYepso from './components/about';
import ResponsiveCarousel from './components/crousal';
import { HOME_CAROUSEL_IMAGES, HOME_PROMO_IMAGE_URL } from '../lib/assets';
import Cards from './components/Card_copy';

const HomePage = () => {
  return (
    
    <div >
      <ResponsiveCarousel 
        images={HOME_CAROUSEL_IMAGES} 
        autoplayDelay={5000} 
        slidesPerView={1} 
        spaceBetween={30}
        objectFit="fill"
      />
      <VoltageEngineer/>
      <Cards />
      <AboutYepso />
      {/* Bottom promo photo with improved sizing and styling */}
      <div className="px-4 sm:px-6 md:px-12 mt-4 sm:mt-6">
        <img
          src={HOME_PROMO_IMAGE_URL}
          alt="Family using Yepso products at home"
          className="block mx-auto w-[88%] sm:w-[82%] md:w-[75%] lg:w-[70%] h-auto rounded-2xl shadow-xl ring-1 ring-black/5"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Tagline moved below the bottom photo */}
      <section className="px-4 sm:px-6 md:px-12 mt-3 sm:mt-5 mb-6">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-black font-bold uppercase tracking-wide text-[clamp(1.2rem,3.8vw,2.4rem)] leading-tight lg:leading-none lg:whitespace-nowrap">
            YOUR TRUSTED VOLTAGE ENGINEER
          </p>
          <p className="mt-1 text-gray-700 tracking-wide text-[clamp(0.78rem,2.2vw,0.95rem)]">
            TRUSTED BY 10K+ CUSTOMERS
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
