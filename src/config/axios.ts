import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 1000,
  withCredentials: false,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status ?? 0
    const message =
      err?.response?.data?.message ?? err?.message ?? 'Request failed'
    return Promise.reject({ status, message, data: err?.response?.data })
  }
)
