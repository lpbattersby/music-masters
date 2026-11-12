'use client'

import Image from 'next/image'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'

export default function MMAppBar() {
  return (
    <AppBar
      position="static"
      elevation={0}
      className="animated-appbar"
      sx={{ bgcolor: 'primary', color: 'black' }}
    >
      <Toolbar sx={{ justifyContent: 'center', py: 1 }}>
        {/* <Image
          src="/logo.png"
          alt="Music Masters"
          width={300}
          height={300}
          style={{ width: 'auto', height: 48, maxWidth: '100%', objectFit: 'contain' }}
        /> */}
      </Toolbar>
    </AppBar>
  )
}