'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

export type AuthUser = {
  id: string
  role: 'user' | 'admin'
  firstName?: string
  lastName?: string
  email?: string
}

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  refresh: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' })
      if (!res.ok) throw new Error('not auth')
      const data = await res.json()
      setUser(data.user)
    } catch (_) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
    // Redirect happens in navbar click handler or page guard
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const value = useMemo(() => ({ user, loading, refresh, signOut }), [user, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
