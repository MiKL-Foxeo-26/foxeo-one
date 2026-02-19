import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { DocumentList } from './document-list'
import type { Document } from '../types/document.types'

type ColDef = {
  id: string
  header?: (() => React.ReactNode) | string
  accessorKey?: string
  cell?: (item: Document) => React.ReactNode
}

// Mock @foxeo/ui
vi.mock('@foxeo/ui', () => ({
  DataTable: ({ data, columns, emptyMessage }: { data: Document[]; columns: ColDef[]; emptyMessage: string }) => (
    <div data-testid="data-table">
      {data.length === 0 ? (
        <p>{emptyMessage}</p>
      ) : (
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.id}>
                  {typeof col.header === 'function' ? col.header() : col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item: Document) => (
              <tr key={item.id} data-testid={`doc-row-${item.id}`}>
                {columns.map((col) => (
                  <td key={col.id}>
                    {col.cell ? col.cell(item) : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  ),
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Button: ({ children, onClick, disabled, ...props }: React.ComponentProps<'button'>) => (
    <button onClick={onClick} disabled={disabled} {...props}>{children}</button>
  ),
  Checkbox: ({ checked, onCheckedChange, ...props }: { checked?: boolean; onCheckedChange?: () => void; [key: string]: unknown }) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={() => onCheckedChange?.()}
      {...props}
    />
  ),
}))

// Mock @foxeo/utils
vi.mock('@foxeo/utils', () => ({
  formatFileSize: (bytes: number) => `${(bytes / 1024).toFixed(1)} Ko`,
}))

// Mock DocumentShareButton
vi.mock('./document-share-button', () => ({
  DocumentShareButton: ({ document }: { document: Document }) => (
    <button data-testid={`share-btn-${document.id}`}>Partager</button>
  ),
}))

// Mock use-share-document
const mockShareBatch = vi.fn()
vi.mock('../hooks/use-share-document', () => ({
  useShareDocument: vi.fn(() => ({
    shareBatch: mockShareBatch,
    isBatchSharing: false,
    share: vi.fn(),
    unshare: vi.fn(),
    isSharing: false,
    isUnsharing: false,
  })),
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

function Wrapper({ children }: { children: React.ReactNode }) {
  const qc = new QueryClient()
  return createElement(QueryClientProvider, { client: qc }, children)
}

describe('DocumentList', () => {
  it('renders the data table', () => {
    render(<DocumentList documents={MOCK_DOCS} />, { wrapper: Wrapper })
    expect(screen.getByTestId('document-list')).toBeDefined()
    expect(screen.getByTestId('data-table')).toBeDefined()
  })

  it('shows document rows', () => {
    render(<DocumentList documents={MOCK_DOCS} />, { wrapper: Wrapper })
    expect(screen.getByTestId('doc-row-doc-1')).toBeDefined()
    expect(screen.getByTestId('doc-row-doc-2')).toBeDefined()
  })

  it('shows empty message when no documents', () => {
    render(<DocumentList documents={[]} />, { wrapper: Wrapper })
    expect(screen.getByText('Aucun document')).toBeDefined()
  })

  it('renders document names', () => {
    render(<DocumentList documents={MOCK_DOCS} />, { wrapper: Wrapper })
    expect(screen.getByText('rapport.pdf')).toBeDefined()
    expect(screen.getByText('photo.png')).toBeDefined()
  })

  // Batch actions tests
  it('does not show checkboxes when showBatchActions is false', () => {
    render(<DocumentList documents={MOCK_DOCS} showBatchActions={false} />, { wrapper: Wrapper })
    expect(screen.queryByTestId('select-all-checkbox')).toBeNull()
  })

  it('shows select-all checkbox when showBatchActions is true', () => {
    render(
      <DocumentList documents={MOCK_DOCS} showBatchActions clientId="client-1" />,
      { wrapper: Wrapper }
    )
    expect(screen.getByTestId('select-all-checkbox')).toBeDefined()
  })

  it('does not show batch bar initially when nothing selected', () => {
    render(
      <DocumentList documents={MOCK_DOCS} showBatchActions clientId="client-1" />,
      { wrapper: Wrapper }
    )
    expect(screen.queryByTestId('batch-actions-bar')).toBeNull()
  })

  it('shows batch bar when a document is selected', () => {
    render(
      <DocumentList documents={MOCK_DOCS} showBatchActions clientId="client-1" />,
      { wrapper: Wrapper }
    )
    const checkbox = screen.getByTestId('select-doc-1')
    fireEvent.click(checkbox)
    expect(screen.getByTestId('batch-actions-bar')).toBeDefined()
  })

  it('calls shareBatch when batch share button is clicked', () => {
    render(
      <DocumentList documents={MOCK_DOCS} showBatchActions clientId="client-1" />,
      { wrapper: Wrapper }
    )
    fireEvent.click(screen.getByTestId('select-doc-1'))
    fireEvent.click(screen.getByTestId('batch-share-btn'))
    expect(mockShareBatch).toHaveBeenCalledWith(
      { documentIds: ['doc-1'], clientId: 'client-1' },
      expect.any(Object)
    )
  })
})
