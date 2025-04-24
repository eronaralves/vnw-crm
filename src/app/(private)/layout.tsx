import type { ReactNode } from 'react'

// Components
import { SideBar } from '@/components/sidebar'

interface LayoutPrivateRoute {
  children: ReactNode
}

export default async function LayoutPrivateRoute({
  children,
}: LayoutPrivateRoute) {

  return (
    <div className="w-full h-screen flex overflow-hidden">
      <SideBar />
      <div className="w-full h-full flex-1 overflow-hidden">{children}</div>
    </div>
  )
}
