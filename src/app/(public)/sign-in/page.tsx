import Image from 'next/image'

// Images
import BackgroundLogin from '@/assets/images/background-login.png'
import Logo from '@/assets/images/logo.svg'

// Components
import { FormSignIn } from './form-sign-in'
import { ContainerLayoutAuth } from '@/components/container-layout-auth'

export default function SignIn() {
  return (
    <ContainerLayoutAuth background={BackgroundLogin}>
      <div className="flex-1 flex flex-col justify-center items-center px-4 md:px-8 py-8">
        <div className="w-full max-w-[500px] flex flex-col justify-center">
          <Image
            src={Logo}
            alt="Logo Vai na Web"
            className="mx-auto mb-15"
            priority
          />

          <h1 className="text-xl lg:text-3xl font-bold mb-4">
            Bem-vindo ao nosso CRM. Entre para ver as atualizações mais
            recentes.
          </h1>

          <span className="font-light text-[#8181a5] text-sm">
            Insira seus dados para prosseguir
          </span>

          <FormSignIn />
        </div>
      </div>
    </ContainerLayoutAuth>
  )
}
