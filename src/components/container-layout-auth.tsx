import type { ReactNode } from 'react'
import Image, { type StaticImageData } from 'next/image'

interface ContainerLayoutAuthProps {
  background: StaticImageData
  children: ReactNode
}

export function ContainerLayoutAuth({
  background,
  children,
}: ContainerLayoutAuthProps) {
  return (
    <div className="w-full h-screen flex">
      <Image
        src={background}
        alt="Background login"
        width={400}
        priority
        className="hidden lg:flex flex-1 object-cover object-top"
      />

      <div className="w-full h-full lg:w-[732px] flex flex-col">{children}</div>
    </div>
  )
}
