import { Suspense } from 'react'
import { ListCourses } from './list-courses'

export default function Courses() {
  return (
    <div className="flex flex-col gap-8 h-screen p-4 ">
      <Suspense>
        <ListCourses />
      </Suspense>
    </div>
  )
}
