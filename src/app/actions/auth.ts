"use server";

import {
  SignupFormSchema,
  LoginFormSchema,
  type FormState,
} from "@/app/lib/form-schemas";
import { createUser, getUserByUsername } from "@/app/lib/users";
import bcrypt from "bcrypt";
import { DrizzleQueryError } from "drizzle-orm/errors";
import { LibsqlError } from "@libsql/client";
import { getSession } from "@/app/lib/auth/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signup(state: FormState, formData: FormData) {
  const validatedFields = SignupFormSchema.safeParse({
    displayName: formData.get("displayName"),
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { displayName, username, password } = validatedFields.data;

  try {
    await createUser({
      displayName,
      username,
      password: password,
    });
    const session = await getSession();
    session.username = username;
    session.isLoggedIn = true;
    await session.save();
  } catch (error) {
    const cause = error instanceof DrizzleQueryError ? error.cause : error;

    if (
      cause instanceof LibsqlError &&
      cause.extendedCode === "SQLITE_CONSTRAINT_UNIQUE"
    ) {
      return {
        errors: { username: ["That username is already taken."] },
      };
    }

    throw error;
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function login(state: FormState, formData: FormData) {
  const validatedFields = LoginFormSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { username, password } = validatedFields.data;

  const session = await getSession();

  const user = await getUserByUsername(username);
  if (!user) {
    return {
      errors: { username: ["User not found."] },
    };
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatch) {
    return {
      errors: { password: ["Incorrect password."] },
    };
  }

  session.username = username as string;
  session.isLoggedIn = true;
  await session.save();

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function logout() {
  "use server";

  const session = await getSession();
  session.destroy();
  revalidatePath("/");
  redirect("/");
}
