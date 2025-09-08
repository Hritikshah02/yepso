import Categories from './components/catagory'
import ProductCatalogue from './components/product'


const ProductPage = () => {
  return (
    
    <div className='bg-[#F8F8F8]'>
      {/* Placeholder space for future cover image/banner */}
      <div className="w-full h-[120px] sm:h-[160px] md:h-[220px] lg:h-[260px]"></div>

        <Categories/> {/* catagory */}
        <ProductCatalogue/>

    

    </div>
  );
};

export default ProductPage;
