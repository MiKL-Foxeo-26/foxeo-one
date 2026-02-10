'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

type Theme = 'light' | 'dark' | 'system'
type DashboardTheme = 'hub' | 'lab' | 'one'

type ThemeContextType = {
  theme: Theme
  dashboardTheme: DashboardTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  dashboardTheme = 'hub',
}: {
  children: ReactNode
  defaultTheme?: Theme
  dashboardTheme?: DashboardTheme
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const root = document.documentElement

    root.classList.remove(
      'light',
      'dark',
      'theme-hub',
      'theme-lab',
      'theme-one'
    )

    root.classList.add(`theme-${dashboardTheme}`)

    const effectiveTheme =
      theme === 'system'
        ? window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light'
        : theme

    root.classList.add(effectiveTheme)
  }, [theme, dashboardTheme])

  return (
    <ThemeContext.Provider value={{ theme, dashboardTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
