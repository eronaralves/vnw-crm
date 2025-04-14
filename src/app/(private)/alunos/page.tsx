import { Suspense } from 'react'

// Components
import { ListStudent } from './list-students'
import { FormSearch } from '../../../components/form-search'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function Alunos() {
  return (
    <div className="flex-1 h-full flex flex-col p-4 overflow-auto">
      <Tabs defaultValue="Cursando" className="flex-1">
        <div className="w-full flex gap-3 flex-wrap items-center justify-between">
          <TabsList className="border-b border-gray-200">
            <TabsTrigger
              value="Cursando"
              className="data-[state=active]:border-0 data-[state=active]:rounded-none data-[state=active]:text-[#173A92] data-[state=active]:border-[#7a82a7] p-4 text-sm "
            >
              Cursando
            </TabsTrigger>

            <TabsTrigger
              value="Evadidos"
              className="data-[state=active]:border-0 data-[state=active]:rounded-none data-[state=active]:text-[#173A92] data-[state=active]:border-[#7a82a7] p-4 text-sm "
            >
              Evadidos
            </TabsTrigger>
            <TabsTrigger
              value="Reprovados"
              className="data-[state=active]:border-0 data-[state=active]:rounded-none data-[state=active]:text-[#173A92] data-[state=active]:border-[#7a82a7] p-4 text-sm "
            >
              Reprovados
            </TabsTrigger>
            <TabsTrigger
              value="Formados"
              className="data-[state=active]:border-0 data-[state=active]:rounded-none data-[state=active]:text-[#173A92] data-[state=active]:border-[#7a82a7] p-4 text-sm"
            >
              Formados
            </TabsTrigger>
          </TabsList>

          <Suspense>
            <FormSearch />
          </Suspense>
        </div>

        <TabsContent
          value="Cursando"
          className="pt-4 flex-1 h-full flex flex-col gap-10 "
        >
          <Suspense>
            <ListStudent status="Cursando" />
          </Suspense>
        </TabsContent>
        <TabsContent value="Evadidos" className="pt-4 flex-1 h-full ">
          <Suspense>
            <ListStudent status="Evadiu" />
          </Suspense>
        </TabsContent>
        <TabsContent
          value="Reprovados"
          className="pt-4 flex-1 h-full flex flex-col gap-10 "
        >
          <Suspense>
            <ListStudent status="Reprovado" />
          </Suspense>
        </TabsContent>
        <TabsContent
          value="Formados"
          className="pt-4 flex-1 h-full flex flex-col gap-10 "
        >
          <Suspense>
            <ListStudent status="Formado" />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  )
}
