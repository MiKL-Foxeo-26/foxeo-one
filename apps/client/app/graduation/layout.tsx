import type { ReactNode } from 'react'

// Graduation layout — full-screen without dashboard shell
export default function GraduationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="graduation-layout">
      {children}
    </div>
  )
}
