'use client'

import { ptBR } from 'date-fns/locale'
import { format, parseISO, isSameYear } from 'date-fns'
import { useRouter } from 'next/navigation'
import type { Email } from './page'

interface RowHistorical {
  email: Email
}

export function RowHistorical({ email }: RowHistorical) {
  const router = useRouter()

  function formatterData(dataISO: string): string {
    const data = parseISO(dataISO)
    const hoje = new Date()

    if (isSameYear(data, hoje)) {
      return format(data, 'dd MMM', { locale: ptBR })
    } else {
      return format(data, 'dd/MM/yyyy')
    }
  }

  function handleSendToSendingEmail() {
    sessionStorage.setItem(
      '@vnw:historical',
      JSON.stringify({
        subjects: email.subjects,
        body: email.body,
        data_envio: email.data_envio,
        destinatarios: email.destinatarios,
      }),
    )

    router.push(`emails/novo-email?historical`)
  }

  return (
    <div
      className="flex items-center gap-8 px-4 py-3 border-t border-b border-transparent hover:border-t-gray-200 hover:border-b-gray-300 hover:shadow-sm transition duration-200 ease-in-out cursor-pointer"
      onClick={handleSendToSendingEmail}
      tabIndex={0}
    >
      <div className="w-48">
        <p className="text-sm font-semibold text-gray-800 truncate">
          {email.subjects}
        </p>
      </div>

      <div className="flex-1 min-w-0 px-4">
        <p className="text-sm text-gray-600 truncate">
          {email.body}
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam
          obcaecati ad consequuntur repudiandae minus ea, reiciendis beatae
          illum culpa facilis accusamus. Sequi, doloribus amet fugiat quam
          consequatur nobis consectetur nisi?
        </p>
      </div>

      <div className="w-20 flex justify-end">
        <span className="text-xs font-bold text-gray-700 text-right capitalize">
          {formatterData(email.data_envio)}
        </span>
      </div>
    </div>
  )
}
