// ============================================================
// API CLIENT - ImporVia Frontend
// Axios instance avec gestion automatique des tokens JWT
// ============================================================
import axios from "axios"
import Cookies from "js-cookie"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor: Attache le token Bearer à chaque requête
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("access_token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Interceptor: Auto-refresh du token si expiré (401)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = Cookies.get("refresh_token")
        if (!refreshToken) {
          // Redirige vers login si pas de refresh token
          if (typeof window !== "undefined") {
            window.location.href = "/connexion"
          }
          return Promise.reject(error)
        }
        const res = await axios.post(`${API_BASE_URL}/auth/refresh/`, { refresh: refreshToken })
        const { access } = res.data
        Cookies.set("access_token", access, { expires: 1 })
        originalRequest.headers.Authorization = `Bearer ${access}`
        return apiClient(originalRequest)
      } catch {
        Cookies.remove("access_token")
        Cookies.remove("refresh_token")
        if (typeof window !== "undefined") {
          window.location.href = "/connexion"
        }
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
