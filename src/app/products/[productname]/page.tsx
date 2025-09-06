'use client';

import ProductCardDetailed from "../components/productcarddetailed";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Image from 'next/image';

// Suggestion list will be fetched dynamically; removed static placeholders

type ApiProduct = {
  id: number
  slug: string
  name: string
  price: number
  imageUrl?: string | null
  discountPercent?: number | null
  description?: string | null
  shipping?: string | null
  specifications?: string | null
}

type ProductTabs = 'Description' | 'Shipping' | 'FAQ' | 'Review' | 'Specifications'
const productTabs: ProductTabs[] = ['Description', 'Shipping', 'FAQ', 'Review', 'Specifications']

export default function ProductPage() {
  const params = useParams<{ productname: string }>()
  const slug = decodeURIComponent((params?.productname ?? '') as string)
  const [activeTab, setActiveTab] = useState<ProductTabs>('Description');
  const [swiperRef, setSwiperRef] = useState<SwiperType | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [liked, setLiked] = useState(false);
  const [product, setProduct] = useState<ApiProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { addToCart } = useCart();
  const [related, setRelated] = useState<ApiProduct[]>([])

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/products?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: ApiProduct = await res.json()
        if (alive) setProduct(data)
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to load product'
        if (alive) setError(msg)
      } finally {
        if (alive) setLoading(false)
      }
    })()
    return () => { alive = false }
  }, [slug])

  // Fetch other products for "You may also like" (exclude current)
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const list: ApiProduct[] = await res.json()
        if (alive) setRelated(list.filter((p) => p.slug !== slug).slice(0, 6))
      } catch {
        if (alive) setRelated([])
      }
    })()
    return () => { alive = false }
  }, [slug])

  const handleQuantityChange = (type: 'increment' | 'decrement') => {
    if (type === 'increment') {
      setQuantity(quantity + 1);
    } else if (type === 'decrement' && quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="w-full mx-auto p-8 text-gray-600">Loading product...</div>
    )
  }

  if (error || !product) {
    return (
      <div className="w-full mx-auto p-8 text-red-600">{error || 'Product not found'}</div>
    )
  }

  const productImages = [product.imageUrl || '/next.svg', product.imageUrl || '/next.svg', product.imageUrl || '/next.svg']
  const discount = product.discountPercent ?? 0
  const originalPrice = discount > 0 && (1 - discount / 100) > 0 ? Math.round(product.price / (1 - discount / 100)) : null

  return (
    <>

      {/* Breadcrumb */}
      <div className="bg-[#F0F0F0] py-2 lg:p-6">
        <div className="w-full mx-auto text-xl text-black">
          <Link href="/products" className='mx-4 hover:underline'>Products</Link>
          &gt;
          <span className="font-semibold mx-4">{product.name}</span>
        </div>
      </div>

      <div className="w-full mx-auto p-4 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:px-20">
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
            className="w-full rounded-lg overflow-hidden"
          >
            {productImages.map((img: string, index: number) => (
              <SwiperSlide key={index}>
                <div className="relative w-full aspect-[16/9]">
                  <Image src={img} alt={`Product Image ${index + 1}`} fill className="object-contain bg-white" priority={index === 0} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnail Gallery */}
          <div className="flex mt-4 gap-4 items-center justify-center flex-wrap">
            {productImages.map((img: string, index: number) => (
              <button
                key={index}
                onClick={() => swiperRef?.slideTo(index)}
                className={`flex border rounded-lg overflow-hidden h-24 w-24 bg-white`}
              >
                <Image src={img} alt={`Thumbnail ${index + 1}`} width={96} height={96} className="object-contain" />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info Section */}
        <div>
          {/* Discount Badge */}
          {discount > 0 && (
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm inline-block mb-2">
              -{discount}%
            </span>
          )}

          {/* Product Title */}
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

          {/* Rating and Price */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-500">★★★★★</span>
            <span className="text-gray-500">(4 Reviews)</span>
          </div>
          <p className="text-xl text-red-500 gap-10">
            {originalPrice && (
              <span className="line-through text-gray-400 mr-3">Rs {originalPrice}</span>
            )}
            Rs {product.price}
          </p>
          <p className="text-sm mt-2">Tax not included</p>

          {/* Description Preview */}
          <p className="mt-4 text-gray-600">{(product.description ?? '').slice(0, 300) || '—'}</p>

          {/* Add to Cart Section */}
          <div className="mt-6 flex items-center gap-6 flex-wrap">
            {/* Quantity Selector */}
            <div className="flex items-center border border-black rounded-xl px-5 py-[6px] gap-1">
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
            <button
              onClick={async () => {
                try {
                  await addToCart(product.id, quantity)
                } catch (e) {
                  console.error(e)
                }
              }}
              className="bg-black text-white px-[20px] py-[8px] rounded-xl"
            >
              Add to Cart
            </button>

            {/* Like Button */}
            <button
              onClick={() => setLiked(!liked)}
              className={`text-xl ${liked ? 'text-red-500' : 'text-gray-400'} hover:text-red-500`}
              aria-label="Like Button"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" fill={liked ? "currentColor" : "none"} className="transition-all duration-200">
                <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" fill="white" />
                <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" stroke="black" />
                <path d="M15.7916 22.875L13.5427 20.8562C12.6927 20.0889 11.9637 19.4042 11.3557 18.8021C10.7477 18.2 10.246 17.6333 9.8505 17.1021C9.45501 16.5708 9.16578 16.0573 8.98279 15.5615C8.79981 15.0656 8.70831 14.5462 8.70831 14.0031C8.70831 12.8934 9.08019 11.9696 9.82394 11.2318C10.5677 10.4939 11.4944 10.125 12.6041 10.125C13.218 10.125 13.8024 10.2549 14.3573 10.5146C14.9121 10.7743 15.3903 11.1403 15.7916 11.6125C16.193 11.1403 16.6712 10.7743 17.226 10.5146C17.7809 10.2549 18.3653 10.125 18.9791 10.125C19.9354 10.125 20.7382 10.3936 21.3875 10.9307C22.0368 11.4679 22.4795 12.1437 22.7156 12.9583H21.2104C20.9979 12.4861 20.685 12.1319 20.2719 11.8958C19.8587 11.6597 19.4278 11.5417 18.9791 11.5417C18.3771 11.5417 17.8576 11.704 17.4208 12.0286C16.984 12.3533 16.5767 12.7812 16.1989 13.3125H15.3844C15.0184 12.7812 14.6022 12.3533 14.1359 12.0286C13.6696 11.704 13.159 11.5417 12.6041 11.5417C11.9312 11.5417 11.3498 11.7748 10.8599 12.2411C10.3699 12.7075 10.125 13.2948 10.125 14.0031C10.125 14.3927 10.2076 14.7882 10.3729 15.1896C10.5382 15.591 10.8333 16.0543 11.2583 16.5797C11.6833 17.105 12.2618 17.7189 12.9937 18.4214C13.7257 19.1238 14.6583 19.9708 15.7916 20.9625C16.0986 20.691 16.4587 20.3781 16.8719 20.024C17.285 19.6698 17.6156 19.3747 17.8635 19.1385L18.0229 19.2979L18.3682 19.6432L18.7135 19.9885L18.8729 20.1479C18.6132 20.384 18.2826 20.6762 17.8812 21.0245C17.4798 21.3727 17.1257 21.6826 16.8187 21.9542L15.7916 22.875ZM20.75 20.0417V17.9167H18.625V16.5H20.75V14.375H22.1666V16.5H24.2916V17.9167H22.1666V20.0417H20.75Z" fill="black" />
              </svg>
            </button>
          </div>

          {/* Features Section */}
          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-x-[10px] gap-y-[10px]">
            {[
              { icon: '/Static/icons/sine.png', label: 'Pure Sine Wave' },
              { icon: '/Static/icons/MPPT.png', label: 'True MPPT' },
              { icon: '/Static/icons/Wall.png', label: 'Wall Mount Design' },
              { icon: '/Static/icons/Fast.png', label: 'Fast Charging' },
              { icon: '/Static/icons/Advanced.png', label: 'Advanced DSP Technology' },
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <Image src={feature.icon} alt={feature.label} width={50} height={50} className="w-[50px] h-[50px]" />
                <span className="text-sm text-center mt-[5px]">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-[30px] max-w-[1440px] mx-auto p-[15px]">
        <div className="border-b pb-[10px] -mx-4 px-4">
          <div className="flex gap-[16px] md:gap-[20px] overflow-x-auto whitespace-nowrap md:whitespace-normal no-scrollbar md:justify-center">
            {productTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-[10px] px-[20px] flex-shrink-0 ${activeTab === tab ? 'border-b-[3px] border-black font-semibold' : ''}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-[20px] text-gray-700">
          {{
            Description: product.description ?? '—',
            Shipping: product.shipping ?? '—',
            FAQ: 'Common questions and answers about the product.',
            Review: '—',
            Specifications: product.specifications ?? '—',
          }[activeTab]}
        </div>
        <style jsx>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>

      {/* Suggested Products */}
      <h1 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center py-2'>You may also Like</h1>
      <div className="px-4 sm:px-6 md:px-12 py-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
          {related.map((p) => (
            <ProductCardDetailed
              key={p.id}
              image={p.imageUrl || '/next.svg'}
              discount={p.discountPercent ? `-${p.discountPercent}%` : undefined}
              title={p.name}
              reviews={"0"}
              price={p.price}
              timer={"—"}
              slug={p.slug}
              discountPercent={p.discountPercent ?? null}
            />
          ))}
        </div>
      </div>

    </>
  );
}
