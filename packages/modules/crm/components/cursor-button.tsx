'use client'

import { useState } from 'react'
import { Button, Alert, AlertDescription } from '@foxeo/ui'
import { showSuccess, showInfo } from '@foxeo/ui'
import {
  buildClientSlug,
  buildBmadPath,
  buildCursorUrl,
} from '../utils/cursor-integration'

interface CursorButtonProps {
  clientName: string
  companyName?: string
  folderExists?: boolean
}

export function CursorButton({
  clientName,
  companyName,
  folderExists = true,
}: CursorButtonProps) {
  const [showFallback, setShowFallback] = useState(false)

  const clientSlug = buildClientSlug(clientName, companyName)
  const bmadPath = buildBmadPath(clientSlug)
  const cursorUrl = buildCursorUrl(bmadPath)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bmadPath)
      showSuccess('Chemin copié dans le presse-papier')
    } catch (error) {
      showInfo('Impossible de copier automatiquement')
    }
  }

  const handleOpenCursor = () => {
    // Attempt to open Cursor
    try {
      window.location.href = cursorUrl

      // Set fallback timeout
      setTimeout(() => {
        setShowFallback(true)
      }, 1500)
    } catch (error) {
      setShowFallback(true)
    }
  }

  // Show missing folder state immediately if folder doesn't exist
  if (!folderExists) {
    return (
      <div className="space-y-3">
        <Alert>
          <AlertDescription>
            Le dossier BMAD de ce client n'existe pas encore. Créez-le d'abord
            dans : <code className="text-sm">{bmadPath}</code>
          </AlertDescription>
        </Alert>
        <Button variant="secondary" onClick={handleCopy}>
          Copier le chemin
        </Button>
      </div>
    )
  }

  if (showFallback) {
    return (
      <div className="space-y-3">
        <Alert>
          <AlertDescription>
            Le protocole Cursor n'est pas supporté par votre navigateur. Copiez
            le chemin ci-dessous et ouvrez-le manuellement dans Cursor (File →
            Open Folder).
          </AlertDescription>
        </Alert>
        <div className="flex items-center gap-2">
          <code className="flex-1 rounded bg-muted px-3 py-2 text-sm">
            {bmadPath}
          </code>
          <Button variant="secondary" onClick={handleCopy}>
            Copier
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Button onClick={handleOpenCursor} variant="outline">
      Ouvrir dans Cursor
    </Button>
  )
}
