"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import Cookies from "js-cookie"
import { useRouter } from "next/navigation"
import apiClient from "@/lib/api"

interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  phone_number?: string
  email_verified: boolean
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
    } catch {
      setUser(null)
      setCompany(null)
    }
  }, [])

  useEffect(() => {
    const token = Cookies.get("access_token")
    if (token) {
      refreshUser().finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [refreshUser])

  const login = async (email: string, password: string) => {
    const res = await apiClient.post("/auth/login/", { email, password })
    const { access, refresh } = res.data
    Cookies.set("access_token", access, { expires: 1 })
    Cookies.set("refresh_token", refresh, { expires: 7 })
    await refreshUser()
    // Check if admin
    const meRes = await apiClient.get("/users/me/")
    if (meRes.data?.is_staff) {
      router.push("/admin")
    } else {
      router.push("/dashboard")
    }
  }

  const register = async (data: RegisterData) => {
    const res = await apiClient.post("/auth/register/", data)
    const { access, refresh } = res.data
    Cookies.set("access_token", access, { expires: 1 })
    Cookies.set("refresh_token", refresh, { expires: 7 })
    await refreshUser()
    router.push("/dashboard")
  }

  const logout = async () => {
    try {
      const refresh = Cookies.get("refresh_token")
      if (refresh) {
        await apiClient.post("/auth/logout/", { refresh })
      }
    } finally {
      Cookies.remove("access_token")
      Cookies.remove("refresh_token")
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
