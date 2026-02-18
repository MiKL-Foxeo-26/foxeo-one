/**
 * Markdown → HTML conversion for server-side PDF generation.
 * Uses a lightweight regex-based approach to avoid heavy dependencies.
 * Sanitizes raw HTML to prevent XSS.
 */

export function markdownToHtml(markdown: string): string {
  let html = markdown

  // Extract and protect code blocks first (preserve them)
  const codeBlocks: string[] = []
  html = html.replace(/```[\s\S]*?```/g, (match) => {
    const index = codeBlocks.length
    const code = match.replace(/^```\w*\n?/, '').replace(/\n?```$/, '')
    codeBlocks.push(
      `<pre style="background:#1e1e2e;color:#cdd6f4;padding:12px;border-radius:6px;overflow-x:auto;font-size:13px;line-height:1.5"><code>${escapeHtml(code)}</code></pre>`
    )
    return `%%CODEBLOCK_${index}%%`
  })

  // Inline code — escape HTML inside backticks
  html = html.replace(/`([^`]+)`/g, (_, code) =>
    `<code style="background:#f0f0f0;padding:2px 6px;border-radius:3px;font-size:13px">${escapeHtml(code)}</code>`
  )

  // Sanitize raw HTML tags BEFORE Markdown transforms — strip any remaining HTML tags
  // This prevents XSS via <script>, <img onerror=...>, etc.
  html = html.replace(/<(?!\/?(code|pre)\b)[^>]*>/g, (match) => escapeHtml(match))

  // Headings (h1-h6)
  html = html.replace(/^######\s+(.+)$/gm, '<h6 style="font-size:14px;font-weight:600;margin:16px 0 8px">$1</h6>')
  html = html.replace(/^#####\s+(.+)$/gm, '<h5 style="font-size:15px;font-weight:600;margin:16px 0 8px">$1</h5>')
  html = html.replace(/^####\s+(.+)$/gm, '<h4 style="font-size:16px;font-weight:600;margin:18px 0 8px">$1</h4>')
  html = html.replace(/^###\s+(.+)$/gm, '<h3 style="font-size:18px;font-weight:600;margin:20px 0 10px">$1</h3>')
  html = html.replace(/^##\s+(.+)$/gm, '<h2 style="font-size:22px;font-weight:600;margin:24px 0 12px">$1</h2>')
  html = html.replace(/^#\s+(.+)$/gm, '<h1 style="font-size:26px;font-weight:700;margin:28px 0 14px">$1</h1>')

  // Bold and italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>')

  // Links — validate URL scheme to prevent javascript: injection
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, url) => {
    const sanitizedUrl = isSafeUrl(url) ? url : '#'
    return `<a href="${sanitizedUrl}" style="color:#1d4ed8;text-decoration:underline">${text}</a>`
  })

  // Horizontal rule
  html = html.replace(/^---+$/gm, '<hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">')

  // Ordered lists — process BEFORE unordered to avoid conflicts
  html = html.replace(/^[\s]*\d+\.\s+(.+)$/gm, '<oli style="margin:4px 0">$1</oli>')
  html = html.replace(/(<oli[^>]*>.*<\/oli>\n?)+/g, (match) => {
    const items = match.replace(/oli>/g, 'li>')
    return `<ol style="padding-left:24px;margin:12px 0">${items}</ol>`
  })

  // Unordered lists
  html = html.replace(/^[\s]*[-*]\s+(.+)$/gm, '<li style="margin:4px 0">$1</li>')
  html = html.replace(/(<li[^>]*>.*<\/li>\n?)+/g, '<ul style="padding-left:24px;margin:12px 0">$&</ul>')

  // Blockquotes
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote style="border-left:4px solid #d1d5db;padding-left:16px;margin:12px 0;color:#6b7280">$1</blockquote>')

  // Paragraphs — wrap remaining lines
  html = html.replace(/^(?!<[a-z]|%%CODEBLOCK)(.+)$/gm, '<p style="margin:8px 0;line-height:1.6">$1</p>')

  // Restore code blocks
  codeBlocks.forEach((block, index) => {
    html = html.replace(`%%CODEBLOCK_${index}%%`, block)
  })

  // Clean up empty lines
  html = html.replace(/\n{3,}/g, '\n\n')

  return html.trim()
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function isSafeUrl(url: string): boolean {
  const trimmed = url.trim().toLowerCase()
  // Allow only http, https, mailto, and relative URLs
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('mailto:')) {
    return true
  }
  // Allow relative URLs (starting with / or # or no protocol)
  if (trimmed.startsWith('/') || trimmed.startsWith('#') || trimmed.startsWith('.')) {
    return true
  }
  // Block javascript:, data:, vbscript:, etc.
  if (/^[a-z]+:/i.test(trimmed)) {
    return false
  }
  // Allow plain text URLs without protocol
  return true
}
