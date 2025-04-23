import axios from 'axios'
import { env } from '@/env'
import { getServerSession } from 'next-auth'

// Utils
import { authOptions } from '@/utils/auth-options'
import { AppError } from '@/utils/app-error'

export const api = axios.create({
  baseURL: env.BASE_URL,
})

api.interceptors.request.use(async (config) => {
  const session = await getServerSession(authOptions)

  if (session?.accessToken) {
    config.headers.Authorization = `Bearer ${session.accessToken}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      await fetch(`${env.BASE_URL}/api/auth/logout`)

      return Promise.reject(
        new AppError('Token expirado ou inválido. Faça login novamente.'),
      )
    }

    return Promise.reject(error)
  },
)
