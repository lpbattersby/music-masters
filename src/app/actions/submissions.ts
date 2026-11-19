"use server";

import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/auth/dal";
import { getRoundState, RoundState } from "@/app/lib/helpers";
import { isUserMemberOfGroup } from "@/app/lib/groups";
import { getRoundById } from "@/app/lib/rounds";
import { upsertSongSubmission } from "@/app/lib/submissions";
import { type FormState, SubmitSongFormSchema } from "@/app/lib/form-schemas";

export async function submitSongAction(
  previousState: FormState,
  formData: FormData,
) {
  const validatedFields = SubmitSongFormSchema.safeParse({
    roundId: formData.get("roundId"),
    songUrl: formData.get("songUrl"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const user = await getCurrentUser();
  const round = await getRoundById(validatedFields.data.roundId);

  if (!round || !(await isUserMemberOfGroup(round.groupId, user.userId))) {
    notFound();
  }

  if (getRoundState(round) !== RoundState.Submitting) {
    return {
      errors: {
        songUrl: ["The submission deadline has passed."],
      },
    };
  }

  await upsertSongSubmission({
    roundId: round.roundId,
    userId: user.userId,
    songUrl: validatedFields.data.songUrl,
  });

  redirect(`/groups/${round.groupId}`);
}
