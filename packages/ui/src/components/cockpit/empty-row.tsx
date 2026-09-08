import type { LucideIcon } from 'lucide-react'
import { cn } from '@monprojetpro/utils'

export interface EmptyRowProps {
  children: React.ReactNode
  icon?: LucideIcon
  className?: string
}

/**
 * Ligne « il n'y a rien ici » — compacte, sur une seule ligne.
 *
 * Remplace le paragraphe pleine hauteur qui occupait autant de place qu'un
 * panneau rempli : le regard devait le lire pour découvrir qu'il n'y avait rien
 * à voir. Un vide doit se voir vide, tout de suite, sans prendre la place d'un
 * plein.
 */
export function EmptyRow({ children, icon: Icon, className }: EmptyRowProps) {
  return (
    <p
      className={cn(
        'flex items-center gap-2 px-3 py-2 text-sm italic text-gray-500',
        className,
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0 opacity-60" aria-hidden />}
      {children}
    </p>
  )
}
