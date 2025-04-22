import { redirect } from 'next/navigation'

// Http
import { getLead } from '@/http/leads/get-lead'
import { ContainerTabsLeads } from './container-tabs-leads'

interface LeadProfile {
  params: Promise<{ id: string }>
}

export default async function LeadProfile({ params }: LeadProfile) {
  const { id } = await params

  const { lead } = await getLead(id)

  if (!lead) {
    return redirect('/leads')
  }

  return (
    <div className="flex-1 h-full flex flex-col overflow-auto">
      <ContainerTabsLeads lead={lead} />
    </div>
  )
}
