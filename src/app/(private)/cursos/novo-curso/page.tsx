import { FormCourse } from './form-course'
import { Suspense } from 'react'

export default function NewCourse() {
  return (
    <div className="h-screen flex flex-col overflow-auto p-4">
      <div>
        <h1>Criar Novo Curso</h1>
      </div>

      <Suspense>
        <FormCourse />
      </Suspense>
    </div>
  )
}
