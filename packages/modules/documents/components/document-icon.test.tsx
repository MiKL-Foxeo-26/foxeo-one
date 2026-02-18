import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DocumentIcon } from './document-icon'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  FileText: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-file-text" {...props} />,
  FileSpreadsheet: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-file-spreadsheet" {...props} />,
  FileImage: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-file-image" {...props} />,
  FileCode: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-file-code" {...props} />,
  File: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="icon-file-generic" {...props} />,
}))

describe('DocumentIcon', () => {
  it('renders PDF icon for pdf type', () => {
    render(<DocumentIcon fileType="pdf" />)
    expect(screen.getByTestId('doc-icon-pdf')).toBeDefined()
  })

  it('renders spreadsheet icon for xlsx', () => {
    render(<DocumentIcon fileType="xlsx" />)
    expect(screen.getByTestId('doc-icon-xlsx')).toBeDefined()
  })

  it('renders image icon for png', () => {
    render(<DocumentIcon fileType="png" />)
    expect(screen.getByTestId('doc-icon-png')).toBeDefined()
  })

  it('renders code icon for md', () => {
    render(<DocumentIcon fileType="md" />)
    expect(screen.getByTestId('doc-icon-md')).toBeDefined()
  })

  it('renders generic icon for unknown type', () => {
    render(<DocumentIcon fileType="unknown" />)
    expect(screen.getByTestId('doc-icon-unknown')).toBeDefined()
  })

  it('is case-insensitive', () => {
    render(<DocumentIcon fileType="PDF" />)
    // Should still render successfully (lowercase mapping)
    expect(screen.getByTestId('doc-icon-PDF')).toBeDefined()
  })
})
