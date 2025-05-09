import { Suspense } from 'react'

// Components
import { ListAdmins } from './list-admins'

export default function Admins() {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <Suspense>
        <ListAdmins />
      </Suspense>
    </div>
  )
}
