'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useCart } from '../context/CartContext'
import PromoBanner from '../components/prenavbar'
import Navbar from '../components/navbar'
import Footer from '../components/footer'

interface CartProduct {
  id: number
  name: string
  price: number
  imageUrl?: string | null
  discountPercent?: number | null
}

interface CartItem {
  id: number
  productId: number
  quantity: number
  product: CartProduct
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const { refresh } = useCart()

  useEffect(() => {
    const fetchCart = async () => {
      const res = await fetch('/api/cart', { cache: 'no-store' })
      const data = await res.json()
      setItems(data.items ?? [])
      setTotal(data.total ?? 0)
      setLoading(false)
    }
    fetchCart()
  }, [])

  const updateQty = async (productId: number, quantity: number) => {
    await fetch('/api/cart', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, quantity }) })
    const res = await fetch('/api/cart', { cache: 'no-store' })
    const data = await res.json()
    setItems(data.items ?? [])
    setTotal(data.total ?? 0)
    await refresh()
  }

  const removeItem = async (productId: number) => {
    await fetch(`/api/cart?productId=${productId}`, { method: 'DELETE' })
    const res = await fetch('/api/cart', { cache: 'no-store' })
    const data = await res.json()
    setItems(data.items ?? [])
    setTotal(data.total ?? 0)
    await refresh()
  }

  const clearCart = async () => {
    // API doesn't support clearing all items at once; remove each item sequentially.
    const res = await fetch('/api/cart', { cache: 'no-store' })
    const data = await res.json()
    const current: CartItem[] = data.items ?? []
    for (const it of current) {
      // eslint-disable-next-line no-await-in-loop
      await fetch(`/api/cart?productId=${it.productId}`, { method: 'DELETE' })
    }
    const res2 = await fetch('/api/cart', { cache: 'no-store' })
    const data2 = await res2.json()
    setItems(data2.items ?? [])
    setTotal(data2.total ?? 0)
    await refresh()
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <>
      <PromoBanner />
      <Navbar />
      <div className="w-full bg-[#F8F8F8]">
        <div className="max-w-6xl mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
          {items.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <p className="text-gray-600 mb-4">Your cart is empty.</p>
              <Link className="text-blue-600 underline" href="/products">Continue shopping</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.product.imageUrl ?? 'https://res.cloudinary.com/demo/image/upload/f_auto,q_auto/sample'} alt={item.product.name} className="w-20 h-20 object-cover rounded" />
                      <div>
                        <div className="font-semibold">{item.product.name}</div>
                        <div className="text-gray-600">
                          {((item.product.discountPercent ?? 0) > 0) ? (
                            <>
                              <span className="line-through text-gray-400 mr-2">Rs {item.product.price}</span>
                              Rs {Math.round(item.product.price * (1 - (item.product.discountPercent ?? 0) / 100))}
                            </>
                          ) : (
                            <>Rs {item.product.price}</>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <button
                          className="px-3 py-1 border rounded"
                          onClick={() => item.quantity > 1 ? updateQty(item.productId, item.quantity - 1) : removeItem(item.productId)}
                        >
                          -
                        </button>
                        <span className="min-w-6 text-center">{item.quantity}</span>
                        <button className="px-3 py-1 border rounded" onClick={() => updateQty(item.productId, item.quantity + 1)}>+</button>
                      </div>
                      <div className="w-32 text-right font-medium">
                        {((item.product.discountPercent ?? 0) > 0) ? (
                          <>
                            <span className="line-through text-gray-400 mr-2">Rs {item.product.price * item.quantity}</span>
                            Rs {Math.round(item.product.price * (1 - (item.product.discountPercent ?? 0) / 100)) * item.quantity}
                          </>
                        ) : (
                          <>Rs {item.product.price * item.quantity}</>
                        )}
                      </div>
                      <button className="text-red-600 hover:underline" onClick={() => removeItem(item.productId)}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
              <aside className="bg-white rounded-lg p-4 h-fit">
                <div className="flex justify-between mb-2"><span>Subtotal</span><span>Rs {total}</span></div>
                <div className="text-sm text-gray-500 mb-4">Taxes and shipping calculated at checkout.</div>
                <Link href="/checkout" className="block text-center w-full bg-black text-white py-2 rounded-lg">Proceed to Checkout</Link>
                <button className="w-full mt-2 text-red-600 py-2 border border-red-300 rounded-lg" onClick={clearCart}>Clear Cart</button>
              </aside>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}


