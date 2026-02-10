import type { Metadata } from 'next'
import { QueryProvider, ThemeProvider } from '@foxeo/supabase'
import './globals.css'

export const metadata: Metadata = {
  title: 'Foxeo Hub',
  description: 'Cockpit operateur Foxeo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark theme-hub" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider defaultTheme="dark" dashboardTheme="hub">
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
