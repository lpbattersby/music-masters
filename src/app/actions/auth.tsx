'use server';

import { SignupFormSchema, FormState } from '@/app/lib/definitions'
import { createUser } from '@/app/lib/users'
import bcrypt from 'bcrypt'
import { DrizzleQueryError } from 'drizzle-orm/errors'
import { LibsqlError } from '@libsql/client'
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { sessionOptions, defaultSession, type SessionData } from "@/app/lib/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function getSession() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  if (!session.isLoggedIn) {
    session.isLoggedIn = defaultSession.isLoggedIn;
    session.username = defaultSession.username;
  }

  return session;
}

export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    displayName: formData.get('displayName'),
    username: formData.get('username'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { displayName, username, password } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await createUser({
      displayName,
      username,
      passwordHash: hashedPassword,
    })
    const session = await getSession();
    session.username = username;
    session.isLoggedIn = true;
    await session.save();
  } catch (error) {
    const cause = error instanceof DrizzleQueryError ? error.cause : error

    if (
      cause instanceof LibsqlError &&
      cause.extendedCode === 'SQLITE_CONSTRAINT_UNIQUE'
    ) {
      return {
        errors: { username: ['That username is already taken.'] },
      }
    }

    throw error
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
