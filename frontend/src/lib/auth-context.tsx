"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import apiClient from "@/lib/api"

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone_number?: string
  email_verified: boolean
  is_staff?: boolean
}

interface Company {
  id: string
  name: string
  tax_id?: string
}

interface AuthContextType {
  user: User | null
  company: Company | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

interface RegisterData {
  email: string
  password: string
  first_name: string
  last_name: string
  phone_number?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [company, setCompany] = useState<Company | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const refreshUser = useCallback(async () => {
    try {
      const [userRes, companyRes] = await Promise.all([
        apiClient.get("/users/me/"),
        apiClient.get("/companies/"),
      ])
      setUser(userRes.data)
      if (companyRes.data?.results?.length > 0) {
        setCompany(companyRes.data.results[0])
      }
      return userRes.data
    } catch {
      setUser(null)
      setCompany(null)
      return null
    }
  }, [])

  useEffect(() => {
    // Essayer de récupérer le profil utilisateur au chargement. 
    // Si le cookie est présent, l'appel réussira, sinon il échouera (ce qui gère la déconnexion locale).
    refreshUser().finally(() => setIsLoading(false))
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    // Les cookies HttpOnly seront set automatiquement par la réponse
    await apiClient.post("/auth/login/", { email, password })
    const userData = await refreshUser()
    if (userData?.is_staff) {
      router.push("/admin")
    } else {
      router.push("/dashboard")
    }
  }

  const register = async (data: RegisterData) => {
    await apiClient.post("/auth/register/", data)
    const userData = await refreshUser()
    if (userData?.is_staff) {
      router.push("/admin")
    } else {
      router.push("/dashboard")
    }
  }

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout/")
    } catch {
      // Ignorer si déjà déconnecté
    } finally {
      setUser(null)
      setCompany(null)
      router.push("/connexion")
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      company,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
