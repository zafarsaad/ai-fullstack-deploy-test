'use client'

import { createNewEntry } from '@/utils/api'
import { useRouter } from 'next/navigation'

const NewEntryCard = () => {
  const router = useRouter()

  const handleOnClick = async () => {
    const { data } = await createNewEntry()
    router.push(`/journal/${data.id}`)
    // lesson-july-amber
    // lesson here is we could use router.replace to stop them going back to where user was i.e. on a modal
    // if user goes back we don't need to open modal as it isn't great UX
  }

  return (
    <div className="cursor-pointer overflow-hidden rounded-lg bg-white shadow">
      <div className="px-4 py-5 sm:p-6" onClick={handleOnClick}>
        <span className="text-3xl">New Entry</span>
      </div>
    </div>
  )
}

export default NewEntryCard
