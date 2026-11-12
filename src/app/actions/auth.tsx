
'use server'

import { SignupFormSchema, FormState } from '@/app/lib/definitions'
import { createUser } from '@/app/lib/users'
import bcrypt from 'bcrypt'


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

  const data = await createUser({
    displayName,
    username,
    passwordHash: hashedPassword,
  })

  const user = data

  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    }
  }

  return { user }
}