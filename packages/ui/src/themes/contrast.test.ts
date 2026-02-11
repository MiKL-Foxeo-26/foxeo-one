import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const THEMES_DIR = resolve(__dirname)

function readThemeCSS(name: string): string {
  return readFileSync(resolve(THEMES_DIR, `${name}.css`), 'utf-8')
}

/**
 * Convert OKLCH lightness to approximate relative luminance for WCAG.
 * OKLCH L is perceptually uniform; we approximate sRGB relative luminance
 * using a power curve. This is an approximation — for production audit,
 * use a full color conversion library.
 */
function oklchLightnessToRelativeLuminance(l: number): number {
  return Math.pow(l, 2.4)
}

/**
 * Calculate WCAG contrast ratio between two relative luminances.
 */
function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Extract OKLCH lightness value for a CSS variable from a CSS block.
 */
function extractLightness(cssBlock: string, varName: string): number | null {
  const escaped = varName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`${escaped}:\\s*oklch\\(([\\d.]+)`)
  const match = cssBlock.match(regex)
  return match ? parseFloat(match[1]) : null
}

function getThemeBlocks(theme: string) {
  const css = readThemeCSS(theme)
  const parts = css.split(`.theme-${theme}.dark`)
  return {
    light: parts[0] || '',
    dark: parts[1] || '',
  }
}

const THEMES = ['hub', 'lab', 'one'] as const
const WCAG_AA_NORMAL = 4.5
const WCAG_AA_LARGE = 3.0

// Critical text/background pairs to check
const TEXT_BG_PAIRS = [
  { text: '--foreground', bg: '--background', label: 'text on background' },
  { text: '--card-foreground', bg: '--card', label: 'text on card' },
  { text: '--popover-foreground', bg: '--popover', label: 'text on popover' },
  { text: '--primary-foreground', bg: '--primary', label: 'text on primary' },
  { text: '--secondary-foreground', bg: '--secondary', label: 'text on secondary' },
  { text: '--muted-foreground', bg: '--background', label: 'muted text on background' },
  { text: '--sidebar-foreground', bg: '--sidebar', label: 'text on sidebar' },
]

describe('WCAG AA Contrast Ratios', () => {
  for (const theme of THEMES) {
    describe(`${theme} — dark mode`, () => {
      const blocks = getThemeBlocks(theme)

      for (const pair of TEXT_BG_PAIRS) {
        it(`${pair.label} >= ${WCAG_AA_NORMAL}:1`, () => {
          const textL = extractLightness(blocks.dark, pair.text)
          const bgL = extractLightness(blocks.dark, pair.bg)

          // Skip if variables not found (they may inherit from light mode)
          if (textL === null || bgL === null) return

          const textLum = oklchLightnessToRelativeLuminance(textL)
          const bgLum = oklchLightnessToRelativeLuminance(bgL)
          const ratio = contrastRatio(textLum, bgLum)

          expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL)
        })
      }
    })

    describe(`${theme} — light mode`, () => {
      const blocks = getThemeBlocks(theme)

      for (const pair of TEXT_BG_PAIRS) {
        it(`${pair.label} >= ${WCAG_AA_NORMAL}:1`, () => {
          const textL = extractLightness(blocks.light, pair.text)
          const bgL = extractLightness(blocks.light, pair.bg)

          if (textL === null || bgL === null) return

          const textLum = oklchLightnessToRelativeLuminance(textL)
          const bgLum = oklchLightnessToRelativeLuminance(bgL)
          const ratio = contrastRatio(textLum, bgLum)

          expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_NORMAL)
        })
      }
    })
  }
})

describe('Primary accent visibility on dark background', () => {
  for (const theme of THEMES) {
    it(`${theme} primary accent contrast >= ${WCAG_AA_LARGE}:1 (large text)`, () => {
      const blocks = getThemeBlocks(theme)
      const primaryL = extractLightness(blocks.dark, '--primary')
      const bgL = extractLightness(blocks.dark, '--background')

      if (primaryL === null || bgL === null) return

      const primaryLum = oklchLightnessToRelativeLuminance(primaryL)
      const bgLum = oklchLightnessToRelativeLuminance(bgL)
      const ratio = contrastRatio(primaryLum, bgLum)

      expect(ratio).toBeGreaterThanOrEqual(WCAG_AA_LARGE)
    })
  }
})
