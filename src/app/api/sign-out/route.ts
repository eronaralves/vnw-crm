import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookie = await cookies()
  cookie.delete('session')

  return NextResponse.json({ success: true })
}
