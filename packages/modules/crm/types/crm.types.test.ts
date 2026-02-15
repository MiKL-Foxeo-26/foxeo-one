import { describe, it, expect } from 'vitest'
import {
  Reminder,
  CreateReminderInput,
  UpdateReminderInput,
  ToggleReminderCompleteInput,
  ReminderFilterEnum,
} from './crm.types'

describe('Reminder Types & Schemas', () => {
  describe('Reminder schema', () => {
    it('validates a complete reminder object', () => {
      const validReminder = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        operatorId: '123e4567-e89b-12d3-a456-426614174001',
        clientId: '123e4567-e89b-12d3-a456-426614174002',
        title: 'Call client',
        description: 'Discuss project scope',
        dueDate: new Date().toISOString(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const result = Reminder.safeParse(validReminder)
      expect(result.success).toBe(true)
    })

    it('validates reminder with nullable clientId', () => {
      const reminderWithoutClient = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        operatorId: '123e4567-e89b-12d3-a456-426614174001',
        clientId: null,
        title: 'General task',
        description: null,
        dueDate: new Date().toISOString(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const result = Reminder.safeParse(reminderWithoutClient)
      expect(result.success).toBe(true)
    })

    it('rejects reminder without required title', () => {
      const invalidReminder = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        operatorId: '123e4567-e89b-12d3-a456-426614174001',
        clientId: null,
        title: '',
        dueDate: new Date().toISOString(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const result = Reminder.safeParse(invalidReminder)
      expect(result.success).toBe(false)
    })

    it('rejects reminder with invalid UUID', () => {
      const invalidReminder = {
        id: 'not-a-uuid',
        operatorId: '123e4567-e89b-12d3-a456-426614174001',
        clientId: null,
        title: 'Task',
        dueDate: new Date().toISOString(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const result = Reminder.safeParse(invalidReminder)
      expect(result.success).toBe(false)
    })
  })

  describe('CreateReminderInput schema', () => {
    it('validates valid create input', () => {
      const validInput = {
        title: 'New reminder',
        description: 'Do this task',
        dueDate: new Date(Date.now() + 86400000).toISOString(), // +1 day
        clientId: '123e4567-e89b-12d3-a456-426614174000',
      }

      const result = CreateReminderInput.safeParse(validInput)
      expect(result.success).toBe(true)
    })

    it('validates create input without optional fields', () => {
      const minimalInput = {
        title: 'Task',
        dueDate: new Date().toISOString(),
      }

      const result = CreateReminderInput.safeParse(minimalInput)
      expect(result.success).toBe(true)
    })

    it('rejects title longer than 200 characters', () => {
      const invalidInput = {
        title: 'a'.repeat(201),
        dueDate: new Date().toISOString(),
      }

      const result = CreateReminderInput.safeParse(invalidInput)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('200')
      }
    })

    it('rejects description longer than 1000 characters', () => {
      const invalidInput = {
        title: 'Task',
        description: 'a'.repeat(1001),
        dueDate: new Date().toISOString(),
      }

      const result = CreateReminderInput.safeParse(invalidInput)
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('1000')
      }
    })

    it('rejects empty title', () => {
      const invalidInput = {
        title: '',
        dueDate: new Date().toISOString(),
      }

      const result = CreateReminderInput.safeParse(invalidInput)
      expect(result.success).toBe(false)
    })

    it('rejects invalid date format', () => {
      const invalidInput = {
        title: 'Task',
        dueDate: '2024-13-45', // Invalid date
      }

      const result = CreateReminderInput.safeParse(invalidInput)
      expect(result.success).toBe(false)
    })
  })

  describe('UpdateReminderInput schema', () => {
    it('validates update with all optional fields', () => {
      const validInput = {
        reminderId: '123e4567-e89b-12d3-a456-426614174000',
        title: 'Updated title',
        description: 'Updated description',
        dueDate: new Date().toISOString(),
      }

      const result = UpdateReminderInput.safeParse(validInput)
      expect(result.success).toBe(true)
    })

    it('validates update with only reminderId', () => {
      const minimalInput = {
        reminderId: '123e4567-e89b-12d3-a456-426614174000',
      }

      const result = UpdateReminderInput.safeParse(minimalInput)
      expect(result.success).toBe(true)
    })

    it('validates update with nullable description', () => {
      const input = {
        reminderId: '123e4567-e89b-12d3-a456-426614174000',
        description: null,
      }

      const result = UpdateReminderInput.safeParse(input)
      expect(result.success).toBe(true)
    })

    it('rejects update without reminderId', () => {
      const invalidInput = {
        title: 'Updated',
      }

      const result = UpdateReminderInput.safeParse(invalidInput)
      expect(result.success).toBe(false)
    })

    it('rejects title longer than 200 characters', () => {
      const invalidInput = {
        reminderId: '123e4567-e89b-12d3-a456-426614174000',
        title: 'a'.repeat(201),
      }

      const result = UpdateReminderInput.safeParse(invalidInput)
      expect(result.success).toBe(false)
    })
  })

  describe('ToggleReminderCompleteInput schema', () => {
    it('validates valid toggle input', () => {
      const validInput = {
        reminderId: '123e4567-e89b-12d3-a456-426614174000',
      }

      const result = ToggleReminderCompleteInput.safeParse(validInput)
      expect(result.success).toBe(true)
    })

    it('rejects invalid UUID', () => {
      const invalidInput = {
        reminderId: 'not-a-uuid',
      }

      const result = ToggleReminderCompleteInput.safeParse(invalidInput)
      expect(result.success).toBe(false)
    })

    it('rejects missing reminderId', () => {
      const invalidInput = {}

      const result = ToggleReminderCompleteInput.safeParse(invalidInput)
      expect(result.success).toBe(false)
    })
  })

  describe('ReminderFilterEnum', () => {
    it('validates all filter values', () => {
      expect(ReminderFilterEnum.safeParse('all').success).toBe(true)
      expect(ReminderFilterEnum.safeParse('upcoming').success).toBe(true)
      expect(ReminderFilterEnum.safeParse('overdue').success).toBe(true)
      expect(ReminderFilterEnum.safeParse('completed').success).toBe(true)
    })

    it('rejects invalid filter value', () => {
      const result = ReminderFilterEnum.safeParse('invalid')
      expect(result.success).toBe(false)
    })
  })
})
