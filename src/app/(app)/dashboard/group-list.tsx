'use client'

import { Group } from '@/app/lib/schema'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import Link from 'next/link'

export default function GroupList({ groups }: { groups: Group[] }) {
  if (groups.length === 0) {
    return <p>No groups found.</p>
  }

  return (
    <div aria-label="Groups" className="flex flex-col justify-center items-center gap-6 w-1/2 min-w-[300px]">
      {groups.map((group) => (
        <Button key={group?.groupId} href={`/groups/${group?.groupId}`} className="w-full h-20 mx-4 shadow-xl" variant="outlined">
          {group?.name}
        </Button>
      ))}
    </div>
  )
}
