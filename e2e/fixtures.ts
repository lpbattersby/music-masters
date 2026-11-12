import { test as base, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import bcrypt from 'bcrypt'
import { users } from '../src/app/lib/schema'

export const testUser = {
  username: 'existing-user',
  displayName: 'Test User',
  password: 'TestPassword1!',
}

export const test = base.extend<{ resetDatabase: void }>({
  resetDatabase: [
    async ({ baseURL }, use) => {
      if (baseURL !== 'http://localhost:3001') {
        throw new Error('Database reset requires the dedicated E2E server')
      }

      await mkdir('./data', { recursive: true })
      const client = createClient({ url: 'file:./data/e2e.db' })

      try {
        await migrate(drizzle(client), { migrationsFolder: './drizzle' })
        await client.execute('DELETE FROM users')
      } finally {
        client.close()
      }

      await use()
    },
    { auto: true },
  ],
})

export const createTestUser = async () => {
  const client = createClient({ url: 'file:./data/e2e.db' })
  const db = drizzle(client)
  const hashedPassword = await bcrypt.hash(testUser.password, 10)
  await db.insert(users).values({
    username: testUser.username,
    displayName: testUser.displayName,
    passwordHash: hashedPassword,
  })
  client.close()
}

export { expect }