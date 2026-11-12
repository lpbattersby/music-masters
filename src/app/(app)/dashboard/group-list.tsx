'use client'

import { Group } from '@/app/lib/schema'
import Link from 'next/link'
import { ArrowForward, AlbumOutlined } from '@mui/icons-material'

export default function GroupList({ groups }: { groups: Group[] }) {
  if (groups.length === 0) {
    return (
      <section className="mt-8 rounded-[18px] border border-dashed border-outline px-6 py-12 text-center text-blue">
        <AlbumOutlined sx={{ fontSize: 64 }} />
        <h2 className="mt-4 mb-2.5 font-display text-[25px] text-brown">No groups yet.</h2>
        <p className="mx-auto max-w-85 text-sm leading-relaxed text-muted">Create a group or join one using an invite link.</p>
      </section>
    )
  }

  return (
    <div aria-label="Groups" className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-6">
      {groups.map((group, index) => (
        <Link key={group.groupId} href={`/groups/${group.groupId}`} className="min-w-0 overflow-hidden rounded-[18px] border border-outline bg-paper" aria-label={group.name}>
          <div className={`relative h-47.5 overflow-hidden p-4 ${['bg-brand text-paper', 'bg-blue text-paper', 'bg-yellow'][index % 3]}`} aria-hidden="true">
            <h2 className="relative z-1 font-display text-4xl leading-none">{group.name}</h2>
            <span className="vinyl-record -top-6 -right-3.5 size-55"><span /></span>
            <span className="absolute bottom-3.5 left-4 text-[9px] font-bold tracking-[1.5px] uppercase">{group.description}</span>
          </div>
          <div className="flex items-center justify-between gap-4 p-5.5">
            <div className="min-w-0">
              <h3 className="mb-1.5 text-xl font-bold wrap-anywhere">Pop Songs</h3>
              <p className="line-clamp-2 text-[13px] text-muted">
                Description of the current round...</p>
            </div>
            <ArrowForward aria-hidden="true" sx={{ color: 'primary.main', flexShrink: 0 }} />
          </div>
        </Link>
      ))}
    </div>
  )
}
