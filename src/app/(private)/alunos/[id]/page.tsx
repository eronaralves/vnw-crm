import { redirect } from 'next/navigation'

// Http
import { getStudent } from '@/http/students/get-student'

// Components
import { ContainerTabs } from './container-tabs'

type Params = Promise<{ id: string }>

export default async function StudentProfile(props: { params: Params }) {
  const params = await props.params
  const { student } = await getStudent(params.id)

  if (!student) {
    return redirect('/alunos')
  }

  return (
    <div className="flex-1 h-full flex flex-col overflow-auto">
      <ContainerTabs student={student} />
    </div>
  )
}
