import { test as base, expect } from '@playwright/test'
import { mkdir } from 'node:fs/promises'
import { randomUUID } from 'node:crypto'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { createUser } from '@/app/lib/users'
import { createGroup } from '@/app/lib/groups'

export const testUser = {
  username: 'existing-user',
  displayName: 'Test User',
  password: 'TestPassword1!',
}

export const testGroup = {
  name: 'test-group',
  description: 'Test Group',
  submissionWindowDays: 2,
  votingWindowDays: 2,
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
        await client.batch([
          'DELETE FROM memberships',
          'DELETE FROM groups',
          'DELETE FROM users',
        ], 'write')
      } finally {
        client.close()
      }

      await use()
    },
    { auto: true },
  ],
})

export const createTestUsers = (count: number) =>
  Promise.all(
    Array.from({ length: count }, () =>
      createUser({
        ...testUser,
        username: `${testUser.username}-${randomUUID()}`,
      }),
    ),
  )

export const createTestGroups = (count: number, createdBy: string) =>
  Promise.all(
    Array.from({ length: count }, () =>
      createGroup({
        ...testGroup,
        name: `${testGroup.name}-${randomUUID()}`,
        createdBy,
      }),
    ),
  )

export { expect }