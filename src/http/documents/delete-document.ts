'use server'

import { api } from '@/lib/axios'

interface DeleteDocumentRequest {
  fileId: string
}

/* eslint no-useless-catch: "off" */
export async function deleteDocument({ fileId }: DeleteDocumentRequest) {
  try {
    await api.delete(`/students/documents/${fileId}`)
  } catch (error) {
    throw error
  }
}
