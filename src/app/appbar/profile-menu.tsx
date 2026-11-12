'use client'

import { useState } from 'react'
import { PersonOutlined, Logout } from '@mui/icons-material'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import { logout } from '@/app/actions/auth'

export default function ProfileMenu() {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  return (
    <>
      <Button
        aria-label="Profile"
        aria-haspopup="menu"
        aria-expanded={Boolean(anchor)}
        onClick={(event) => setAnchor(event.currentTarget)}
        sx={{ color: 'inherit', minWidth: 48 }}
      >
        <PersonOutlined />
      </Button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        <form action={logout}>
          <Button
            type="submit"
            aria-label="Logout"
            startIcon={<Logout />}
            sx={{ mx: 1, color: 'text.primary' }}
          >
            Sign out
          </Button>
        </form>
      </Menu>
    </>
  )
}
