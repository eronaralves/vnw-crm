'use client'

import { useRouter, useSearchParams } from 'next/navigation'

// Icons
import { ChevronsLeft, ChevronsRight, Loader2 } from 'lucide-react'

// Components
import {
  Pagination as PaginationUi,
  PaginationContent,
  PaginationLink,
  PaginationItem,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export const LIMIT_PER_PAGE = 7

interface PaginationProps {
  pageIndex: number
  totalCount: number
  className?: string
  isLoading: boolean
  perPage?: number
}

function getPaginationRange(
  currentPage: number,
  totalPages: number,
  maxButtons = 5,
): number[] {
  let start = Math.max(currentPage - Math.floor(maxButtons / 2), 1)
  let end = start + maxButtons - 1

  if (end > totalPages) {
    end = totalPages
    start = Math.max(end - maxButtons + 1, 1)
  }

  const range = []
  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  return range
}

export function Pagination({
  isLoading,
  pageIndex,
  perPage,
  totalCount,
  className,
}: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())

  const totalPages = Math.ceil(totalCount / (perPage ?? LIMIT_PER_PAGE)) || 1
  const currentPage = Number(pageIndex) ?? 1

  useEffect(() => {
    params.delete('page')
    router.push(`?${params.toString()}`)
  }, [])

  function onPageChange(page: number) {
    params.set('page', page.toString())
    router.push(`?${params.toString()}`)
  }

  const pages = getPaginationRange(currentPage, totalPages)

  return (
    <div className={`flex justify-center ${className}`}>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || isLoading}
          title="Primeira Página"
        >
          <ChevronsLeft className="w-4 h-4 mr-1" />
          Primeira
        </Button>

        <PaginationUi>
          <PaginationContent className="flex gap-4">
            {isLoading ? (
              <PaginationItem>
                <Loader2 size={16} className="animate-spin" />
              </PaginationItem>
            ) : (
              pages.map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={page === currentPage}
                    onClick={() => onPageChange(page)}
                    className={`cursor-pointer border border-zinc-200  ${page === currentPage ? 'bg-[#CFD4E5] hover:bg-[#CFD4E5]' : ''}`}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))
            )}
          </PaginationContent>
        </PaginationUi>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages || isLoading}
          title="Última Página"
        >
          Última
          <ChevronsRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}
