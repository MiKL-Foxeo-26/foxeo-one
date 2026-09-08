'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { SlidersHorizontal } from 'lucide-react'
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  toast,
} from '@monprojetpro/ui'
import { saveProjectWidgetPrefs } from '../../actions/project-widget-prefs'

/** Une case de la pop-up — aplatie côté serveur pour rester sérialisable. */
export interface WidgetChoice {
  key: string
  label: string
  hint?: string
  projectName: string
  enabled: boolean
}

/**
 * Pop-up « Choisir mes tuiles ». MiKL coche ce qu'il veut voir sur son accueil.
 *
 * L'état complet (cochées ET décochées) part à l'enregistrement : une case
 * décochée doit laisser une trace en base, sinon elle retomberait sur le défaut
 * du registre et réapparaîtrait au prochain chargement.
 */
export function ProjectCornerSettings({ choices }: { choices: WidgetChoice[] }) {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(choices.map((c) => [c.key, c.enabled])),
  )
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Regroupement par projet, dans l'ordre reçu du registre.
  const groups = choices.reduce<Record<string, WidgetChoice[]>>((acc, c) => {
    ;(acc[c.projectName] ??= []).push(c)
    return acc
  }, {})

  const save = () => {
    startTransition(async () => {
      const res = await saveProjectWidgetPrefs(state)
      if (res.error) {
        toast.error(res.error.message)
        return
      }
      toast.success('Affichage mis à jour')
      setOpen(false)
      router.refresh()
    })
  }

  const reset = () => {
    setState(Object.fromEntries(choices.map((c) => [c.key, c.enabled])))
    setOpen(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-gray-400 transition-colors hover:bg-white/5 hover:text-gray-200"
      >
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Choisir mes tuiles
      </button>

      <Dialog open={open} onOpenChange={(o) => (o ? setOpen(true) : reset())}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Choisir mes tuiles</DialogTitle>
          </DialogHeader>

          <div className="max-h-[50vh] space-y-4 overflow-y-auto">
            {Object.entries(groups).map(([projectName, items]) => (
              <div key={projectName} className="space-y-2">
                <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-gray-500">
                  {projectName}
                </p>
                {items.map((c) => (
                  <label
                    key={c.key}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-white/10 bg-white/[0.02] p-3 transition-colors hover:bg-white/[0.04]"
                  >
                    <Checkbox
                      checked={state[c.key] ?? false}
                      onCheckedChange={(v) =>
                        setState((s) => ({ ...s, [c.key]: v === true }))
                      }
                      className="mt-0.5"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm text-gray-100">{c.label}</span>
                      {c.hint && (
                        <span className="block text-xs text-gray-500">{c.hint}</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            ))}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="ghost" size="sm" onClick={reset} disabled={isPending}>
              Annuler
            </Button>
            <Button size="sm" onClick={save} disabled={isPending}>
              {isPending ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
