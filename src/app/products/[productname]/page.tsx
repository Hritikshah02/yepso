'use client';

import PromoBanner from '../../components/prenavbar';
import Navbar from '../../components/navbar';
import Footer from '../../components/footer';

import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

const product = {
  name: 'Solar Inverter Model XYZ',
  price: 15000,
  originalPrice: 20000,
  discount: 30,
  images: [
    '/Static/Image/about1.png',
    '/Static/Image/about2.png',
    '/Static/Image/about3.png',
  ],
  features: [
    { icon: '/Static/icons/sine.png', label: 'Pure Sine Wave' },
    { icon: '/Static/icons/MPPT.png', label: 'True MPPT' },
    { icon: '/Static/icons/Wall.png', label: 'Wall Mount Design' },
    { icon: '/Static/icons/Fast.png', label: 'Fast Charging' },
    { icon: '/Static/icons/Advanced.png', label: 'Advanced DSP Technology' },
  ],
  tabs: {
    Description:
      'Inverter Pure Sine Wave delivers outstanding performance for back-up power and off-grid systems.lorem Nulla lobortis accumsan nulla sed imperdiet. Donec commodo nisl nec nibh consectetur, vel consectetur enim feugiat. Aenean iaculis cursus nibh, vel auctor mi lacinia at. Cras a ipsum dignissim, vehicula quam eu, convallis erat. Duis nec diam at purus dapibus cursus. Donec viverra gravida urna in scelerisque. Vivamus non ante at risus fermentum vulputate. In sit amet purus vitae nisl semper lobortis id sed dolor.Etiam pulvinar elit quis arcu elementum placerat. Maecenas quis imperdiet enim. Nunc iaculis mauris aliquam elit ultrices, et molestie augue placerat. Sed molestie nisi eu porta fringilla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vestibulum efficitur consequat erat sed aliquam. Cras rutrum ullamcorper lectus, in aliquam lectus gravida sit amet. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam felis lectus, venenatis ut sodales vel, congue suscipit felis. Etiam convallis odio sed turpis blandit, vitae egestas metus fringilla. Nullam accumsan eros eget dapibus faucibus.',
    Shipping: 'Fast and secure shipping within 3-5 business days.',
    FAQ: 'Common questions and answers about the product.',
    Review: '4.0 (4 Reviews)',
    Specifications: 'Input Voltage: 12V, Output: 220V, Efficiency: 95%+',
  },
};

export default function ProductPage() {
  const [activeTab, setActiveTab] = useState('Description');
  const [swiperRef, setSwiperRef] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);

  // Handle quantity changes
  const handleQuantityChange = (type) => {
    if (type === 'increment') {
      setQuantity(quantity + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <>
      <PromoBanner />
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-gray-100 py-2 px-4">
        <div className="max-w-7xl mx-auto text-xl text-gray-600">
          <span>Products</span> &gt; <span className="font-semibold">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div>
          {/* Main Swiper for Large Image */}
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={10}
            slidesPerView={1}
            autoplay={{ delay: 3000 }}
            onSwiper={(swiper) => setSwiperRef(swiper)}
            className="w-full aspect-video rounded-lg overflow-hidden"
          >
            {product.images.map((img, index) => (
              <SwiperSlide key={index}>
                <img src={img} alt={`Product Image ${index + 1}`} className="w-full h-full object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnail Gallery */}
          <div className="flex mt-4 gap-4 justify-start">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => swiperRef?.slideTo(index)}
                className={`w-23 h-23 relative border rounded-lg overflow-hidden ${swiperRef?.activeIndex === index ? 'border-black' : 'border-gray-300'
                  }`}
              >
                <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full " />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div>
          {/* Discount Badge */}
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm inline-block mb-2">
            -{product.discount}%
          </span>

          {/* Product Title */}
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          {/* Rating and Price */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-500">★★★★★</span>
            <span className="text-gray-500">(4 Reviews)</span>
          </div>
          <p className="text-xl text-red-500">
            Rs {product.price}{' '}
            <span className="line-through text-gray-400">Rs {product.originalPrice}</span>
          </p>
          <p className="text-sm  mt-2">Tax not included</p>

          {/* Description Preview */}
          <p className="mt-4 text-gray-600">{product.tabs.Description.slice(0, 300)}...</p>

          {/* Add to Cart Section */}
          <div className="mt-6 flex items-center gap-6">
            {/* Quantity Selector */}
            <div className="flex items-center border border-black rounded-xl px-5 py-[6px]">
              <button
                onClick={() => handleQuantityChange('decrement')}
                className="text-lg font-bold px-[10px]"
              >
                -
              </button>
              <span className="px-[10px]">{quantity}</span>
              <button
                onClick={() => handleQuantityChange('increment')}
                className="text-lg font-bold px-[10px]"
              >
                +
              </button>
            </div>

            {/* Add to Cart Button */}
            <button className="bg-black text-white px-[20px] py-[8px] rounded-xl">Add to Cart</button>

            {/* Like Button */}
            <button
              onClick={() => setLiked(!liked)}
              className={`text-xl ${liked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
              aria-label="Like Button"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" fill={liked ? "currentColor" : "none"} className="transition-all duration-200">
                <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" fill="white" />
                <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" stroke="black" />
                <path d="M15.7916 22.875L13.5427 20.8562C12.6927 20.0889 11.9637 19.4042 11.3557 18.8021C10.7477 18.2 10.246 17.6333 9.8505 17.1021C9.45501 16.5708 9.16578 16.0573 8.98279 15.5615C8.79981 15.0656 8.70831 14.5462 8.70831 14.0031C8.70831 12.8934 9.08019 11.9696 9.82394 11.2318C10.5677 10.4939 11.4944 10.125 12.6041 10.125C13.218 10.125 13.8024 10.2549 14.3573 10.5146C14.9121 10.7743 15.3903 11.1403 15.7916 11.6125C16.193 11.1403 16.6712 10.7743 17.226 10.5146C17.7809 10.2549 18.3653 10.125 18.9791 10.125C19.9354 10.125 20.7382 10.3936 21.3875 10.9307C22.0368 11.4679 22.4795 12.1437 22.7156 12.9583H21.2104C20.9979 12.4861 20.685 12.1319 20.2719 11.8958C19.8587 11.6597 19.4278 11.5417 18.9791 11.5417C18.3771 11.5417 17.8576 11.704 17.4208 12.0286C16.984 12.3533 16.5767 12.7812 16.1989 13.3125H15.3844C15.0184 12.7812 14.6022 12.3533 14.1359 12.0286C13.6696 11.704 13.159 11.5417 12.6041 11.5417C11.9312 11.5417 11.3498 11.7748 10.8599 12.2411C10.3699 12.7075 10.125 13.2948 10.125 14.0031C10.125 14.3927 10.2076 14.7882 10.3729 15.1896C10.5382 15.591 10.8333 16.0543 11.2583 16.5797C11.6833 17.105 12.2618 17.7189 12.9937 18.4214C13.7257 19.1238 14.6583 19.9708 15.7916 20.9625C16.0986 20.691 16.4587 20.3781 16.8719 20.024C17.285 19.6698 17.6156 19.3747 17.8635 19.1385L18.0229 19.2979L18.3682 19.6432L18.7135 19.9885L18.8729 20.1479C18.6132 20.384 18.2826 20.6762 17.8812 21.0245C17.4798 21.3727 17.1257 21.6826 16.8187 21.9542L15.7916 22.875ZM20.75 20.0417V17.9167H18.625V16.5H20.75V14.375H22.1666V16.5H24.2916V17.9167H22.1666V20.0417H20.75Z" fill="black" />
              </svg>

            </button>
          </div>

          {/* Features Section */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-x-[20px] gap-y-[10px]">
            {product.features.map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <img src={feature.icon} alt={feature.label} className="w-[50px] h-[50px]" />
                <span className="text-sm text-center mt-[5px]">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-[30px] max-w-[1200px] mx-auto p-[15px]">
        <div className="flex justify-center gap-[20px] border-b pb-[10px]">
          {Object.keys(product.tabs).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-[10px] px-[20px] ${activeTab === tab ? 'border-b-[3px] border-black font-semibold' : ''
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="mt-[20px] text-gray-700">{product.tabs[activeTab]}</div>
      </div>

      <Footer />
    </>
  );
}
