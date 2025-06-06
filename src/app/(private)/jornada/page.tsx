import { Suspense } from 'react'
import { ListJourney } from './list-journey'

export default function Journey() {
  return (
    <div className="flex-1 h-full flex flex-col p-4 overflow-auto">
      <Suspense>
        <ListJourney />
      </Suspense>
    </div>
  )
}
