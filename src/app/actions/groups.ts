"use server";

import { getCurrentUser } from "@/app/lib/auth/dal";
import { createGroup, getGroupById } from "@/app/lib/groups";
import { createMembership } from "@/app/lib/memberships";
import { type FormState, CreateGroupFormSchema } from "@/app/lib/form-schemas";
import { notFound, redirect } from "next/navigation";

export async function createGroupAction(
  previousState: FormState,
  formData: FormData,
) {
  const validatedFields = CreateGroupFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    submissionWindowDays: formData.get("submissionWindowDays"),
    votingWindowDays: formData.get("votingWindowDays"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }
  const user = await getCurrentUser();

  const group = await createGroup({
    ...validatedFields.data,
    createdBy: user.userId,
  });

  await createMembership({
    groupId: group.groupId,
    userId: user.userId,
  });

  redirect(`/groups/${group.groupId}`);
}

export async function joinGroupAction(formData: FormData) {
  const user = await getCurrentUser();

  const groupId = formData.get("groupId");
  if (typeof groupId !== "string" || !groupId) {
    notFound();
  }
  const group = await getGroupById(groupId);

  if (!group) {
    notFound();
  }

  await createMembership({
    groupId,
    userId: user.userId,
  });
  redirect(`/groups/${groupId}`);
}
