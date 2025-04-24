'use client'

import { signOut } from '@/http/auth/sign-out'
// Icons
import { LogOut } from 'lucide-react'

export function ButtonSignOutSidebar() {
  return (
    <button
      className="w-full cursor-pointer mt-6 flex items-center gap-8 p-4 duration-300 group hover:bg-[#F5F5FA]"
      onClick={signOut}
    >
      <LogOut size={22} className="text-red-500" />
      <span className="duration-300 group-hover:text-red-500">Sair</span>
    </button>
  )
}
