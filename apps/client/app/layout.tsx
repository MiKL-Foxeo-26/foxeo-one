import type { Metadata } from 'next'
import { Poppins, Inter } from 'next/font/google'
import { QueryProvider, ThemeProvider } from '@foxeo/supabase'
import './globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-inter',
  display: 'swap',
})

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
    <html
      lang="fr"
      className={`dark theme-lab ${poppins.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('foxeo-theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light')}else if(t==='system'&&window.matchMedia('(prefers-color-scheme:light)').matches){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light')}}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <ThemeProvider defaultTheme="dark" dashboardTheme="lab">
          <QueryProvider>{children}</QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
