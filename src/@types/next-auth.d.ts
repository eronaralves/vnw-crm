import 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    token: string
  }

  interface Session {
    accessToken: string
    user: User
  }
}
