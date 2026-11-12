'use client'

import { Group } from '@/app/lib/schema'
import InviteButton from './invite-button'
import JoinButton from './join-button'

export default function GroupInfo({ group, isMember }: { group: Group, isMember: boolean }) {
  if (!group) {
    return <p>No group found.</p>
  }

  return (
      <section className="">
        <div className="min-w-0 mb-9 flex justify-between items-center gap-4">
          <div>
            <h1 className="display-heading">{group.name}</h1>
            <p className="mt-6 leading-relaxed wrap-anywhere text-muted">{group.description}</p>
          </div>
          {isMember ? <InviteButton /> : <JoinButton groupId={group.groupId} />}
        </div>
      </section>
  )
}
