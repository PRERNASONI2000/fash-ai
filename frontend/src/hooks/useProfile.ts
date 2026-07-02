//src/hooks/useProfile.ts
import { useEffect, useState } from 'react'

export function useProfile() {
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { setLoading(false); return }
    fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(setProfile)
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [])

  return { profile, loading, error }
}