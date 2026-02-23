'use client'

import { useState } from 'react'
import { CreateLabForm } from './create-lab-form'
import { SendResourcesForm } from './send-resources-form'
import { ScheduleFollowUpForm } from './schedule-follow-up-form'
import { NotInterestedForm } from './not-interested-form'
import type { ParcoursTemplate } from './create-lab-form'
import type { ProspectDocument } from './send-resources-form'

type PostMeetingAction = 'create-lab' | 'send-resources' | 'schedule-follow-up' | 'not-interested'

interface PostMeetingDialogProps {
  meetingId: string
  isOpen: boolean
  onClose: () => void
  templates: ParcoursTemplate[]
  prospectDocuments: ProspectDocument[]
  onLabCreated?: (clientId: string) => void
}

export function PostMeetingDialog({
  meetingId,
  isOpen,
  onClose,
  templates,
  prospectDocuments,
  onLabCreated,
}: PostMeetingDialogProps) {
  const [selectedAction, setSelectedAction] = useState<PostMeetingAction | null>(null)

  if (!isOpen) return null

  function handleClose() {
    setSelectedAction(null)
    onClose()
  }

  function handleLabSuccess(clientId: string) {
    onLabCreated?.(clientId)
    handleClose()
  }

  function handleBack() {
    setSelectedAction(null)
  }

  const actions: Array<{ key: PostMeetingAction; emoji: string; label: string }> = [
    { key: 'create-lab', emoji: '🚀', label: 'Créer parcours Lab' },
    { key: 'send-resources', emoji: '📄', label: 'Envoyer ressources' },
    { key: 'schedule-follow-up', emoji: '📅', label: 'Programmer rappel' },
    { key: 'not-interested', emoji: '🚫', label: 'Pas intéressé' },
  ]

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={handleClose} />
      <div className="relative z-10 w-full max-w-lg rounded-xl border border-white/10 bg-background p-6 shadow-xl">
        {selectedAction === null ? (
          <>
            <h2 className="mb-1 text-lg font-semibold">Suite à donner</h2>
            <p className="mb-4 text-sm text-white/60">Quelle action souhaitez-vous effectuer suite à cette visio prospect ?</p>
            <div className="grid grid-cols-2 gap-3">
              {actions.map(({ key, emoji, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedAction(key)}
                  className="flex h-24 flex-col items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 text-sm hover:bg-white/10 transition-colors"
                >
                  <span className="text-2xl">{emoji}</span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="text-sm text-white/40 hover:text-white/70"
              >
                Plus tard
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="mb-4 text-lg font-semibold">
              {actions.find((a) => a.key === selectedAction)?.label}
            </h2>
            {selectedAction === 'create-lab' && (
              <CreateLabForm
                meetingId={meetingId}
                templates={templates}
                onSuccess={handleLabSuccess}
              />
            )}
            {selectedAction === 'send-resources' && (
              <SendResourcesForm
                meetingId={meetingId}
                documents={prospectDocuments}
                onSuccess={handleClose}
              />
            )}
            {selectedAction === 'schedule-follow-up' && (
              <ScheduleFollowUpForm meetingId={meetingId} onSuccess={handleClose} />
            )}
            {selectedAction === 'not-interested' && (
              <NotInterestedForm meetingId={meetingId} onSuccess={handleClose} />
            )}
            <button
              type="button"
              onClick={handleBack}
              className="mt-3 text-sm text-white/40 hover:text-white/70"
            >
              ← Retour
            </button>
          </>
        )}
      </div>
    </div>
  )
}
