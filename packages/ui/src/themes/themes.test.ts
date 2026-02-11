import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const THEMES_DIR = resolve(__dirname)

function readThemeCSS(name: string): string {
  return readFileSync(resolve(THEMES_DIR, `${name}.css`), 'utf-8')
}

// Required CSS variables that every theme must define
const REQUIRED_VARIABLES = [
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--popover',
  '--popover-foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--muted',
  '--muted-foreground',
  '--accent',
  '--accent-foreground',
  '--destructive',
  '--destructive-foreground',
  '--border',
  '--input',
  '--ring',
  '--chart-1',
  '--chart-2',
  '--chart-3',
  '--chart-4',
  '--chart-5',
  '--sidebar',
  '--sidebar-foreground',
  '--sidebar-primary',
  '--sidebar-primary-foreground',
  '--sidebar-accent',
  '--sidebar-accent-foreground',
  '--sidebar-border',
  '--sidebar-ring',
]

const THEMES = ['hub', 'lab', 'one'] as const

// #020402 in OKLCH is approximately L=0.069
const DARK_BG_MAX_LIGHTNESS = 0.08

function extractOklchLightness(css: string, varName: string): number | null {
  // Match --varName: oklch(L C H) in the CSS
  const regex = new RegExp(`${varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:\\s*oklch\\(([\\d.]+)`)
  const match = css.match(regex)
  return match ? parseFloat(match[1]) : null
}

describe('Theme CSS structure', () => {
  for (const theme of THEMES) {
    describe(`${theme}.css`, () => {
      const css = readThemeCSS(theme)

      it('has light mode selector', () => {
        expect(css).toContain(`.theme-${theme} {`)
      })

      it('has dark mode selector', () => {
        expect(css).toContain(`.theme-${theme}.dark {`)
      })

      for (const variable of REQUIRED_VARIABLES) {
        it(`defines ${variable} in light mode`, () => {
          // Extract light mode block
          const lightBlock = css.split(`.theme-${theme}.dark`)[0]
          expect(lightBlock).toContain(`${variable}:`)
        })

        it(`defines ${variable} in dark mode`, () => {
          // Extract dark mode block
          const darkBlock = css.split(`.theme-${theme}.dark`)[1]
          expect(darkBlock).toContain(`${variable}:`)
        })
      }

      it('uses oklch color format', () => {
        expect(css).toContain('oklch(')
      })

      it('defines font-sans as Poppins', () => {
        expect(css).toContain('--font-sans: Poppins')
      })

      it('defines font-serif as Inter', () => {
        expect(css).toContain('--font-serif: Inter')
      })
    })
  }
})

describe('Dark mode backgrounds — fond #020402', () => {
  for (const theme of THEMES) {
    it(`${theme} dark background lightness <= ${DARK_BG_MAX_LIGHTNESS}`, () => {
      const css = readThemeCSS(theme)
      const darkBlock = css.split(`.theme-${theme}.dark`)[1]
      if (!darkBlock) throw new Error(`No dark block found for ${theme}`)

      const lightness = extractOklchLightness(darkBlock, '--background')
      expect(lightness).not.toBeNull()
      expect(lightness!).toBeLessThanOrEqual(DARK_BG_MAX_LIGHTNESS)
    })
  }
})
