'use client'

import { useState, useRef, type KeyboardEvent } from 'react'
import { Button, Textarea } from '@foxeo/ui'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSend: (content: string) => void
  isSending?: boolean
  disabled?: boolean
  placeholder?: string
}

export function ChatInput({
  onSend,
  isSending = false,
  disabled = false,
  placeholder = 'Écrivez votre message...',
}: ChatInputProps) {
  const [content, setContent] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const canSend = content.trim().length > 0 && !isSending && !disabled

  function handleSend() {
    if (!canSend) return
    onSend(content.trim())
    setContent('')
    textareaRef.current?.focus()
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-end gap-2 border-t p-3" data-testid="chat-input">
      <Textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled || isSending}
        rows={1}
        className="min-h-[40px] max-h-[120px] resize-none"
        aria-label="Message"
      />
      <Button
        type="button"
        size="icon"
        onClick={handleSend}
        disabled={!canSend}
        aria-label="Envoyer le message"
        data-testid="send-button"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  )
}
