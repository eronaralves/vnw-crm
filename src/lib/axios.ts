import axios from 'axios'
import { env } from '@/env'
import { cookies } from 'next/headers'

// Utils
import { AppError } from '@/utils/app-error'

export const api = axios.create({
  baseURL: env.BASE_URL,
})

api.interceptors.request.use(async (config) => {
  const cookie = await cookies()
  const token = cookie.get('@vnw:session')?.value

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      const cookie = await cookies()
      cookie.delete('@vnw:session')

      return Promise.reject(
        new AppError('Token expirado ou inválido. Faça login novamente.'),
      )
    }

    return Promise.reject(error)
  },
)
