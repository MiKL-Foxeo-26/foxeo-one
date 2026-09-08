import * as React from "react"

import { cn } from "@monprojetpro/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // ⚠️ `field-sizing-content` fait grandir la zone avec le texte saisi. SANS plafond,
        // un long message pousse tout ce qui suit (boutons Envoyer / Annuler) hors de la
        // pop-up : le texte déborde du cadre et l'envoi devient inatteignable.
        // `max-h-[40vh]` + `overflow-y-auto` bornent la croissance et rendent la zone
        // défilable. Un appelant peut toujours imposer son propre `max-h-*` (tailwind-merge).
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 max-h-[40vh] w-full min-w-0 max-w-full overflow-y-auto break-words rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
