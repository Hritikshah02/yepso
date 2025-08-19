'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

type ApiProduct = { slug: string; name: string; _count?: { cartItems: number }; createdAt?: string };

export default function Footer() {
  const [openProduct, setOpenProduct] = useState(false);
  const [openQuickLinks, setOpenQuickLinks] = useState(false);
  const [openConnect, setOpenConnect] = useState(false);
  const [topProducts, setTopProducts] = useState<ApiProduct[]>([]);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' });
        if (!res.ok) return;
        const list: ApiProduct[] = await res.json();
        const sorted = [...list].sort((a, b) => (b._count?.cartItems ?? 0) - (a._count?.cartItems ?? 0));
        const top3 = sorted.slice(0, 3);
        if (active) setTopProducts(top3);
      } catch {}
    })();
    return () => { active = false };
  }, []);

  return (
    <footer className="bg-gray-100 py-10 px-5 md:px-10">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-black">

        {/* Logo */}
        <div>
          <h3 className="font-bold text-lg mb-3 border-b pb-2">&nbsp;</h3>
          <div className="pt-1">
            <img
              alt="Logo"
              loading="lazy"
              width={180}
              height={60}
              decoding="async"
              data-nimg="1"
              srcSet="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fimage.b1de5524.png&w=128&q=75 1x, /_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fimage.b1de5524.png&w=256&q=75 2x"
              src="/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fimage.b1de5524.png&w=256&q=75"
              style={{ color: 'transparent' }}
            />
          </div>
        </div>

        {/* Products */}
        <div>
          <h3
            className="font-bold text-lg mb-3 cursor-pointer border-b pb-2"
            onClick={() => setOpenProduct(!openProduct)}
          >
            Products
          </h3>
          {/* Display only on small screens */}
          <ul className={`${openProduct ? 'block' : 'hidden'} md:block space-y-2`}>
            {topProducts.length > 0 ? (
              topProducts.map((p) => (
                <li key={p.slug}>
                  <Link href={`/products/${p.slug}`} className="hover:text-red-600">{p.name}</Link>
                </li>
              ))
            ) : (
              <>
                <li><a href="#" className="hover:text-red-600">Product A</a></li>
                <li><a href="#" className="hover:text-red-600">Product B</a></li>
                <li><a href="#" className="hover:text-red-600">Product C</a></li>
              </>
            )}
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3
            className="font-bold text-lg mb-3 cursor-pointer border-b pb-2"
            onClick={() => setOpenQuickLinks(!openQuickLinks)}
          >
            Quick Links
          </h3>
          {/* Display only on small screens */}
          <ul className={`${openQuickLinks ? 'block' : 'hidden'} md:block space-y-2`}>
            <li><Link href="/" className="hover:text-red-600">Home</Link></li>
            <li><Link href="/products" className="hover:text-red-600">Products</Link></li>
            <li><Link href="/contact" className="hover:text-red-600">Contact Us</Link></li>
          </ul>
        </div>

        {/* Connect With Us */}
        <div>
          <h3
            className="font-bold text-lg mb-3 cursor-pointer border-b pb-2"
            onClick={() => setOpenConnect(!openConnect)}
          >
            Connect With Us
          </h3>
          {/* Display only on small screens */}
          <div className={`${openConnect ? 'block' : 'hidden'} md:block`}>
            <div className="flex items-center space-x-2 mb-2">
              <i className="text-green-500 fa-brands fa-whatsapp"></i>
              <span>+91 44444 44444</span>
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <i className="text-green-500 fa-brands fa-solid fa-envelope"></i>
              <span>xyz@gmail.com</span>
            </div>
            <h3 className="font-bold text-lg mb-3 sm:hidden md:grid">Follow Us</h3>
            {/* Follow Us icons - changed to grid for medium devices and larger */}
            <div className="flex sm:grid md:grid-cols-5 gap-4 text-xl sm:hidden md:flex">
              <a href="#" className="text-blue-600 hover:text-blue-800"><i className="fa-brands fa-facebook"></i></a>
              <a href="#" className="text-black hover:text-gray-800"><i className="fa-brands fa-x-twitter"></i></a>
              <a href="#" className="text-pink-600 hover:text-pink-800"><i className="fa-brands fa-instagram"></i></a>
              <a href="#" className="text-blue-500 hover:text-blue-700"><i className="fa-brands fa-linkedin"></i></a>
              <a href="#" className="text-red-600 hover:text-red-800"><i className="fa-brands fa-youtube"></i></a>
            </div>
          </div>
        </div>

      </div>

      {/* Follow Us Section */}
      <div className=" py-2 lg:hidden">
        <div className="container mx-auto">
          <h3 className="font-bold text-lg mb-3 text-black">Follow Us</h3>
          <div className="flex space-x-4 text-xl">
            <a href="#" className="text-blue-600 hover:text-blue-800"><i className="fa-brands fa-facebook"></i></a>
            <a href="#" className="text-black hover:text-gray-800"><i className="fa-brands fa-x-twitter"></i></a>
            <a href="#" className="text-pink-600 hover:text-pink-800"><i className="fa-brands fa-instagram"></i></a>
            <a href="#" className="text-blue-500 hover:text-blue-700"><i className="fa-brands fa-linkedin"></i></a>
            <a href="#" className="text-red-600 hover:text-red-800"><i className="fa-brands fa-youtube"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
