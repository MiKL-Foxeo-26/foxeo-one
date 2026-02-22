'use client'

interface MeetingControlsProps {
  isMuted: boolean
  isCameraOff: boolean
  isScreenSharing: boolean
  onToggleMute: () => void
  onToggleCamera: () => void
  onToggleScreenShare: () => void
  onLeave: () => void
}

export function MeetingControls({
  isMuted,
  isCameraOff,
  isScreenSharing,
  onToggleMute,
  onToggleCamera,
  onToggleScreenShare,
  onLeave,
}: MeetingControlsProps) {
  return (
    <div className="flex items-center justify-center gap-3 p-4 bg-black/60 backdrop-blur-sm rounded-2xl">
      <button
        type="button"
        aria-label="Micro"
        data-muted={isMuted ? 'true' : 'false'}
        onClick={onToggleMute}
        className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${
          isMuted
            ? 'border-red-500 bg-red-500/20 text-red-400 hover:bg-red-500/30'
            : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        {isMuted ? '🔇' : '🎤'}
      </button>

      <button
        type="button"
        aria-label="Caméra"
        data-off={isCameraOff ? 'true' : 'false'}
        onClick={onToggleCamera}
        className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${
          isCameraOff
            ? 'border-red-500 bg-red-500/20 text-red-400 hover:bg-red-500/30'
            : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        {isCameraOff ? '📵' : '📹'}
      </button>

      <button
        type="button"
        aria-label="Partage d'écran"
        data-sharing={isScreenSharing ? 'true' : 'false'}
        onClick={onToggleScreenShare}
        className={`flex h-12 w-12 items-center justify-center rounded-full border transition-colors ${
          isScreenSharing
            ? 'border-blue-500 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
            : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
        }`}
      >
        🖥
      </button>

      <button
        type="button"
        aria-label="Quitter"
        onClick={onLeave}
        className="flex h-12 w-28 items-center justify-center gap-2 rounded-full border border-red-600 bg-red-600 text-white transition-colors hover:bg-red-700"
      >
        <span>✕</span>
        <span className="text-sm font-medium">Quitter</span>
      </button>
    </div>
  )
}
