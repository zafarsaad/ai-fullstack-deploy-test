import { auth } from "@clerk/nextjs"
import { prisma } from "./db"

export const getUserByClerkID = async (opts = {}) => {
    const { userId } = await auth()

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            clerkId: userId
        },
    })

    return user;
}

// FutureFix 01
// Below we would want to consider using select and includes.
// First attempt like this didn't work as it doesn't like empty User
// What we could do is either initialize those properties as undefined in the beginning
// Or make another variable to hold that data and undefined gets dropped (see 2nd example)

/* export const getUserByClerkID = async (opts = {}) => {
    const { userId } = await auth()

    const user = await prisma.user.findUniqueOrThrow({
        where: {
            clerkId: userId
        },
        select: opts.select || {},
        includes: opts.includes || {},
    })

    return user;
} */

// example 2
/* export const getUserByClerkID = async (opts) => {
    const { userId } = await auth()
    const options = {
        //
        select: opts.select || {},
        includes: opts.includes || {},
    }

    const user = await prisma.user.findUniqueOrThrow()

    return user;
} */
