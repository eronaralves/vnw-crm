import { Send } from 'lucide-react'

// Components
import { Button } from '@/components/button'
import { RowHistorical } from './row-historical'

export type Email = {
  destinatarios: string[]
  subjects: string
  body: string
  data_envio: string
}

const emails: Email[] = [
  {
    subjects: 'Reunião com o time',
    body: 'Alinhar entregas da sprint',
    data_envio: '2025-05-20',
    destinatarios: ['teste@gmail.com'],
  },
  {
    subjects: 'Atualização do projeto',
    body: 'Novas funcionalidades implementadas',
    data_envio: '2025-05-19',
    destinatarios: ['teste@gmail.com', 'ero@gmi.com', 'gb@gmail.com'],
  },
  {
    subjects: 'Feedback do cliente',
    body: 'Comentários sobre a última entrega',
    data_envio: '2024-12-10',
    destinatarios: [],
  },
]

export default function HistoricalEmail() {
  return (
    <div className="flex-1 h-full flex flex-col p-4 overflow-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Histórico de E-mails
        </h1>

        <Button title="Novo e-mail">
          <Send size={16} className="mr-2" />
        </Button>
      </div>

      <div className="flex flex-col divide-y divide-gray-200">
        {emails.map((email, index) => (
          <RowHistorical key={index} email={email} />
        ))}
      </div>
    </div>
  )
}
