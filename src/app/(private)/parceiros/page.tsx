import { Suspense } from 'react'

// Components
import { ListPartners } from './list-partners'

export default async function Parceiros() {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <Suspense>
        <ListPartners />
      </Suspense>
    </div>
  )
}
