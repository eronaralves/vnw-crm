'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// Icons
import { BookOpen, GraduationCap, Users } from 'lucide-react'

export function ManuNavLinks() {
  const pathname = usePathname()

  const menuItems = [
    {
      label: 'Leads',
      href: '/leads',
      icon: Users,
    },
    {
      label: 'Alunos',
      href: '/alunos',
      icon: GraduationCap,
    },
    {
      label: 'Cursos',
      href: '/cursos',
      icon: BookOpen,
    },
  ]

  return (
    <nav className="flex-1 ">
      {menuItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname.includes(item.href)

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`w-full flex items-center gap-8 p-4 duration-300 group ${isActive ? 'bg-[#F5F5FA]' : 'bg-white'} `}
          >
            <Icon size={22} fill="#173A92" color="#173A92" />
            <span
              className={`duration-300  ${isActive ? 'text-[#FF611E]' : '#173A92'} group-hover:text-[#FF611E]`}
            >
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
