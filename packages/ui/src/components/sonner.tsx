'use client'

import { Toaster as SonnerToaster } from 'sonner'

export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: 'bg-card border-border text-foreground',
          title: 'text-foreground font-medium',
          description: 'text-muted-foreground',
          success: 'border-l-4 border-l-green-500',
          error: 'border-l-4 border-l-destructive',
          info: 'border-l-4 border-l-primary',
        },
      }}
      richColors
    />
  )
}
