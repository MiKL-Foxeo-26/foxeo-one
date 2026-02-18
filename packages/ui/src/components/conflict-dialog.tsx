'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../dialog'
import { Button } from '../button'

export interface ConflictDialogProps {
  open: boolean
  onReload: () => void
  onForce: () => void
  message?: string
}

export function ConflictDialog({ open, onReload, onForce, message }: ConflictDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Conflit de modification</DialogTitle>
          <DialogDescription>
            {message ?? 'Les données ont été modifiées par un autre utilisateur ou depuis un autre onglet pendant votre édition.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onForce}>
            Forcer ma version
          </Button>
          <Button onClick={onReload} autoFocus>
            Recharger les données
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
