import { Suspense } from 'react'

// Components
import { ListPartners } from './list-partners'

export default async function Parterns() {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <Suspense>
        <ListPartners />
      </Suspense>
    </div>
  )
}
