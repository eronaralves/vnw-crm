'use server'

import { env } from '@/env'
import { AppError } from '@/utils/app-error'

interface SignInRequest {
  email: string
  password: string
}

export async function signIn({ email, password }: SignInRequest) {
  try {
    const response = await fetch(`${env.BASE_URL}/authentication/login/`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    const data = await response.json()

    if (!response.ok) {
      throw new AppError(data?.detail)
    }

    return {
      data,
    }
  } catch (error) {
    console.log(error)
    const isAppError = error instanceof AppError
    const errorMessage = isAppError
      ? error.detail
      : 'Error ao fazer entrar na conta, tente novamente.'

    return {
      message: errorMessage,
    }
  }
}
