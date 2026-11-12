'use client'

import Image from 'next/image'
import { HomeRounded, Logout } from '@mui/icons-material'
import Link from 'next/link'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { logout } from '../actions/auth'

export default function MMAppBar() {
    

  return (
    <AppBar
      position="static"
      elevation={0}
      className="animated-appbar"
      sx={{ bgcolor: 'primary', color: 'white' }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1, mx: 1 }}>
        <Link href="/dashboard" aria-label="Home">
          <HomeRounded />
        </Link>
        <Image
          src="/logo.png"
          alt="Music Masters"
          width={300}
          height={300}
          style={{ width: 'auto', height: 54, maxWidth: '100%', objectFit: 'contain', backgroundColor: 'transparent' }}
          loading='eager'
        />
        <form action={logout}>
          <button type="submit" aria-label="Logout">
            <Logout />
          </button>
        </form>
      </Toolbar>
    </AppBar>
  )
}