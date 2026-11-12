import type { ReactNode } from 'react'
import MMAppBar from '@/app/appbar/appbar'

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <MMAppBar />
      {children}
    </>
  )
}