import Image from 'next/image'

// Images
import Logo from '@/assets/images/heading-sidebar.png'

// Components
import { ManuNavLinks } from './menu-nav-links'
import { ButtonSignOutSidebar } from './button-sign-out-sidebar'

export function SideBar() {
  return (
    <div className="w-full h-full overflow-auto flex flex-col max-w-[250px] min-w-[250px] bg-white">
      <Image
        src={Logo}
        alt="Logo do Vai na Web"
        className="w-full h-[71px] object-cover"
        priority
      />

      <div className="h-full flex flex-col">
        <ManuNavLinks />

        <div className="mt-auto">
          <ButtonSignOutSidebar />
        </div>
      </div>
    </div>
  )
}
