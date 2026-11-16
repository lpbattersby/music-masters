'use client'

import { useState, type ReactNode } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'

interface Props {
  id: string
  label: string
  children: ReactNode
  openState: boolean
}

export default function MMDialog({ openState, id, label, children }: Props) {
  const [open, setOpen] = useState(openState)
  const titleId = `${id}-title`

  return (
    <Dialog
    open={open}
    onClose={() => setOpen(false)}
    aria-labelledby={titleId}
    fullWidth
    maxWidth="sm"
    >
    <DialogTitle id={titleId} sx={{ typography: 'h1' }}>
        {label}
    </DialogTitle>
    <DialogContent>{children}</DialogContent>
    <DialogActions>
        <Button onClick={() => setOpen(false)}>Close</Button>
    </DialogActions>
    </Dialog>
  )
}