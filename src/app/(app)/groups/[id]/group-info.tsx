'use client'

import { Group } from '@/app/lib/schema'

export default function GroupInfo({ group }: { group: Group }) {
  if (!group) {
    return <p>No group found.</p>
  }

  return (
    <div aria-label="Group" className="flex flex-col justify-center items-start gap-6 w-full">
      <p>{group.description}</p>
      <p>Submission Window: {group.submissionWindowDays} days</p>
      <p>Voting Window: {group.votingWindowDays} days</p>
    </div>
  )
}
