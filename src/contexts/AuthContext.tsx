import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { User, Pet } from '@/types'
import { api } from '@/services/api'

interface AuthContextType {
  user: User | null
  token: string | null
  pets: Pet[]
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  loadPets: () => Promise<void>
  clearError: () => void
  error: string | null
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token')
  })
  const [pets, setPets] = useState<Pet[]>([])
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null)
      const response = await api.login(email, password)
      setUser(response.user)
      setToken(response.access_token)
      api.setToken(response.access_token)
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
      throw err
    }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      setError(null)
      const response = await api.register(name, email, password)
      setUser(response.user)
      setToken(response.access_token)
      api.setToken(response.access_token)
      localStorage.setItem('token', response.access_token)
      localStorage.setItem('user', JSON.stringify(response.user))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
      throw err
    }
  }, [])

  const logout = useCallback(() => {
    api.logout()
    setUser(null)
    setToken(null)
    setPets([])
    api.setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }, [])

  const loadPets = useCallback(async () => {
    if (!token) return
    api.setToken(token)
    try {
      const petsData = await api.getPets()
      setPets(petsData)
    } catch (err) {
      console.error('Failed to load pets:', err)
    }
  }, [token])

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        pets,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        loadPets,
        clearError,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
