'use client'

import type { Group, Round } from '@/app/lib/schema'
import Link from 'next/link'
import { ArrowForward, AlbumOutlined } from '@mui/icons-material'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

type GroupWithLatestRound = Group & { latestRound?: Round }

export default function GroupList({ groups }: { groups: GroupWithLatestRound[] }) {
  if (groups.length === 0) {
    return (
      <Paper variant="outlined" sx={{ mt: 4, px: 3, py: 6, textAlign: 'center', color: 'info.main', borderStyle: 'dashed', bgcolor: 'transparent' }}>
        <AlbumOutlined sx={{ fontSize: 64 }} />
        <Typography variant="h2" color="text.primary" sx={{ mt: 2, mb: 1 }}>No groups yet.</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 340, mx: 'auto' }}>Create a group or join one using an invite link.</Typography>
      </Paper>
    )
  }

  return (
    <div aria-label="Groups" className="mt-8 grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-6">
      {groups.map((group, index) => (
        <Card key={group.groupId}>
        <CardActionArea component={Link} href={`/groups/${group.groupId}`} aria-label={group.name} sx={{ height: '100%' }}>
          <div className={`relative flex min-h-47.5 flex-col items-start gap-3 overflow-hidden p-4 ${['bg-brand text-paper', 'bg-blue text-paper', 'bg-yellow'][index % 3]}`} aria-hidden="true">
            <Typography variant="h2" component="h2" className={`relative z-1 max-w-full rounded-sm`}>{group.name}</Typography>
            <span className="vinyl-record -top-6 -right-3.5 size-55"><span /></span>
            <span className={`relative z-1 mt-auto max-w-full rounded-sm text-[9px] font-bold tracking-[1.5px] uppercase [overflow-wrap:anywhere]`}>{group.description}</span>
          </div>
          <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <div className="min-w-0">
              <Typography variant="h3" component="h3">
                {group.latestRound?.name ?? 'No round yet.'}
              </Typography>
              {group.latestRound && (
                <Typography variant="body2" color="text.secondary" className="line-clamp-2">
                  {group.latestRound.description}
                </Typography>
              )}
            </div>
            <ArrowForward aria-hidden="true" sx={{ color: 'primary.main', flexShrink: 0 }} />
          </CardContent>
        </CardActionArea>
        </Card>
      ))}
    </div>
  )
}
