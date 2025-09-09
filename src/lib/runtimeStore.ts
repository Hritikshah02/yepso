// Simple in-memory stores to allow auth to work without DB migrations during development
// Not for production use.
export type RuntimeUser = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  passwordHash: string
  role: 'user' | 'admin'
}

// key: email
export const RUNTIME_USERS = new Map<string, RuntimeUser>()
