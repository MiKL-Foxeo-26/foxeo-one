'use client'

interface BriefAssetsGalleryProps {
  assets: string[]
}

function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be')
}

function isVimeoUrl(url: string): boolean {
  return url.includes('vimeo.com')
}

function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url)
}

function getYouTubeEmbedUrl(url: string): string {
  const watchMatch = url.match(/[?&]v=([^&]+)/)
  const shortMatch = url.match(/youtu\.be\/([^?]+)/)
  const id = watchMatch?.[1] ?? shortMatch?.[1] ?? ''
  return `https://www.youtube.com/embed/${id}`
}

function getVimeoEmbedUrl(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)/)
  const id = match?.[1] ?? ''
  return `https://player.vimeo.com/video/${id}`
}

export function BriefAssetsGallery({ assets }: BriefAssetsGalleryProps) {
  if (!assets || assets.length === 0) return null

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">Ressources</h2>
      <div className="grid gap-4">
        {assets.map((url, index) => {
          if (isYouTubeUrl(url)) {
            return (
              <div key={index} className="aspect-video rounded-lg overflow-hidden border border-border bg-muted/20">
                <iframe
                  src={getYouTubeEmbedUrl(url)}
                  className="w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  title={`Vidéo ${index + 1}`}
                />
              </div>
            )
          }

          if (isVimeoUrl(url)) {
            return (
              <div key={index} className="aspect-video rounded-lg overflow-hidden border border-border bg-muted/20">
                <iframe
                  src={getVimeoEmbedUrl(url)}
                  className="w-full h-full"
                  allowFullScreen
                  title={`Vidéo ${index + 1}`}
                />
              </div>
            )
          }

          if (isImageUrl(url)) {
            return (
              <img
                key={index}
                src={url}
                alt={`Ressource ${index + 1}`}
                className="rounded-lg max-w-full h-auto border border-border"
              />
            )
          }

          // Fallback: generic link
          return (
            <a
              key={index}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline text-sm"
            >
              {url}
            </a>
          )
        })}
      </div>
    </section>
  )
}
