'use server'

import { verifySession } from "@/app/lib/auth/dal"
import { getUserByUsername } from "@/app/lib/users"
import { createGroup } from "@/app/lib/groups"
import { createMembership } from "@/app/lib/memberships"
import { redirect } from "next/navigation"
import { FormState, CreateGroupFormSchema } from "@/app/lib/definitions"

export async function createGroupAction(
  previousState: FormState,
  formData: FormData,
) {
    const validatedFields = CreateGroupFormSchema.safeParse({
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

    const group = await createGroup({
        ...validatedFields.data,
        createdBy: user.userId,
    })

    await createMembership({
        groupId: group.groupId,
        userId: user.userId,
    })

    redirect(`/groups/${group.groupId}`)
}

