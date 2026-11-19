import { and, eq } from "drizzle-orm";
import { getDb } from "@/app/lib/db";
import { songSubmissions, type SongSubmission } from "@/app/lib/schema";

export async function getSongSubmissionByRoundAndUser(
  roundId: string,
  userId: string,
): Promise<SongSubmission | undefined> {
  const db = await getDb();
  const [submission] = await db
    .select()
    .from(songSubmissions)
    .where(
      and(
        eq(songSubmissions.roundId, roundId),
        eq(songSubmissions.userId, userId),
      ),
    )
    .limit(1);

  return submission;
}

export async function upsertSongSubmission(input: {
  roundId: string;
  userId: string;
  songUrl: string;
}): Promise<SongSubmission> {
  const db = await getDb();
  const [submission] = await db
    .insert(songSubmissions)
    .values(input)
    .onConflictDoUpdate({
      target: [songSubmissions.userId, songSubmissions.roundId],
      set: { songUrl: input.songUrl },
    })
    .returning();

  return submission;
}
