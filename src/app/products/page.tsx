import PromoBanner from '../components/prenavbar'; 
import Navbar from '../components/navbar'; 
import Footer from '../components/footer';
import ResponsiveCarousel from '../components/crousal';
import Categories from './components/catagory'
import ProductCatalogue from './components/product'
import Image from 'next/image';


const ProductPage = () => {
  const images = [
    "/Static/Crousal/product/Landing Page Banner 2.png",
    "/Static/Crousal/product/Landing Page Banner 2.png",
    "/Static/Crousal/product/Landing Page Banner 2.png",
  ];

  return (
    
    <div className='bg-[#F8F8F8]'>
      <PromoBanner />
      <Navbar/>
      <ResponsiveCarousel 
      images={images} 
        autoplayDelay={5000} 
        slidesPerView={1} 
        spaceBetween={30}/>

        <Categories/> {/* catagory */}
        <ProductCatalogue/>

    

      <Footer />

    </div>
  );
};

export default ProductPage;
