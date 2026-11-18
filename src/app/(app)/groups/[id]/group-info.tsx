import type { Group } from '@/app/lib/schema'
import InviteButton from './invite-button'
import JoinButton from './join-button'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export default function GroupInfo({ group, isMember }: { group: Group, isMember: boolean }) {
  return (
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <Typography variant="h1">{group.name}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1, overflowWrap: 'anywhere' }}>{group.description}</Typography>
        </div>
        {isMember ? <InviteButton /> : <JoinButton groupId={group.groupId} />}
      </Box>
  )
}
