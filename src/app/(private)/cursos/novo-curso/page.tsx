import { FormCourse } from './form-course'
import { Suspense } from 'react'

export default function NewCourse() {
  return (
    <div className="w-full max-w-7xl xl:mx-auto flex flex-col gap-8 h-screen overflow-hidden">
      <div className="h-full flex flex-col gap-5 p-4 pt-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo Curso</h1>

        <Suspense>
          <FormCourse />
        </Suspense>
      </div>
    </div>
  )
}
