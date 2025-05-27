'use client'

import dynamic from 'next/dynamic'

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })

interface EditorProps {
  content: string
  setContent: (value: string) => void
  placeholder?: string
}

export function EditorText({
  content,
  setContent,
  placeholder = '',
}: EditorProps) {
  const config = {
    readonly: false,
    language: 'pt_br',
    uploader: {
      insertImageAsBase64URI: true,
      imageDefaultWidth: 500,
    },
    placeholder,
  }

  return (
    <JoditEditor
      value={content}
      config={{
        ...config,
        minHeight: 500,
      }}
      onBlur={(newContent) => {
        setContent(newContent)
      }}
    />
  )
}
