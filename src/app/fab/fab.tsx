'use client'

import { useState, type ReactNode } from 'react'
import Fab from '@mui/material/Fab'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'

interface Props {
  id: string
  label: string
  text: string
  children: ReactNode
}

export default function MMFab({ id, label, text, children }: Props) {
  const [open, setOpen] = useState(false)
  const titleId = `${id}-title`

  return (
    <>
      <Fab
        color="primary"
        aria-label={label}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        variant="extended"
        sx={{
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'primary',
          bottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
          zIndex: (theme) => theme.zIndex.fab,
        }}
      >
        {text}
      </Fab>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby={titleId}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle id={titleId}>{label}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}