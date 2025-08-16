'use client'

import { useEffect, useMemo, useState } from 'react'
import { useCart } from '../../context/CartContext'

type Props = {
  slug: string
  title: string
}

export default function QuantityControls({ slug, title }: Props) {
  const { items, addToCart, updateQuantity, refresh } = useCart()
  const [productId, setProductId] = useState<number | null>(null)
  const qty = useMemo(() => {
    const found = productId ? items.find(i => i.productId === productId) : undefined
    return found?.quantity ?? 0
  }, [items, productId])

  useEffect(() => {
    let isMounted = true
    const resolveProduct = async () => {
      try {
        const res = await fetch('/api/products')
        const products = await res.json()
        const toSlug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        const targetSlug = slug || toSlug(title)
        let match = products.find((p: any) => p.slug === targetSlug)
        if (!match) match = products.find((p: any) => (p.name ?? '').toLowerCase() === title.toLowerCase())
        if (isMounted && match?.id) setProductId(match.id as number)
      } catch {}
    }
    resolveProduct()
    return () => { isMounted = false }
  }, [slug, title])

  if (!productId) {
    return (
      <button
        onClick={async () => {
          // triggers fetch and then add
          const res = await fetch('/api/products')
          const products = await res.json()
          const match = products.find((p: any) => p.slug === slug) ?? products.find((p: any) => (p.name ?? '').toLowerCase() === title.toLowerCase())
          if (match?.id) {
            setProductId(match.id)
            await addToCart(match.id, 1)
          }
        }}
        className="relative flex items-center justify-center w-40 h-10 bg-white text-black rounded-full transition-all duration-300 hover:bg-gray-800 hover:text-white group/button"
      >
        <span className="group-hover/button:opacity-0 transition-opacity duration-200">Add to Cart</span>
        <i className="fa-solid fa-cart-shopping absolute opacity-0 group-hover/button:opacity-100 transition-opacity duration-200"></i>
      </button>
    )
  }

  if (qty === 0) {
    return (
      <button
        onClick={async () => addToCart(productId, 1)}
        className="relative flex items-center justify-center w-40 h-10 bg-white text-black rounded-full transition-all duration-300 hover:bg-gray-800 hover:text-white group/button"
      >
        <span className="group-hover/button:opacity-0 transition-opacity duration-200">Add to Cart</span>
        <i className="fa-solid fa-cart-shopping absolute opacity-0 group-hover/button:opacity-100 transition-opacity duration-200"></i>
      </button>
    )
  }

  return (
    <div className="flex items-center border border-black rounded-xl bg-white px-4 h-10">
      <button
        className="px-2"
        onClick={async () => {
          if (qty > 1) {
            await updateQuantity(productId, qty - 1)
          } else {
            await fetch(`/api/cart?productId=${productId}`, { method: 'DELETE' })
            await refresh()
          }
        }}
      >
        -
      </button>
      <span className="px-3 select-none">{qty}</span>
      <button className="px-2" onClick={async () => updateQuantity(productId, qty + 1)}>+</button>
    </div>
  )
}


