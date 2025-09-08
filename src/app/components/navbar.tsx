'use client';
import { useState, useEffect } from 'react';
import { Menu, X, Search, User, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { NAV_LOGO_URL } from '../../lib/assets';
import { useCart } from '../context/CartContext';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { count } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [cartBump, setCartBump] = useState(false)

  // Handle scroll event to add/remove the scrolled class
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      // Always close mobile menu when the user scrolls
      setIsOpen(false);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Bump animation on cart count change
  useEffect(() => {
    if (typeof count !== 'number') return
    setCartBump(true)
    const id = window.setTimeout(() => setCartBump(false), 450)
    return () => window.clearTimeout(id)
  }, [count])

  return (
    <nav className={`transition-all duration-300 w-full sticky top-0 z-50 ${isScrolled ? 'bg-white bg-opacity-80 shadow-lg' : 'bg-transparent'} overflow-x-hidden animate-slide-down-fade anim-delay-200 will-change`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">

        {/* Logo (left-aligned) */}
        <div className="flex items-center space-x-2">
          <Link href="/" aria-label="Go to home">
            <Image src={NAV_LOGO_URL} alt="Yepso logo" width={120} height={40} />
          </Link>
        </div>

        {/* Centered Menu */}
        <div className="hidden md:flex justify-center flex-grow space-x-10 items-center whitespace-nowrap lg:gap-10">
          <Link href="/" className="text-black hover:text-red-600">Home</Link>
          <Link href="/products" className="text-black hover:text-red-600">Products</Link>
          <Link href="/contactUs" className="text-black hover:text-red-600">Contact Us</Link>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a product"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  router.push(`/products?q=${encodeURIComponent(query.trim())}`);
                  setQuery('');
                }
              }}
              className="pl-10 pr-4 py-2 border rounded-md focus:ring focus:ring-red-200 w-72 sm:w-96"
            />
            <button
              type="button"
              aria-label="Search"
              onClick={() => {
                if (query.trim()) {
                  router.push(`/products?q=${encodeURIComponent(query.trim())}`)
                  setQuery('')
                }
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <Search size={16} />
            </button>
          </div>

          {/* Icons */}
          <div className="flex space-x-4 items-center">
            <User className="text-black cursor-pointer" />
            <Link href="/cart" className="relative">
              <ShoppingBag className={`text-black cursor-pointer ${cartBump ? 'cart-bump' : ''}`} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1 min-w-5 text-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Right Controls */}
        <div className="md:hidden flex items-center gap-3">
          {/* Icons */}
          <div className="flex space-x-4 items-center">
            {/* Keep account as icon only to match desktop behavior (no /account route) */}
            <User className="text-black" aria-label="Account" />
            <Link href="/cart" className="relative" aria-label="Cart">
              <ShoppingBag className="text-black cursor-pointer" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1 min-w-5 text-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? 'Close menu' : 'Open menu'}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 p-4 bg-white shadow-lg animate-slide-down-fade will-change">
          <Link href="/" className="text-black hover:text-red-600" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="/products" className="text-black hover:text-red-600" onClick={() => setIsOpen(false)}>Products</Link>
          <Link href="/contactUs" className="text-black hover:text-red-600" onClick={() => setIsOpen(false)}>Contact Us</Link>

          {/* Search Bar */}
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for a product"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  setIsOpen(false);
                  router.push(`/products?q=${encodeURIComponent(query.trim())}`);
                  setQuery('');
                }
              }}
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:ring focus:ring-red-200"
            />
            <button
              type="button"
              aria-label="Search"
              onClick={() => {
                if (query.trim()) {
                  setIsOpen(false)
                  router.push(`/products?q=${encodeURIComponent(query.trim())}`)
                  setQuery('')
                }
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <Search size={16} />
            </button>
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes cartBump { 0% { transform: scale(1); } 20% { transform: scale(1.1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }
        .cart-bump { animation: cartBump 450ms ease-out; }
      `}</style>
    </nav>

  );
}
