'use client'

import { useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

// Icons
import { Search } from 'lucide-react'

export function FormSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') ?? '')

  function handleSeach(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const params = new URLSearchParams(searchParams.toString())

    params.delete('page')

    if (search.length === 0) {
      params.delete('search')
    } else {
      params.set('search', search)
    }

    router.push(`?${params.toString()}`)
  }

  return (
    <form
      onSubmit={(e) => handleSeach(e)}
      className="h-10 flex items-center gap-4"
    >
      <input
        name="search"
        type="text"
        placeholder="O que você procura?"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-[425px] h-full px-4 py-2 text-sm font-medium rounded-md border border-gray-300 placeholder:text-black"
      />
      <button
        type="submit"
        className="h-full w-13 flex items-center justify-center cursor-pointer text-sm rounded-md bg-[#cfd4e5]"
      >
        <Search size={16} />
      </button>
    </form>
  )
}
