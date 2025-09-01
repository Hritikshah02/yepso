import PromoBanner from './components/prenavbar'; 
import Navbar from './components/navbar'; 
import Footer from './components/footer';
import VoltageEngineer from './components/section2';
import Buttonstxt from './components/Buttons';
import AboutYepso from './components/about';
import  ResponsiveCarousel from './components/crousal';
import { HOME_CAROUSEL_IMAGES, HOME_PROMO_IMAGE_URL } from '../lib/assets';
import Cards from "./components/Card_copy";


const HomePage = () => {
  return (
    
    <div >
      <PromoBanner />
      <Navbar/>
      <ResponsiveCarousel 
        images={HOME_CAROUSEL_IMAGES} 
        autoplayDelay={5000} 
        slidesPerView={1} 
        spaceBetween={30}
        objectFit="fill"
      />
      <VoltageEngineer/>
      < Cards />
      < AboutYepso />
      <div>
        <img
          src={HOME_PROMO_IMAGE_URL}
          alt="Description of image"
          className="object-contain p-10 h-auto w-auto max-w-full"
          loading="lazy"
          decoding="async"
        />
      </div>
      <Footer />

    </div>
  );
};

export default HomePage;
