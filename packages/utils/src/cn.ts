import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utilitaire pour fusionner les classes CSS avec Tailwind
 * Combine clsx et tailwind-merge pour une gestion propre des classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
