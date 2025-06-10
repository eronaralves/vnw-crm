import { Suspense } from 'react'

// Components
import { ListLeads } from './list-leads'

export default function Leads() {
  return (
    <div className="flex-1 h-full flex flex-col p-4 overflow-auto ">
      <div className="h-screen flex flex-col overflow-hidden">
        <Suspense>
          <ListLeads />
        </Suspense>
      </div>
    </div>
  )
}
