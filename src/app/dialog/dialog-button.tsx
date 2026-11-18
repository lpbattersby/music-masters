'use client'

import { useState, type ReactNode } from 'react'
import Button from '@mui/material/Button'
import MMDialog from './dialog'

interface Props {
  id: string
  name: string
  children: ReactNode
  buttonLabel?: string
  disabled?: boolean
}

export default function DialogButton({
  id,
  name,
  children,
  buttonLabel = name,
  disabled = false,
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button
        variant="contained"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        disabled={disabled}
      >
        {buttonLabel}
      </Button>
      {open && (
        <MMDialog
          id={id}
          label={name}
          open={open}
          onClose={() => setOpen(false)}
        >
          {children}
        </MMDialog>
      )}
    </>
  )
}
