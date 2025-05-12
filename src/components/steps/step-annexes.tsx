'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'

import * as yup from 'yup'

// Icons
import { Upload, Trash2, ImagePlus } from 'lucide-react'

// Components
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useFormContext } from 'react-hook-form'

type FileUpload = File & {
  document?: string
}

export const formAnnexesSchema = yup.object({
  documents: yup.array().of(yup.mixed<FileUpload>()),
})

export type FormAnnexesType = yup.InferType<typeof formAnnexesSchema>

interface StepAnnexesProps {
  isEditing?: boolean
}

export function StepAnnexes({ isEditing = true }: StepAnnexesProps) {
  const { setValue, watch } = useFormContext<FormAnnexesType>()
  const watchDocuments = watch('documents') as FileUpload[]

  const [files, setFiles] = useState<FileUpload[]>([])
  const [profileImage, setProfileImage] = useState<FileUpload | null>(null)

  const onDropFiles = useCallback(
    (accepted: FileUpload[]) => {
      const filesUpload = [...files, ...accepted]

      setValue('documents', filesUpload, { shouldValidate: true })
    },
    [files, setValue],
  )

  const refInputProfileImage = useRef<HTMLInputElement | null>(null)
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropFiles,
    multiple: true,
    disabled: !isEditing,
  })

  function handleRemoveFile(index: number) {
    const removeFile = files.filter((_, i) => i !== index)

    setValue('documents', removeFile, { shouldValidate: true })
  }

  function handleProfileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]

    if (file && file.type.startsWith('image/')) {
      setProfileImage(file)
    } else {
      setProfileImage(null)
    }
  }

  function handleRemoveProfile() {
    setProfileImage(null)
  }

  useEffect(() => {
    setFiles(watchDocuments ?? [])
  }, [watchDocuments])

  return (
    <div className="w-full h-full flex-1 flex flex-wrap sm:flex-nowrap gap-6 overflow-hidden ">
      <div className="w-full max-w-[400px] flex flex-col space-y-4">
        <div className="w-full">
          <div className="flex flex-col gap-2">
            <span
              onClick={() => isEditing && refInputProfileImage.current?.click()}
              className="text-sm font-medium"
            >
              Foto de perfil
            </span>

            <div className="relative w-24 h-24 group">
              {profileImage ? (
                <>
                  <img
                    src={URL.createObjectURL(profileImage)}
                    alt="Preview"
                    onClick={() =>
                      isEditing && refInputProfileImage.current?.click()
                    }
                    className="w-24 h-24 rounded-full object-cover border cursor-pointer"
                  />

                  <Button
                    size="icon"
                    variant="ghost"
                    type="button"
                    aria-label="Remover imagem"
                    onClick={handleRemoveProfile}
                    className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 bg-white shadow-md rounded-full p-1 hover:bg-destructive hover:text-white transition cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <div
                  onClick={() =>
                    isEditing && refInputProfileImage.current?.click()
                  }
                  className="w-24 h-24 flex items-center justify-center border rounded-full bg-muted cursor-pointer hover:bg-muted/70 transition"
                >
                  <ImagePlus className="w-6 h-6 text-muted-foreground" />
                </div>
              )}
            </div>

            <input
              ref={refInputProfileImage}
              type="file"
              id="profile-image"
              accept="image/*"
              onChange={handleProfileChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="w-full flex flex-col gap-2 overflow-auto">
          <h2 className="text-lg font-semibold">Documentos</h2>

          {files?.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum arquivo selecionasdo
            </p>
          ) : (
            <ul className="flex-1 h-full space-y-2">
              {files?.map((file, index) => (
                <li
                  key={index}
                  className="w-full max-w-[380px] flex items-center justify-between border p-2 rounded-md bg-muted text-sm"
                >
                  <a
                    href={
                      file.document ? file.document : URL.createObjectURL(file)
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate hover:underline"
                  >
                    {file.document
                      ? file.document.split('documents/')[1]
                      : file.name}
                  </a>

                  <Button
                    size="icon"
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveFile(index)}
                    className="cursor-pointer"
                    disabled={!isEditing}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex-1 col-span-3 flex flex-col items-center justify-center space-y-6">
        <Card
          {...getRootProps()}
          className={`w-full max-w-lg h-32 flex items-center justify-center border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
            isDragActive ? 'border-primary bg-muted' : 'border-gray-300'
          } ${isEditing ? 'cursor-pointer' : 'cursor-not-allowed bg-muted'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-6 w-6 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Arraste os documentos aqui ou clique para selecionar
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
