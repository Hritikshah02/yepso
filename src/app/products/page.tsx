import Categories from './components/catagory'
import ProductCatalogue from './components/product'
import { Suspense } from 'react'
import Carousel from '../components/crousal'
import { PRODUCT_CAROUSEL_IMAGES } from '../../lib/assets'


const ProductPage = () => {
  return (
    
    <div className='bg-[#F8F8F8]'>
      {/* Products page cover slider */}
      <div className="px-0">
        <Carousel
          images={PRODUCT_CAROUSEL_IMAGES}
          autoplayDelay={5000}
          slidesPerView={1}
          spaceBetween={30}
          objectFit="cover"
        />
      </div>

        <Categories/> {/* catagory */}
        {/* Wrap client component that uses useSearchParams in Suspense to satisfy Next.js */}
        <Suspense fallback={<div className="px-4 sm:px-6 md:px-12 py-8 text-gray-600">Loading catalogue...</div>}>
          <ProductCatalogue/>
        </Suspense>

    

    </div>
  );
};

export default ProductPage;
