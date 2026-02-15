'use client'

import { ReminderCard } from './reminder-card'
import type { Reminder } from '../types/crm.types'

interface ReminderDayListProps {
  reminders: Reminder[]
  selectedDate: Date
  onEdit?: (reminder: Reminder) => void
}

export function ReminderDayList({ reminders, selectedDate, onEdit }: ReminderDayListProps) {
  // Filter reminders for selected date
  const dayReminders = reminders.filter((r) => {
    const reminderDate = new Date(r.dueDate)
    return (
      reminderDate.getDate() === selectedDate.getDate() &&
      reminderDate.getMonth() === selectedDate.getMonth() &&
      reminderDate.getFullYear() === selectedDate.getFullYear()
    )
  })

  if (dayReminders.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Aucun rappel pour cette date</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium mb-3">
        {selectedDate.toLocaleDateString('fr-FR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
      {dayReminders.map((reminder) => (
        <ReminderCard key={reminder.id} reminder={reminder} onEdit={onEdit} />
      ))}
    </div>
  )
}
