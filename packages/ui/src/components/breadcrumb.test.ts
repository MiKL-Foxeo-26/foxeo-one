import { describe, it, expect } from 'vitest'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from './breadcrumb'

describe('Breadcrumb components', () => {
  it('exports Breadcrumb', () => {
    expect(Breadcrumb).toBeDefined()
  })

  it('exports BreadcrumbList', () => {
    expect(BreadcrumbList).toBeDefined()
  })

  it('exports BreadcrumbItem', () => {
    expect(BreadcrumbItem).toBeDefined()
  })

  it('exports BreadcrumbLink', () => {
    expect(BreadcrumbLink).toBeDefined()
  })

  it('exports BreadcrumbPage', () => {
    expect(BreadcrumbPage).toBeDefined()
  })

  it('exports BreadcrumbSeparator', () => {
    expect(BreadcrumbSeparator).toBeDefined()
  })

  it('exports BreadcrumbEllipsis', () => {
    expect(BreadcrumbEllipsis).toBeDefined()
  })
})
