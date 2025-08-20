import PromoBanner from './components/prenavbar'; 
import Navbar from './components/navbar'; 
import Footer from './components/footer';
import VoltageEngineer from './components/section2';
import Buttonstxt from './components/Buttons';
import AboutYepso from './components/about';
import  ResponsiveCarousel from './components/crousal';
import { HOME_CAROUSEL_IMAGES, HOME_PROMO_IMAGE_URL } from '../lib/assets';
import Cards from "./components/Card_copy";
import Image from 'next/image';


const HomePage = () => {
  return (
    
    <div >
      <PromoBanner />
      <Navbar/>
      <ResponsiveCarousel 
      images={HOME_CAROUSEL_IMAGES} 
        autoplayDelay={5000} 
        slidesPerView={1} 
        spaceBetween={30}/>
      <VoltageEngineer/>
      < Cards />
      < AboutYepso />
      <div>
        <Image
          src={HOME_PROMO_IMAGE_URL}
          height={100}
          width={100}
          alt="Description of image"
          className="object-contain w-full h-full p-10"
          quality={100}
        />
      </div>
      <Footer />

    </div>
  );
};

export default HomePage;
