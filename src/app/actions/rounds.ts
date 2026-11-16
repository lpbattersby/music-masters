'use server'

import { verifySession } from "@/app/lib/auth/dal"
import { getUserByUsername } from "@/app/lib/users"
import { createRound } from "@/app/lib/rounds"
import { createMembership } from "@/app/lib/memberships"
import { FormState, CreateRoundFormSchema } from "@/app/lib/definitions"
import { notFound, redirect } from "next/navigation";

export async function createRoundAction(
  previousState: FormState,
  formData: FormData,
) {
    const validatedFields = CreateRoundFormSchema.safeParse({
      name: formData.get('name'),
      description: formData.get('description'),
      submissionWindowDays: formData.get('submissionWindowDays'),
      votingWindowDays: formData.get('votingWindowDays'),
    })

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
      }
    }
    const { username } = await verifySession()
    const user = await getUserByUsername(username)

    if (!user) {
        redirect('/login')
    }

    const round = await createRound({
        ...validatedFields.data,
        createdBy: user.userId,
    })

    await createMembership({
        groupId: round.roundId,
        userId: user.userId,
    })

    redirect(`/groups/${round.groupId}`)
}
