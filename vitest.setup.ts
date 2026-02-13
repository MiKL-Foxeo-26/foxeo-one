import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'
import React from 'react'

// Make React available globally for JSX transform
;(global as any).React = React

expect.extend(matchers)

afterEach(() => {
  cleanup()
})
