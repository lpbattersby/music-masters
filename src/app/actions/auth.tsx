
'use server'

import { SignupFormSchema, FormState } from '@/app/lib/definitions'
import { createUser } from '@/app/lib/users'
import bcrypt from 'bcrypt'
import { DrizzleQueryError } from 'drizzle-orm/errors'
import { LibsqlError } from '@libsql/client'


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
    const data = await createUser({
      displayName,
      username,
      passwordHash: hashedPassword,
    })
    return { user: data }
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
}