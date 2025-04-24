'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function signOut() {
  const cookie = await cookies()
  cookie.delete('session')

  redirect('/sign-in')
}