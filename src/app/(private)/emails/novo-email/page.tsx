'use client'

import { Suspense, useState } from 'react'

import { Input } from '@/components/input'
import { Button } from '@/components/button'
import { FileUp } from 'lucide-react'
import { EditorText } from '@/components/editor-text'

export default function NewEmail() {
  const [formSendEmail, setFormSendEmail] = useState()

  return (
    <div className="flex-1 h-full flex flex-col gap-4 p-4 overflow-hidden">
      <Button title="Importar planilha" className="self-start">
        <FileUp size={18} fill="#fff" color="#0f2b92" />
      </Button>

      <div className="h-full grid grid-cols-2 bg-background">
        <div className="h-full flex flex-col">
          <h1>Novo e-mail</h1>

          <div className="flex flex-col gap-2 overflow-hidden">
            <Input variant="secondary" placeholder="Assunto" />
            <EditorText content="" setContent={() => {}} />
          </div>

          <div className="mt-auto flex items-center gap-4">
            <Button title="Enviar" />
            <Button variant="secondary" title="Cancelar" />
          </div>
        </div>

        <div></div>
      </div>
    </div>
  )
}
