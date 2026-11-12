'use client'

import type { ReactNode } from 'react'
import { createTheme, ThemeProvider } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      light: '#ff6164',
      main: '#e74346',
      dark: '#871e20',
      contrastText: '#fff',
    },
    secondary: {
      light: '#ffe189',
      main: '#ffbb5b',
      dark: '#eca848',
      contrastText: '#000',
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans), sans-serif',
  },
})

export default function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}