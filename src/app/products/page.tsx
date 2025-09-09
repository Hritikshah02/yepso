import Categories from './components/catagory'
import ProductCatalogue from './components/product'
import { Suspense } from 'react'


const ProductPage = () => {
  return (
    
    <div className='bg-[#F8F8F8]'>
      {/* Placeholder space for future cover image/banner */}
      <div className="w-full h-[120px] sm:h-[160px] md:h-[220px] lg:h-[260px]"></div>

        <Categories/> {/* catagory */}
        {/* Wrap client component that uses useSearchParams in Suspense to satisfy Next.js */}
        <Suspense fallback={<div className="px-4 sm:px-6 md:px-12 py-8 text-gray-600">Loading catalogue...</div>}>
          <ProductCatalogue/>
        </Suspense>

    

    </div>
  );
};

export default ProductPage;
