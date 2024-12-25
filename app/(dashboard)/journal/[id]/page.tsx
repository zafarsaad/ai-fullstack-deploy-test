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
    include: {
      analysis: true,
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

  return (
    <div className="h-full w-full">
      <Editor entry={entry} />
      {/* using editor as the overall page, FutureFix alpha-coconut */}
    </div>
  )
}

export default EntryPage
