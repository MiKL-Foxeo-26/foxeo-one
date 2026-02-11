import { describe, it, expect } from 'vitest'
import { useConfirmDialog } from './use-confirm-dialog'

describe('useConfirmDialog', () => {
  it('exports useConfirmDialog hook', () => {
    expect(useConfirmDialog).toBeDefined()
  })
})
