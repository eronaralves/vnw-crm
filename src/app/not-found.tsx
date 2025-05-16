'use client'

import Link from 'next/link'
import { SideBar } from '@/components/sidebar'
import { Button } from '@/components/ui/button'

export default function Custom404() {
  return (
    <div className="w-full h-screen flex overflow-hidden bg-white text-gray-900">
      <SideBar />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-9xl font-extrabold text-[#1E3A8A] transform -rotate-6">
            4
          </span>
          <span className="text-9xl font-extrabold text-[#F97316]">0</span>
          <span className="text-9xl font-extrabold text-[#1E3A8A] transform rotate-6">
            4
          </span>
        </div>
        <h2 className="mt-4 text-2xl font-semibold text-[#1E3A8A]">
          Oops! Página não encontrada.
        </h2>
        <p className="mt-2 text-gray-600">
          A página que você está procurando pode ter sido removida ou está
          temporariamente indisponível.
        </p>
        <Link href="/" passHref>
          <Button className="mt-6 bg-[#F97316] text-white hover:bg-[#ea580c]">
            Voltar para a página inicial
          </Button>
        </Link>
      </div>
    </div>
  )
}
