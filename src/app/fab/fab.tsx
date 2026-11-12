'use client'

import { useState, type ReactNode } from 'react'
import Fab from '@mui/material/Fab'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Button from '@mui/material/Button'
import DialogActions from '@mui/material/DialogActions'
import { Add, LibraryMusicOutlined, History } from '@mui/icons-material'
import Link from 'next/link'

interface Props {
  id: string
  label: string
  text: string
  children: ReactNode
  navigation?: boolean
}

export default function MMFab({ id, label, text, children, navigation = false }: Props) {
  const [open, setOpen] = useState(false)
  const titleId = `${id}-title`

  return (
    <>
      {navigation && (
        <nav className="fixed bottom-[calc(16px+env(safe-area-inset-bottom,0px))] left-1/2 z-1040 flex h-19 w-[calc(100%-32px)] max-w-110 -translate-x-1/2 items-center justify-around rounded-3xl bg-brown text-beige shadow-lg" aria-label="Main navigation">
          <Link href="/dashboard" className="flex w-20 flex-col items-center gap-1 text-[11px] leading-relaxed font-semibold text-yellow" aria-current="page">
            <LibraryMusicOutlined /><span>Groups</span>
          </Link>
          <span className="mt-10 text-[10px]">Create group</span>
          <Button disabled sx={{ width: 80, flexDirection: 'column', gap: .5, fontSize: 11, '&.Mui-disabled': { color: 'text.disabled' } }}>
            <History /><span>Activity</span>
          </Button>
        </nav>
      )}
      <Fab
        color="primary"
        aria-label={label}
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
        variant={navigation ? 'circular' : 'extended'}
        title={label}
        sx={{
          position: 'fixed',
          left: '50%',
          transform: 'translateX(-50%)',
          bottom: navigation
            ? 'calc(46px + env(safe-area-inset-bottom, 0px))'
            : 'calc(24px + env(safe-area-inset-bottom, 0px))',
          ...(navigation && {
            width: 64, height: 64, border: '5px solid',
            borderColor: 'background.default',
            boxShadow: '0 4px 0 var(--mui-palette-primary-dark)', bgcolor: 'primary.main',
          }),
          zIndex: (theme) => theme.zIndex.fab,
        }}
      >
        {navigation ? <Add sx={{ fontSize: 32 }} /> : text}
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