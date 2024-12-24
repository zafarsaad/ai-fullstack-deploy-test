import Editor from '@/components/Editor'
import { getUserByClerkID } from '@/utils/auth'
import { prisma } from '@/utils/db'

const getEntry = async (id) => {
  const user = await getUserByClerkID()

  const entry = await prisma.journalEntry.findFirst({
    where: {
      userId: user.id,
      id: id,
    },
  })

  // for Prisma using PlanetScale this was needed along with:
  // @@unique([userId, id]) in the schema.prisma under JournalEntry

  /* const entry = await prisma.journalEntry.findUnique({
    where: {
      userId_id: {
        userId: user.id,
        id,
      },
    },
  }) */

  return entry
}

const EntryPage = async ({ params }) => {
  const entry = await getEntry(params.id)
  const analysisData = [
    { name: 'Summary', value: '' },
    { name: 'Subjec', value: '' },
    { name: 'Mood', value: '' },
    { name: 'Negative', value: 'False' },
  ]

  return (
    <div className="h-full w-full grid grid-cols-3">
      <div className="col-span-2">
        <Editor entry={entry} />
      </div>
      <div className="border-l border-black/10">
        <div className="bg-blue-600 px-6 py-10">
          <h2 className="text-2xl">Analysis</h2>
        </div>
        <ul>
          {analysisData.map((item) => (
            <li
              className="flex items-center justify-between px-2 py-4 border-b border-t border-black/10"
              key={item.name}
            >
              <span className="text-lg font-semibold">{item.name}</span>
              <span>{item.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default EntryPage
