// src/context/AuthContext.tsx
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const API_URL = import.meta.env.VITE_API_URL
const TOKEN_KEY = 'token' // matches App.tsx / Login.tsx / Signup.tsx / useProfile.ts

/** Mirrors backend/models/User.js (password + reset fields stripped by /api/auth/profile). */
export interface AuthUser {
  _id: string
  name: string
  email: string
  profilePicture: string
  credits: number
  activePlan: { name: string; credits: number; recurring?: boolean; billingCycle?: string; features?: string[] } | null
  purchasedAddons: Array<{ name: string; credits: number; price?: number }>
  isSubUser: boolean
  parentUser: string | null
  createdAt: string
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  /** Store token (from /login, /register, or /google) and load the profile. */
  login: (token: string) => Promise<void>
  /** Clear token + user state. Does not navigate — callers redirect as needed. */
  logout: () => void
  /** Re-fetch the current user's profile (e.g. after credits change or profile edit). */
  refreshUser: () => Promise<void>
  /** Patch user state locally without a round trip (e.g. optimistic update after PUT /profile). */
  setUser: (user: AuthUser | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    typeof window === 'undefined' ? null : window.localStorage.getItem(TOKEN_KEY),
  )
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async (activeToken: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${activeToken}` },
      })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to load profile')
      }

      setUser(data)
    } catch (err: any) {
      // Bad/expired token — same failure mode useProfile.ts treats as logged-out.
      setError(err.message || 'Failed to load profile')
      setUser(null)
      setToken(null)
      window.localStorage.removeItem(TOKEN_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load the profile on mount if a token already exists (page refresh, etc.)
  useEffect(() => {
    if (!token) {
      setIsLoading(false)
      return
    }
    fetchProfile(token)
  }, [token, fetchProfile])

  const login = useCallback(
    async (newToken: string) => {
      window.localStorage.setItem(TOKEN_KEY, newToken)
      setToken(newToken)
      await fetchProfile(newToken)
    },
    [fetchProfile],
  )

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
    setError(null)
  }, [])

  const refreshUser = useCallback(async () => {
    if (!token) return
    await fetchProfile(token)
  }, [token, fetchProfile])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      error,
      login,
      logout,
      refreshUser,
      setUser,
    }),
    [user, token, isLoading, error, login, logout, refreshUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}