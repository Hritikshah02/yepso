import ResponsiveCarousel from '../components/crousal';
import { PRODUCT_CAROUSEL_IMAGES } from '../../lib/assets';
import Categories from './components/catagory'
import ProductCatalogue from './components/product'


const ProductPage = () => {
  return (
    
    <div className='bg-[#F8F8F8]'>
      
      <ResponsiveCarousel 
      images={PRODUCT_CAROUSEL_IMAGES} 
        autoplayDelay={5000} 
        slidesPerView={1} 
        spaceBetween={30}/>

        <Categories/> {/* catagory */}
        <ProductCatalogue/>

    

    </div>
  );
};

export default ProductPage;
