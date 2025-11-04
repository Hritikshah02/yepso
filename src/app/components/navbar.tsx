'use client';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Menu, X, Search, User, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { NAV_LOGO_URL } from '../../lib/assets';
import { useCart } from '../context/CartContext';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { count, refresh: refreshCart } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [cartBump, setCartBump] = useState(false)
  const { user, loading, signOut, refresh: refreshAuth } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  type ApiProduct = { id: number; slug: string; name: string }
  const [prodMenuOpen, setProdMenuOpen] = useState(false)
  const [products, setProducts] = useState<ApiProduct[] | null>(null)
  // Trigger button ref (used to position portal menu)
  const userMenuButtonRef = useRef<HTMLButtonElement>(null)
  const userMenuPortalRef = useRef<HTMLDivElement>(null)
  const [menuPos, setMenuPos] = useState<{ top: number; right: number }>({ top: 0, right: 0 })
  // Products dropdown trigger (vertical menu attached to navbar)
  const prodTriggerRef = useRef<HTMLDivElement>(null)
  const prodPortalRef = useRef<HTMLDivElement>(null)
  const [prodPos, setProdPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 560 })

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
  }, [])

  // Fetch products for dropdown
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await fetch('/api/products', { cache: 'no-store' })
        if (!res.ok) return
        const data: ApiProduct[] = await res.json()
        if (active) setProducts(data)
      } catch {}
    })()
    return () => { active = false }
  }, [])

  // Compute portal position for Products dropdown
  useEffect(() => {
    function update() {
      const trg = prodTriggerRef.current
      if (!trg) return
      const r = trg.getBoundingClientRect()
      const desired = Math.min(420, Math.max(260, Math.floor(window.innerWidth * 0.28)))
      const left = Math.max(8, Math.min(r.left, window.innerWidth - desired - 8))
      const width = desired
      const top = r.bottom // flush under navbar (viewport coords)
      setProdPos({ top, left, width })
    }
    if (prodMenuOpen) {
      update()
      const onScroll = () => update()
      const onResize = () => update()
      window.addEventListener('scroll', onScroll, true)
      window.addEventListener('resize', onResize)
      return () => {
        window.removeEventListener('scroll', onScroll, true)
        window.removeEventListener('resize', onResize)
      }
    }
  }, [prodMenuOpen])

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

  // Compute portal menu position relative to trigger
  useEffect(() => {
    function update() {
      const btn = userMenuButtonRef.current
      if (!btn) return
      const r = btn.getBoundingClientRect()
      setMenuPos({ top: r.bottom + window.scrollY + 8, right: window.innerWidth - r.right })
    }
    if (userMenuOpen) {
      update()
      const onScroll = () => update()
      const onResize = () => update()
      window.addEventListener('scroll', onScroll, true)
      window.addEventListener('resize', onResize)
      return () => {
        window.removeEventListener('scroll', onScroll, true)
        window.removeEventListener('resize', onResize)
      }
    }
  }, [userMenuOpen])

  // Close on outside click (consider both trigger and portal menu)
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const btn = userMenuButtonRef.current
      const menu = userMenuPortalRef.current
      const t = e.target as Node
      if (btn && btn.contains(t)) return
      if (menu && menu.contains(t)) return
      setUserMenuOpen(false)
    }
    if (userMenuOpen) {
      document.addEventListener('mousedown', onDocMouseDown)
      return () => document.removeEventListener('mousedown', onDocMouseDown)
    }
  }, [userMenuOpen])

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
          <div
            ref={prodTriggerRef}
            className="relative"
            onMouseEnter={() => setProdMenuOpen(true)}
            onMouseLeave={() => setProdMenuOpen(false)}
          >
            <Link href="/products" className="text-black hover:text-red-600">Products</Link>
          </div>
          {prodMenuOpen && typeof window !== 'undefined' && createPortal(
            <div
              ref={prodPortalRef}
              className="fixed z-[1000] max-h-[70vh] overflow-y-auto rounded-lg shadow-lg border border-gray-200 bg-gradient-to-b from-white/95 via-red-50/90 to-white/95 backdrop-blur"
              style={{ top: prodPos.top, left: prodPos.left, width: prodPos.width }}
              onMouseEnter={() => setProdMenuOpen(true)}
              onMouseLeave={() => setProdMenuOpen(false)}
            >
              <div className="py-2 flex flex-col">
                {(products ?? []).map(p => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className="block w-full px-4 py-2 hover:bg-red-50 hover:text-red-700 transition-colors border-b last:border-b-0"
                    onClick={() => setProdMenuOpen(false)}
                  >
                    {p.name}
                  </Link>
                ))}
                {!products && (
                  <div className="px-4 py-2 text-gray-500">Loading...</div>
                )}
              </div>
            </div>,
            document.body
          )}
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
          <div className="flex space-x-4 items-center relative">
            {/* User dropdown */}
            <button
              ref={userMenuButtonRef}
              type="button"
              className="flex items-center justify-center w-9 h-9 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300"
              onClick={() => setUserMenuOpen(v => !v)}
              aria-label="Account"
            >
              {user?.firstName ? (user.firstName[0] || 'U') : <User className="text-black" size={18} />}
            </button>
            {userMenuOpen && typeof window !== 'undefined' && createPortal(
              <div
                ref={userMenuPortalRef}
                className="fixed z-[1000] bg-white rounded-md shadow-lg w-64 overflow-hidden border"
                style={{ top: menuPos.top, right: menuPos.right }}
              >
                {user ? (
                  <div className="flex flex-col">
                    <div className="px-4 py-3 border-b">
                      <div className="font-medium">{`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || 'User'}</div>
                      {user.email ? <div className="text-sm text-gray-600 truncate">{user.email}</div> : null}
                    </div>
                    <Link href="/my-products" className="px-4 py-3 hover:bg-gray-100" onClick={() => setUserMenuOpen(false)}>My Products</Link>
                    <button className="text-left px-4 py-3 hover:bg-gray-100" onClick={async () => { await signOut(); await refreshCart(); setUserMenuOpen(false); router.push('/signIn') }}>Sign out</button>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <Link href="/signIn" className="px-4 py-3 hover:bg-gray-100" onClick={() => setUserMenuOpen(false)}>Sign In</Link>
                    <Link href="/signUp" className="px-4 py-3 hover:bg-gray-100" onClick={() => setUserMenuOpen(false)}>Create Account</Link>
                  </div>
                )}
              </div>,
              document.body
            )}
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
