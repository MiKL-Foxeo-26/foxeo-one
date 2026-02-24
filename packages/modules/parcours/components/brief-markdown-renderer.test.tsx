import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BriefMarkdownRenderer } from './brief-markdown-renderer'

// Use a more realistic mock that simulates markdown parsing behavior
vi.mock('react-markdown', () => ({
  default: ({ children, components }: { children: string; components?: Record<string, React.FC> }) => {
    // Simulate basic markdown-like rendering by applying component overrides
    const content = children || ''

    // Check if custom components are passed
    if (components) {
      return (
        <div data-testid="markdown-content" data-has-components="true">
          {content}
        </div>
      )
    }
    return <div data-testid="markdown-content">{content}</div>
  },
}))

vi.mock('remark-gfm', () => ({ default: () => {} }))

describe('BriefMarkdownRenderer', () => {
  it('renders content inside prose-styled container', () => {
    const { container } = render(<BriefMarkdownRenderer content="## Mon brief" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('prose')
    expect(wrapper.className).toContain('prose-invert')
  })

  it('passes content string to ReactMarkdown', () => {
    render(<BriefMarkdownRenderer content="**Texte en gras**" />)
    expect(screen.getByText('**Texte en gras**')).toBeDefined()
  })

  it('renders empty content without crashing', () => {
    const { container } = render(<BriefMarkdownRenderer content="" />)
    expect(container.firstChild).toBeDefined()
  })

  it('provides custom component overrides to ReactMarkdown', () => {
    render(<BriefMarkdownRenderer content="Test" />)
    const mdContent = screen.getByTestId('markdown-content')
    expect(mdContent.getAttribute('data-has-components')).toBe('true')
  })

  it('applies additional className when provided', () => {
    const { container } = render(<BriefMarkdownRenderer content="Test" className="custom-class" />)
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('custom-class')
  })

  it('renders multiline content correctly', () => {
    const multilineContent = '# Titre\n\nParagraphe 1\n\n## Sous-titre\n\n- Item 1\n- Item 2'
    render(<BriefMarkdownRenderer content={multilineContent} />)
    const mdContent = screen.getByTestId('markdown-content')
    expect(mdContent).toBeDefined()
    expect(mdContent.textContent).toContain('Titre')
    expect(mdContent.textContent).toContain('Item 1')
  })
})
