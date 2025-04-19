import { Suspense } from 'react'

// Components
import { ListCourses } from './list-courses'

export default async function Courses() {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <Suspense>
        <ListCourses />
      </Suspense>
    </div>
  )
}
