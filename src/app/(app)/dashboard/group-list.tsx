'use client'

import { Group } from '@/app/lib/schema'
import Card from '@mui/material/Card'
import Link from 'next/link'

export default function GroupList({ groups }: { groups: Group[] }) {
  if (groups.length === 0) {
    return <p>No groups found.</p>
  }

  return (
    <div aria-label="Groups" className="flex flex-col justify-center items-center gap-6">
      {/* <b className="text-2xl">Groups</b> */}
      <div className="flex flex-col gap-4">
        {groups.map((group) => (
          <Card key={group?.groupId}><Link href={`/groups/${group?.groupId}`}>{group?.name}</Link></Card>
        ))}
      </div>
    </div>
  )
}
