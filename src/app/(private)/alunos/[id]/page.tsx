import { redirect } from 'next/navigation'

// Http
import { getStudent } from '@/http/students/get-student'

// Components
import { ContainerTabs } from './container-tabs'

interface Student {
  params: Promise<{ id: string }>
}

export default async function Student({ params }: Student) {
  const { id } = await params
  const { student } = await getStudent(id)

  if (!student) {
    return redirect('/alunos')
  }

  return (
    <div className="flex-1 h-full flex flex-col overflow-auto">
      <ContainerTabs student={student} />
    </div>
  )
}
