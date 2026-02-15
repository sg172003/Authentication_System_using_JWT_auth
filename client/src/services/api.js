import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:5000/api"
})

api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken")

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem("refreshToken")

        const res = await axios.post(
          "http://localhost:5000/api/auth/refresh",
          { refreshToken }
        )

        const newAccessToken = res.data.accessToken

        localStorage.setItem("accessToken", newAccessToken)

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        window.location.href = "/login"
      }
    }

    return Promise.reject(error)
  }
)

export default api
