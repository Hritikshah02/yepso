'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type CartItem = { productId: number; quantity: number }
type CartContextValue = {
  addToCart: (productId: number, quantity?: number) => Promise<void>
  updateQuantity: (productId: number, quantity: number) => Promise<void>
  refresh: () => Promise<void>
  count: number
  items: CartItem[]
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [count, setCount] = useState(0)
  const [items, setItems] = useState<CartItem[]>([])

  const refresh = useCallback(async () => {
    const res = await fetch('/api/cart', { cache: 'no-store' })
    const data = await res.json()
    const serverItems = (data?.items ?? []) as Array<{ productId: number; quantity: number }>
    setItems(serverItems.map(i => ({ productId: i.productId, quantity: i.quantity })))
    setCount(serverItems.reduce((sum, i) => sum + i.quantity, 0))
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addToCart = useCallback(async (productId: number, quantity = 1) => {
    await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, quantity }) })
    await refresh()
  }, [refresh])

  const updateQuantity = useCallback(async (productId: number, quantity: number) => {
    await fetch('/api/cart', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ productId, quantity }) })
    await refresh()
  }, [refresh])

  const value = useMemo(() => ({ addToCart, updateQuantity, refresh, count, items }), [addToCart, updateQuantity, refresh, count, items])
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}


