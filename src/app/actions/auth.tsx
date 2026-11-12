import { SignupFormSchema, FormState } from '@/app/lib/definitions'
import { users } from '@/app/lib/schema'
import { getDb } from '@/app/lib/db'
import bcrypt from 'bcrypt'

export async function signup(state: FormState, formData: FormData) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    displayName: formData.get('displayName'),
    username: formData.get('username'),
    password: formData.get('password'),
  })

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

    // 2. Prepare data for insertion into database
  const { displayName, username, password } = validatedFields.data
  // e.g. Hash the user's password before storing it
  const hashedPassword = await bcrypt.hash(password, 10)

  // 3. Insert the user into the database or call an Auth Library's API
  const db = await getDb()
  const data = await db
    .insert(users)
    .values({
      displayName,
      username,
      password_hash: hashedPassword,
    })
    .returning({ user_id: users.user_id })

  const user = data[0]

  if (!user) {
    return {
      message: 'An error occurred while creating your account.',
    }
  }

  return { user }
}