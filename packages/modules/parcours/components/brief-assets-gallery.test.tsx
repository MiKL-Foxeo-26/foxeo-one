import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BriefAssetsGallery } from './brief-assets-gallery'

describe('BriefAssetsGallery', () => {
  it('renders nothing when assets array is empty', () => {
    const { container } = render(<BriefAssetsGallery assets={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders images for image URLs', () => {
    render(<BriefAssetsGallery assets={['https://example.com/image.jpg']} />)
    const img = screen.getByRole('img')
    expect(img).toBeDefined()
    expect(img.getAttribute('src')).toBe('https://example.com/image.jpg')
  })

  it('renders iframe for YouTube URLs', () => {
    const { container } = render(
      <BriefAssetsGallery assets={['https://www.youtube.com/watch?v=abc123']} />
    )
    const iframe = container.querySelector('iframe')
    expect(iframe).not.toBeNull()
  })

  it('renders iframe for Vimeo URLs', () => {
    const { container } = render(
      <BriefAssetsGallery assets={['https://vimeo.com/12345678']} />
    )
    const iframe = container.querySelector('iframe')
    expect(iframe).not.toBeNull()
  })

  it('renders multiple assets', () => {
    render(
      <BriefAssetsGallery assets={[
        'https://example.com/image1.jpg',
        'https://example.com/image2.png',
      ]} />
    )
    const imgs = screen.getAllByRole('img')
    expect(imgs).toHaveLength(2)
  })
})
