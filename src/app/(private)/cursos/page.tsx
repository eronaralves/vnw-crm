// Components
import { ListCourses } from './list-courses'

export default async function Cursos() {
  return (
    <div className="flex-1 h-full flex flex-col p-4 overflow-auto">
      <div className="flex-1">
        <ListCourses />
      </div>
    </div>
  )
}
