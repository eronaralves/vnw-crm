'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Icons
import { Eye, EyeClosed, Mail, Loader2 } from 'lucide-react'

import { toast } from 'sonner'
import { signIn } from 'next-auth/react'

import * as yup from 'yup'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

// Components
import { Input } from '@/components/input'

const SignInSchema = yup.object().shape({
  email: yup
    .string()
    .email('Digite um email válido.')
    .required('Digite seu email.'),
  password: yup
    .string()
    .required('Digite sua senha.')
    .min(6, 'Mínino de 6 caractéres'),
})

type SignInType = yup.InferType<typeof SignInSchema>

export function FormSignIn() {
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInType>({
    resolver: yupResolver(SignInSchema),
  })

  const router = useRouter()

  async function onSubmit(data: SignInType) {
    const { email, password } = data
    const response = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (response?.error) {
      const errorMessage = response.error

      return toast.error(errorMessage, {
        position: 'top-center',
      })
    }

    router.replace('/leads')
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-96 flex flex-col gap-3 mt-8"
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-md text-[#0f2b92]">Email</label>
          <Input
            type="email"
            placeholder="Digite o email"
            icon={Mail}
            {...register('email')}
          />

          {errors.email && (
            <span className="text-xs font-semibold text-red-500">
              {errors.email.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-md text-[#0f2b92]">Senha</label>
          <Input
            placeholder="Digite o senha"
            type={showPassword ? 'text' : 'password'}
            icon={showPassword ? EyeClosed : Eye}
            handleIcon={() => setShowPassword((prev) => !prev)}
            {...register('password')}
          />
          {errors.password && (
            <span className="text-xs font-semibold text-red-500">
              {errors.password.message}
            </span>
          )}
        </div>
      </div>

      <div className="ml-auto">
        <Link href="/" className="text-sm text-[#0f2b92]">
          Esqueci a senha
        </Link>
      </div>

      <button className="mt-4 p-2 rounded-md flex justify-center cursor-pointer text-white font-semibold bg-[#0f2b92]">
        {isSubmitting ? <Loader2 className="animate-spin" /> : 'Entrar'}
      </button>

      <span className="mt-9 text-xs font-normal text-[#8181a5]">
        Esse sistema está em conformidade com a <strong>LGPD</strong>.
      </span>
    </form>
  )
}
