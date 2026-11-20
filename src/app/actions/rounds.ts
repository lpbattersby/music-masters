"use server";

import { getCurrentUser } from "@/app/lib/auth/dal";
import { createRound } from "@/app/lib/rounds";
import { getGroupById } from "@/app/lib/groups";
import { type FormState, CreateRoundFormSchema } from "@/app/lib/form-schemas";
import { notFound, redirect } from "next/navigation";

export async function createRoundAction(
  previousState: FormState,
  formData: FormData,
) {
  const validatedFields = CreateRoundFormSchema.safeParse({
    groupId: formData.get("groupId"),
    name: formData.get("name"),
    description: formData.get("description"),
    submissionDeadline: formData.get("submissionDeadline"),
    votingDeadline: formData.get("votingDeadline"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const user = await getCurrentUser();

  const group = await getGroupById(validatedFields.data.groupId);
  if (!group || group.createdBy !== user.userId) {
    notFound();
  }

  const round = await createRound(validatedFields.data);

  redirect(`/groups/${round.groupId}`);
}
