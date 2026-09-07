// ============================================================
// API CLIENT - ImporVia Frontend
// Axios instance avec gestion HttpOnly cookies
// ============================================================
import axios from "axios"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Crucial pour envoyer/recevoir les cookies HttpOnly
  headers: {
    "Content-Type": "application/json",
  },
})

// Interceptor: Auto-refresh du token si expiré (401)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Empêcher l'actualisation/redirection si l'erreur 401 vient de la page de connexion
    if (originalRequest.url?.includes("/auth/login/") || originalRequest.url?.includes("/auth/register/")) {
      return Promise.reject(error)
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        // Le cookie refresh_token HttpOnly sera envoyé automatiquement
        await axios.post(`${API_BASE_URL}/auth/refresh/`, {}, { withCredentials: true })
        // Si réussi, les nouveaux cookies sont set automatiquement
        return apiClient(originalRequest)
      } catch {
        if (typeof window !== "undefined" && !window.location.pathname.includes("/connexion")) {
          window.location.href = "/connexion"
        }
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
