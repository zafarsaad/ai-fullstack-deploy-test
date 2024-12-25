import { analyze } from "@/utils/ai"
import { getUserByClerkID } from "@/utils/auth"
import { prisma } from "@/utils/db"
import { NextResponse } from "next/server"

export const PATCH = async (request: Request, { params }) => {
    const { content } = await request.json()
    const user = await getUserByClerkID()
    const updatedEntry = await prisma.journalEntry.update({
        where: {
            id: params.id
        },
        data: {
            content
        }
    })

    const analysis = await analyze(updatedEntry.content)

    // we initially used update, but to account for those that are missing...using upsert
    await prisma.analysis.upsert({
        where: {
            entryId: updatedEntry.id,
        },
        create: {
            entryId: updatedEntry.id,
            ...analysis
        },
        update: analysis
    })

    if (updatedEntry.userId !== user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    return NextResponse.json({ data: updatedEntry })
}