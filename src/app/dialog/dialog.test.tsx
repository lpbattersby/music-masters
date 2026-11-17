// @vitest-environment jsdom
import { expect, it, vi } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MMFab from '../fab/fab'
import CreateRound from '../(app)/groups/[id]/create-round'
import type { Group } from '../lib/schema'

vi.mock('../(app)/groups/[id]/round-form', () => ({
  default: () => <div>Create round form</div>,
}))

const group: Group = {
  groupId: 'group-1',
  name: 'Music club',
  description: 'Our favourite tracks',
  submissionWindowDays: 2,
  votingWindowDays: 3,
  createdBy: 'user-1',
  createdAt: '2026-11-17',
}

it.each(['group', 'round'] as const)(
  'opens, closes, and reopens the create %s dialog',
  async (kind) => {
    const event = userEvent.setup()
    render(
      kind === 'group' ? (
        <MMFab id="create-group" label="Create Group" text="Create Group" navigation>
          <div>Create group form</div>
        </MMFab>
      ) : (
        <CreateRound group={group} />
      ),
    )

    const trigger = screen.getByRole('button', { name: /create (group|round)/i })
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await event.click(trigger)
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByText(`Create ${kind} form`)).toBeVisible()

    await event.click(within(dialog).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    await event.click(trigger)
    expect(await screen.findByRole('dialog')).toBeVisible()
    await event.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

    await event.click(trigger)
    expect(await screen.findByRole('dialog')).toBeVisible()
  },
)
