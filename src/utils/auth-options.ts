import type { NextAuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

// Ultils
import { AppError } from '@/utils/app-error'

import { decode } from 'jsonwebtoken'
import { signIn } from '@/http/auth/sign-in'

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/sign-in',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'email@exemplo.com',
        },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) {
          throw new AppError('Credentials')
        }

        const response = await signIn({
          email: credentials.email,
          password: credentials.password,
        })

        if (response.message) {
          throw new Error(response.message)
        }

        const decodeToken = decode(response.data?.access) as {
          user_id: string
        }

        const user = {
          id: decodeToken.user_id,
          token: response.data?.access,
        }

        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update') {
        token.user = {
          ...session,
        }
      }

      if (user) {
        token.accessToken = user.token
      }

      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.user = token.user as User

      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
}
