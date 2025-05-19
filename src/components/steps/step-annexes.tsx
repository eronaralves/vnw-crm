'use client'

import { useState, useCallback, useRef } from 'react'
import { useDropzone, type FileRejection } from 'react-dropzone'
import * as yup from 'yup'

import { useFormContext } from 'react-hook-form'
import { toast } from 'sonner'

// Icons
import { Upload, Trash2, ImagePlus, Loader2 } from 'lucide-react'

// Utils
import { AppError } from '@/utils/app-error'

// Http
import { deleteDocument } from '@/http/documents/delete-document'
import { registerDocuments } from '@/http/documents/register-documents'

// Components
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

type FileUpload =
  | File
  | {
      id: string
      document: string
    }

export const formAnnexesSchema = yup.object({
  documents: yup.array().of(yup.mixed<FileUpload>()),
  profile_picture: yup.string().nullable(),
})

export type FormAnnexesType = yup.InferType<typeof formAnnexesSchema>

interface StepAnnexesProps {
  studentId?: string
  isEditing?: boolean
}

export function StepAnnexes({ studentId, isEditing = true }: StepAnnexesProps) {
  const { watch, setValue } = useFormContext<FormAnnexesType>()
  const watchDocuments = watch('documents') as FileUpload[]
  const watchProfilePicture = watch('profile_picture') ?? null

  const [files, setFiles] = useState<FileUpload[]>(watchDocuments ?? [])
  const [profileImage, setProfileImage] = useState<File | string | null>(
    watchProfilePicture,
  )
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [removingFileIds, setRemovingFileIds] = useState<string[]>([])

  const onDropFiles = useCallback(
    async (accepted: File[]) => {
      // check if I am editing files of an existing user
      if (studentId) {
        setIsUploading(true)
        setUploadProgress(0)

        for (let i = 0; i < accepted.length; i++) {
          const fileAccepted = accepted[i]
          try {
            const formData = new FormData()
            formData.append('document', fileAccepted)
            formData.append('students', studentId)

            const { file } = await registerDocuments(formData)

            setFiles((prev) => [
              ...prev,
              { id: file.id, document: file.document },
            ])

            setUploadProgress(Math.round(((i + 1) / accepted.length) * 100))
          } catch (error) {
            toast.error(`Erro ao enviar ${fileAccepted.name}`, {
              duration: 3000,
              position: 'top-center',
            })
          }
        }

        setTimeout(() => {
          setIsUploading(false)
        }, 300)

        // setIsUploading(false)
      } else {
        setValue('documents', [...files, ...accepted])
        setFiles((prev) => [...prev, ...accepted])
      }
    },
    [studentId, files, setValue],
  )

  const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
    const errorTooManyFiles = fileRejections.find(
      (reject) => reject.errors[0].code === 'too-many-files',
    )

    if (errorTooManyFiles) {
      toast.error(`Número máximo de arquivos excedido (5 arquivos).`, {
        duration: 3000,
        position: 'top-center',
      })
    }

    const errorsFileTooLarge = fileRejections.filter(
      (reject) => reject.errors[0].code === 'file-too-large',
    )

    errorsFileTooLarge.forEach((reject) => {
      toast.error(
        `O arquivo ${reject.file.name} ultrapassa o tamanho máximo permitido (4MB).`,
        {
          duration: 3000,
          position: 'top-center',
        },
      )
    })
  }, [])

  const refInputProfileImage = useRef<HTMLInputElement | null>(null)
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropFiles,
    onDropRejected,
    multiple: true,
    disabled: !isEditing || isUploading,
    maxFiles: 5,
    maxSize: 4 * 1024 * 1024, // 4 MB
  })

  async function handleRemoveFile(fileIdOrName: string) {
    const file = files.find((f) =>
      f instanceof File ? f.name === fileIdOrName : f.id === fileIdOrName,
    )!

    // checks if the selected file is a file coming from the api
    if (!(file instanceof File)) {
      setRemovingFileIds((prev) => [...prev, fileIdOrName])

      try {
        await deleteDocument({ fileId: file.id })

        setFiles((prev) =>
          prev.filter((f) =>
            f instanceof File ? f.name !== fileIdOrName : f.id !== fileIdOrName,
          ),
        )
      } catch (error) {
        const isAppError = error instanceof AppError
        const errorMessage = isAppError
          ? error.detail
          : 'Erro ao deletar documento, tente novamente!'

        toast.error(errorMessage, {
          duration: 3000,
          position: 'top-center',
        })
      } finally {
        setRemovingFileIds((prev) => prev.filter((id) => id !== fileIdOrName))
      }
    } else {
      const removeFile = files.filter((f) =>
        f instanceof File ? f.name !== fileIdOrName : f.id !== fileIdOrName,
      )

      setValue('documents', removeFile)
      setFiles(removeFile)
    }
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

  return (
    <div className="w-full h-full flex-1 flex flex-wrap sm:flex-nowrap gap-6 overflow-hidden">
      <div className="w-full max-w-[400px] flex flex-col space-y-4">
        <div className="w-full">
          <div className="flex flex-col gap-2">
            <span
              onClick={() => isEditing && refInputProfileImage.current?.click()}
              className="text-sm font-medium cursor-pointer"
            >
              Foto de perfil
            </span>

            <div className="relative w-24 h-24 group">
              {profileImage ? (
                <>
                  <Image
                    src={
                      profileImage instanceof File
                        ? URL.createObjectURL(profileImage)
                        : profileImage
                    }
                    alt="Foto de perfil"
                    onClick={() =>
                      isEditing && refInputProfileImage.current?.click()
                    }
                    width={96}
                    height={96}
                    priority
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
              Nenhum arquivo selecionado
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
                      file instanceof File
                        ? URL.createObjectURL(file)
                        : file.document
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="truncate hover:underline"
                  >
                    {file instanceof File
                      ? file.name
                      : file.document
                          ?.split('documents/')[1]
                          .replace(/_[^_]+\.(\w+)$/, '.$1')}
                  </a>

                  <Button
                    size="icon"
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      handleRemoveFile(
                        file instanceof File ? file.name : file.id,
                      )
                    }
                    className="cursor-pointer"
                    disabled={
                      !isEditing ||
                      removingFileIds.includes(
                        file instanceof File ? file.name : file.id,
                      )
                    }
                  >
                    {removingFileIds.includes(
                      file instanceof File ? file.name : file.id,
                    ) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 text-destructive" />
                    )}
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

        {isUploading && (
          <div className="w-full max-w-lg mt-4">
            <div className="relative w-full h-2 bg-gray-200 rounded">
              <div
                className="absolute top-0 left-0 h-2 bg-blue-500 rounded transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600 mt-1 text-center">
              {uploadProgress}%
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
