import "server-only";

import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server"
import { getIronSession } from "iron-session";

import { sessionOptions, type SessionData } from "@/app/lib/auth/session";
import { getUserByUsername } from "../users";
import { getGroupForUser } from "../groups";
import { notFound } from "next/navigation";

export const basePath = "/";

/**
 * The Data Access Layer from the Next.js authentication guide.
 *
 * `server-only` turns importing this from a Client Component into a build
 * error, and React's `cache` unseals the cookie once per render however many
 * components ask for it.
 */
export const readSession = cache(async () => {
  await connection()
  return getIronSession<SessionData>(await cookies(), sessionOptions);
});

/** Redirects a signed-out visitor. Call it wherever the data needs protecting. */
export const verifySession = cache(async () => {
  const session = await readSession();

  if (!session.isLoggedIn || !session.username) {
    redirect(basePath);
  }

  return { username: session.username };
});

export const getCurrentUser = cache(async () => {
  const { username } = await verifySession()
  const user = await getUserByUsername(username)

  if (!user) {
    redirect('/login')
  }

  return {
    userId: user.userId,
    username: user.username,
    displayName: user.displayName,
  }
})

export async function getCurrentUserGroup(groupId: number) {
  const user = await getCurrentUser()

  if (!Number.isSafeInteger(groupId) || groupId <= 0) {
    notFound()
  }

  const group = await getGroupForUser(groupId, user.userId)

  if (!group) {
    notFound()
  }

  return group
}