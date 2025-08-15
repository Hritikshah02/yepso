'use client';
import { useState, useEffect } from 'react';
import { Menu, X, Search, User, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import Logo from "../../../public/Static/Logo/image.png"
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { count } = useCart();

  // Handle scroll event to add/remove the scrolled class
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`transition-all duration-300 w-full sticky top-0 z-50 ${isScrolled ? 'bg-white bg-opacity-80 shadow-lg' : 'bg-transparent'} overflow-x-hidden`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between py-3">

        {/* Logo (left-aligned) */}
        <div className="flex items-center space-x-2">
          <Image src={Logo} alt="Logo" width={120} height={40} />
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
              className="pl-10 pr-4 py-2 border rounded-md focus:ring focus:ring-red-200 w-72 sm:w-96"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
          </div>

          {/* Icons */}
          <div className="flex space-x-4 items-center">
            <User className="text-black cursor-pointer" />
            <Link href="/cart" className="relative">
              <ShoppingBag className="text-black cursor-pointer" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1 min-w-5 text-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 p-4 bg-white shadow-lg">
          <Link href="/" className="text-black hover:text-red-600">Home</Link>
          <Link href="/products" className="text-black hover:text-red-600">Products</Link>
          <Link href="/contactUs" className="text-black hover:text-red-600">Contact Us</Link>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for a product"
              className="pl-10 pr-4 py-2 border rounded-md w-full focus:ring focus:ring-red-200"
            />
            <Search className="absolute left-3 top-2.5 text-gray-500" size={16} />
          </div>

          {/* Icons */}
          <div className="flex space-x-4 items-center">
            <User className="text-black cursor-pointer" />
            <Link href="/cart" className="relative">
              <ShoppingBag className="text-black cursor-pointer" />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1 min-w-5 text-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      )}
    </nav>

  );
}
