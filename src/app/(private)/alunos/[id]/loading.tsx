import Image from 'next/image'
import AnimationLoading from '@/assets/animations/loading-profile.gif'

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <Image src={AnimationLoading} alt="" priority className="w-32 h-32" />
      <p className="mt-4 text-lg text-gray-600">
        Carregando perfil do aluno...
      </p>
    </div>
  )
}
