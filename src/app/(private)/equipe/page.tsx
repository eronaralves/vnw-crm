import { Suspense } from 'react'
import { ListTeam } from './list-teams'

export default function Teams() {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <Suspense>
        <ListTeam />
      </Suspense>
    </div>
  )
}
