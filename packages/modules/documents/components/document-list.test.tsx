import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { DocumentList } from './document-list'
import type { Document } from '../types/document.types'

// Mock @foxeo/ui
vi.mock('@foxeo/ui', () => ({
  DataTable: ({ data, columns, emptyMessage }: { data: Document[]; columns: unknown[]; emptyMessage: string }) => (
    <div data-testid="data-table">
      {data.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <table>
          <tbody>
            {data.map((item: Document) => (
              <tr key={item.id} data-testid={`doc-row-${item.id}`}>
                <td>{item.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  ),
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Button: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button {...props}>{children}</button>
  ),
}))

// Mock @foxeo/utils
vi.mock('@foxeo/utils', () => ({
  formatFileSize: (bytes: number) => `${(bytes / 1024).toFixed(1)} Ko`,
}))

const MOCK_DOCS: Document[] = [
  {
    id: 'doc-1',
    clientId: 'client-1',
    operatorId: 'op-1',
    name: 'rapport.pdf',
    filePath: 'op-1/client-1/uuid-rapport.pdf',
    fileType: 'pdf',
    fileSize: 1024 * 500,
    folderId: null,
    tags: [],
    visibility: 'private',
    uploadedBy: 'operator',
    createdAt: '2026-02-18T10:00:00Z',
    updatedAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'doc-2',
    clientId: 'client-1',
    operatorId: 'op-1',
    name: 'photo.png',
    filePath: 'op-1/client-1/uuid-photo.png',
    fileType: 'png',
    fileSize: 2048 * 1024,
    folderId: null,
    tags: [],
    visibility: 'shared',
    uploadedBy: 'client',
    createdAt: '2026-02-18T11:00:00Z',
    updatedAt: '2026-02-18T11:00:00Z',
  },
]

describe('DocumentList', () => {
  it('renders the data table', () => {
    render(<DocumentList documents={MOCK_DOCS} />)
    expect(screen.getByTestId('document-list')).toBeDefined()
    expect(screen.getByTestId('data-table')).toBeDefined()
  })

  it('shows document rows', () => {
    render(<DocumentList documents={MOCK_DOCS} />)
    expect(screen.getByTestId('doc-row-doc-1')).toBeDefined()
    expect(screen.getByTestId('doc-row-doc-2')).toBeDefined()
  })

  it('shows empty message when no documents', () => {
    render(<DocumentList documents={[]} />)
    expect(screen.getByText('Aucun document')).toBeDefined()
  })

  it('renders document names', () => {
    render(<DocumentList documents={MOCK_DOCS} />)
    expect(screen.getByText('rapport.pdf')).toBeDefined()
    expect(screen.getByText('photo.png')).toBeDefined()
  })
})
