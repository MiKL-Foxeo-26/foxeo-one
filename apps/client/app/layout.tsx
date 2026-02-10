import type { Metadata } from 'next'
import { QueryProvider, ThemeProvider } from '@foxeo/supabase'
import './globals.css'

export const metadata: Metadata = {
  title: 'Foxeo',
  description: 'Votre espace Foxeo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Default to Lab theme — dynamic switch to One via ThemeProvider
  // Client config will determine actual theme (Story 1.5+)
  return (
    <html lang="fr" className="dark theme-lab" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider defaultTheme="dark" dashboardTheme="lab">
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
