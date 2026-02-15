import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReminders } from '../actions/get-reminders'
import { createReminder } from '../actions/create-reminder'
import { updateReminder } from '../actions/update-reminder'
import { toggleReminderComplete } from '../actions/toggle-reminder-complete'
import { deleteReminder } from '../actions/delete-reminder'
import type {
  Reminder,
  ReminderFilter,
  CreateReminderInput,
  UpdateReminderInput,
  ToggleReminderCompleteInput,
} from '../types/crm.types'

interface UseRemindersOptions {
  filter?: ReminderFilter
  month?: number
  year?: number
}

/**
 * Fetch reminders with optional filtering
 */
export function useReminders(options: UseRemindersOptions = {}) {
  const { filter = 'all', month, year } = options

  return useQuery({
    queryKey: ['reminders', { filter, month, year }],
    queryFn: async (): Promise<Reminder[]> => {
      const result = await getReminders({ filter, month, year })
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result.data ?? []
    },
  })
}

/**
 * Create a new reminder
 */
export function useCreateReminder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: CreateReminderInput) => {
      const result = await createReminder(input)
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result.data!
    },
    onSuccess: () => {
      // Invalidate all reminder queries
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
    },
  })
}

/**
 * Update an existing reminder
 */
export function useUpdateReminder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: UpdateReminderInput) => {
      const result = await updateReminder(input)
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result.data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
    },
  })
}

/**
 * Toggle reminder completed status
 */
export function useToggleReminderComplete() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: ToggleReminderCompleteInput) => {
      const result = await toggleReminderComplete(input)
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result.data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
    },
  })
}

/**
 * Delete a reminder
 */
export function useDeleteReminder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { reminderId: string }) => {
      const result = await deleteReminder(input)
      if (result.error) {
        throw new Error(result.error.message)
      }
      return result.data!
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] })
    },
  })
}
