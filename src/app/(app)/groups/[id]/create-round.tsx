'use client'

import { useState } from 'react'
import Button from '@mui/material/Button'
import CreateRoundForm from './round-form'
import type { Group } from '@/app/lib/schema'
import MMDialog from '@/app/dialog/dialog'

export default function CreateRound({ disabled, group }: { disabled?: boolean; group: Group }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)} disabled={disabled}>
        Create round
      </Button>

      {open && (
        <MMDialog
          id="create-round-dialog"
          label="Create Round"
          open={open}
          onClose={() => setOpen(false)}
        >
          <CreateRoundForm group={group} />
        </MMDialog>
      )}
    </>
  )
}