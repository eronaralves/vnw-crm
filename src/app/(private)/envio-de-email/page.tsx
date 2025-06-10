'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { FileDown } from 'lucide-react'
import { Input } from '@/components/input'
import { Button } from '@/components/button'

// Carrega o JoditEditor apenas no client-side
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })

export default function SendEmail() {
  const editor = useRef(null)
  const [content, setContent] = useState('')

  const [emails, setEmails] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleImportClick() {
    if (fileInputRef.current) {
      fileInputRef.current.value = '' // limpa para permitir reupload
      fileInputRef.current.click()
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (files && files.length > 0) {
      const file = files[0]
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result
        if (typeof text === 'string') {
          parseCSV(text)
        }
      }
      reader.readAsText(file)
    }
  }

  function parseCSV(text: string) {
    const lines = text.split(/\r\n|\n/) // separa linhas
    if (lines.length === 0) return

    // Cabeçalho
    const headers = lines[0].split(',')

    // Procura coluna de email
    const emailColIndex = headers.findIndex(h =>
      h.toLowerCase().includes('e-mail'),
    )
    if (emailColIndex === -1) {
      alert('Coluna de email não encontrada no CSV')
      setEmails([])
      return
    }

    const emailsFromCsv: string[] = []

    // Percorre as linhas (pula a primeira)
    for (let i = 1; i < lines.length; i++) {
      const row = lines[i].split(',')

      // Pega o campo email
      const email = row[emailColIndex]?.trim()
      if (email && validateEmail(email)) {
        emailsFromCsv.push(email)
      }
    }

    setEmails(emailsFromCsv)
  }

  // Validação simples de email
  function validateEmail(email: string) {
    const re = /\S+@\S+\.\S+/
    return re.test(email)
  }

  return (
    <div className="flex-1 h-full p-4 overflow-auto">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        accept=".csv"
        multiple={false}
      />

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center">
          <Button
            title="Importar Contatos"
            className="flex-row-reverse"
            onClick={handleImportClick}
          >
            <FileDown size={17} color="#fff" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border-transparent">
            <h3 className="text-[25px] font-bold mb-5">Novo Email</h3>
            <Input placeholder="Assunto" variant='secondary' />
            <div className="mt-2 min-h-[300px]">
              <JoditEditor
                ref={editor}
                value={content}
                onChange={(newContent) => setContent(newContent)}
                config={{
                  minHeight: 700,
                }}
              />
            </div>
          </div>

          <div className="p-4 border border-gray-300 rounded-md min-h-[300px] overflow-auto">
            <h3 className="text-[25px] font-bold mb-5">Destinatários</h3>
            <p>Emails</p>
            {emails.length > 0 ? (
              <ul className="list-disc list-inside max-h-[250px] overflow-auto">
                {emails.map((email, i) => (
                  <li key={i} className="text-sm break-all">
                    {email}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Nenhum email importado ainda.</p>
            )}
          </div>
        </div>
        <div className="p-4 gap-3 flex">
          <button className="bg-[#0f2b92] text-white border-none px-[30px] py-[10px] rounded-[8px] mt-[5px] text-[14px] font-bold font-sans transition-all duration-500 hover:bg-[#ffac2d]">
            Enviar
          </button>
          <button className="bg-[rgba(94,129,244,0.098)] text-[#0f2b92] border-none px-[30px] py-[10px] rounded-[8px] mt-[5px] text-[14px] font-normal font-sans transition-all duration-500">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
