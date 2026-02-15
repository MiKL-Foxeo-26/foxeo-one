import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Helper to generate valid UUIDs for testing
const testUuid1 = '550e8400-e29b-41d4-a716-446655440000'
const testUuid2 = '550e8400-e29b-41d4-a716-446655440001'

describe('CRM Types', () => {
  it('should have Client type defined', async () => {
    const { Client } = await import('./crm.types')

    expect(Client).toBeDefined()

    // Test that Client type has required fields
    const testClient: z.infer<typeof Client> = {
      id: testUuid1,
      operatorId: testUuid2,
      name: 'Test Client',
      company: 'Test Company',
      email: 'test@example.com',
      clientType: 'complet',
      status: 'lab-actif',
      sector: 'Tech',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    expect(testClient).toBeDefined()
  })

  it('should have ClientListItem type defined', async () => {
    const { ClientListItem } = await import('./crm.types')

    expect(ClientListItem).toBeDefined()

    const testItem: z.infer<typeof ClientListItem> = {
      id: testUuid1,
      name: 'Test Client',
      company: 'Test Company',
      clientType: 'complet',
      status: 'lab-actif',
      createdAt: new Date().toISOString()
    }

    expect(testItem).toBeDefined()
  })

  it('should have ClientFilters type defined', async () => {
    const { ClientFilters } = await import('./crm.types')

    expect(ClientFilters).toBeDefined()

    const testFilters: z.infer<typeof ClientFilters> = {
      search: 'test',
      clientType: ['complet'],
      status: ['lab-actif'],
      sector: ['Tech']
    }

    expect(testFilters).toBeDefined()
  })

  it('should validate client type enum correctly', async () => {
    const { Client } = await import('./crm.types')

    // Valid client types
    expect(() => Client.parse({
      id: testUuid1,
      operatorId: testUuid2,
      name: 'Test',
      company: 'Test Co',
      email: 'test@test.com',
      clientType: 'complet',
      status: 'lab-actif',
      sector: 'Tech',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })).not.toThrow()

    expect(() => Client.parse({
      id: testUuid1,
      operatorId: testUuid2,
      name: 'Test',
      company: 'Test Co',
      email: 'test@test.com',
      clientType: 'direct-one',
      status: 'lab-actif',
      sector: 'Tech',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })).not.toThrow()

    expect(() => Client.parse({
      id: testUuid1,
      operatorId: testUuid2,
      name: 'Test',
      company: 'Test Co',
      email: 'test@test.com',
      clientType: 'ponctuel',
      status: 'lab-actif',
      sector: 'Tech',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })).not.toThrow()

    // Invalid client type
    expect(() => Client.parse({
      id: testUuid1,
      operatorId: testUuid2,
      name: 'Test',
      company: 'Test Co',
      email: 'test@test.com',
      clientType: 'invalid',
      status: 'lab-actif',
      sector: 'Tech',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })).toThrow()
  })

  it('should validate status enum correctly', async () => {
    const { Client } = await import('./crm.types')

    // Valid statuses
    const validStatuses = ['lab-actif', 'one-actif', 'inactif', 'suspendu'] as const

    validStatuses.forEach(status => {
      expect(() => Client.parse({
        id: testUuid1,
        operatorId: testUuid2,
        name: 'Test',
        company: 'Test Co',
        email: 'test@test.com',
        clientType: 'complet',
        status,
        sector: 'Tech',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })).not.toThrow()
    })

    // Invalid status
    expect(() => Client.parse({
      id: testUuid1,
      operatorId: testUuid2,
      name: 'Test',
      company: 'Test Co',
      email: 'test@test.com',
      clientType: 'complet',
      status: 'invalid-status' as any,
      sector: 'Tech',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })).toThrow()
  })

  it('should have CreateClientInput type inferred from schema', async () => {
    const { CreateClientInput } = await import('./crm.types')

    expect(CreateClientInput).toBeDefined()

    const validInput = CreateClientInput.parse({
      name: 'Jean Dupont',
      email: 'jean@acme.com',
      clientType: 'ponctuel',
    })

    expect(validInput.name).toBe('Jean Dupont')
    expect(validInput.email).toBe('jean@acme.com')
    expect(validInput.clientType).toBe('ponctuel')
  })

  it('should have UpdateClientInput type with all optional fields', async () => {
    const { UpdateClientInput } = await import('./crm.types')

    expect(UpdateClientInput).toBeDefined()

    // Partial update
    const validInput = UpdateClientInput.parse({
      name: 'Nouveau Nom',
    })

    expect(validInput.name).toBe('Nouveau Nom')
  })

  it('should allow optional fields in ClientFilters', async () => {
    const { ClientFilters } = await import('./crm.types')

    // All fields optional
    expect(() => ClientFilters.parse({})).not.toThrow()

    // Partial filters
    expect(() => ClientFilters.parse({ search: 'test' })).not.toThrow()
    expect(() => ClientFilters.parse({ clientType: ['complet'] })).not.toThrow()
    expect(() => ClientFilters.parse({ status: ['lab-actif', 'one-actif'] })).not.toThrow()
  })
})

// ============================================================
// Parcours Types (Story 2.4)
// ============================================================

describe('Parcours Types', () => {
  const now = new Date().toISOString()

  it('should validate ParcoursTypeEnum correctly', async () => {
    const { ParcoursTypeEnum } = await import('./crm.types')

    expect(ParcoursTypeEnum.parse('complet')).toBe('complet')
    expect(ParcoursTypeEnum.parse('partiel')).toBe('partiel')
    expect(ParcoursTypeEnum.parse('ponctuel')).toBe('ponctuel')
    expect(() => ParcoursTypeEnum.parse('invalid')).toThrow()
  })

  it('should validate ParcoursStatusEnum correctly', async () => {
    const { ParcoursStatusEnum } = await import('./crm.types')

    expect(ParcoursStatusEnum.parse('en_cours')).toBe('en_cours')
    expect(ParcoursStatusEnum.parse('suspendu')).toBe('suspendu')
    expect(ParcoursStatusEnum.parse('termine')).toBe('termine')
    expect(() => ParcoursStatusEnum.parse('invalid')).toThrow()
  })

  it('should validate ParcoursStage schema', async () => {
    const { ParcoursStage } = await import('./crm.types')

    const validStage = {
      key: 'vision',
      name: 'Vision',
      description: 'Definir la vision business',
      order: 1,
    }

    expect(ParcoursStage.parse(validStage)).toEqual(validStage)

    // Invalid: empty key
    expect(() => ParcoursStage.parse({ ...validStage, key: '' })).toThrow()
    // Invalid: negative order
    expect(() => ParcoursStage.parse({ ...validStage, order: -1 })).toThrow()
  })

  it('should validate ActiveStage schema', async () => {
    const { ActiveStage } = await import('./crm.types')

    expect(ActiveStage.parse({ key: 'vision', active: true, status: 'pending' })).toBeDefined()
    expect(ActiveStage.parse({ key: 'offre', active: false, status: 'skipped' })).toBeDefined()
    expect(() => ActiveStage.parse({ key: 'vision', active: true, status: 'invalid' })).toThrow()
  })

  it('should validate ParcoursTemplate schema', async () => {
    const { ParcoursTemplate } = await import('./crm.types')

    const validTemplate = {
      id: testUuid1,
      operatorId: testUuid2,
      name: 'Parcours Complet',
      description: 'Description du parcours',
      parcoursType: 'complet',
      stages: [
        { key: 'vision', name: 'Vision', description: 'Definir la vision', order: 1 },
        { key: 'offre', name: 'Offre', description: 'Structurer l offre', order: 2 },
      ],
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }

    expect(ParcoursTemplate.parse(validTemplate)).toBeDefined()
    expect(ParcoursTemplate.parse({ ...validTemplate, description: null })).toBeDefined()
  })

  it('should validate Parcours schema', async () => {
    const { Parcours } = await import('./crm.types')

    const validParcours = {
      id: testUuid1,
      clientId: testUuid2,
      templateId: testUuid1,
      operatorId: testUuid2,
      activeStages: [
        { key: 'vision', active: true, status: 'pending' },
        { key: 'offre', active: false, status: 'skipped' },
      ],
      status: 'en_cours',
      startedAt: now,
      suspendedAt: null,
      completedAt: null,
      createdAt: now,
      updatedAt: now,
    }

    expect(Parcours.parse(validParcours)).toBeDefined()

    // With suspended
    expect(Parcours.parse({ ...validParcours, status: 'suspendu', suspendedAt: now })).toBeDefined()
  })

  it('should validate AssignParcoursInput schema', async () => {
    const { AssignParcoursInput } = await import('./crm.types')

    const validInput = {
      clientId: testUuid1,
      templateId: testUuid2,
      activeStages: [
        { key: 'vision', active: true },
        { key: 'offre', active: false },
      ],
    }

    expect(AssignParcoursInput.parse(validInput)).toBeDefined()

    // Invalid: missing clientId
    expect(() => AssignParcoursInput.parse({ templateId: testUuid2, activeStages: [] })).toThrow()
  })

  it('should validate ToggleAccessInput schema', async () => {
    const { ToggleAccessInput } = await import('./crm.types')

    expect(ToggleAccessInput.parse({ clientId: testUuid1, accessType: 'lab', enabled: true })).toBeDefined()
    expect(ToggleAccessInput.parse({ clientId: testUuid1, accessType: 'one', enabled: false })).toBeDefined()
    expect(() => ToggleAccessInput.parse({ clientId: testUuid1, accessType: 'invalid', enabled: true })).toThrow()
  })
})

// ============================================================
// Client Notes Types (Story 2.6)
// ============================================================

describe('Client Notes Types', () => {
  const now = new Date().toISOString()

  it('should validate ClientNote schema', async () => {
    const { ClientNote } = await import('./crm.types')

    const validNote = {
      id: testUuid1,
      clientId: testUuid2,
      operatorId: testUuid1,
      content: 'Note importante sur ce client',
      createdAt: now,
      updatedAt: now,
    }

    expect(ClientNote.parse(validNote)).toEqual(validNote)

    // Invalid: empty content
    expect(() => ClientNote.parse({ ...validNote, content: '' })).toThrow(/requis/)

    // Invalid: invalid UUID
    expect(() => ClientNote.parse({ ...validNote, id: 'not-a-uuid' })).toThrow()
  })

  it('should validate CreateClientNoteInput schema', async () => {
    const { CreateClientNoteInput } = await import('./crm.types')

    const validInput = {
      clientId: testUuid1,
      content: 'Nouvelle note privée',
    }

    expect(CreateClientNoteInput.parse(validInput)).toEqual(validInput)

    // Invalid: empty content
    expect(() => CreateClientNoteInput.parse({ ...validInput, content: '' })).toThrow(/requis/)

    // Invalid: content too long
    const longContent = 'a'.repeat(5001)
    expect(() => CreateClientNoteInput.parse({ ...validInput, content: longContent })).toThrow(/5000/)

    // Valid: exactly 5000 characters
    const exactContent = 'a'.repeat(5000)
    expect(() => CreateClientNoteInput.parse({ ...validInput, content: exactContent })).not.toThrow()
  })

  it('should validate UpdateClientNoteInput schema', async () => {
    const { UpdateClientNoteInput } = await import('./crm.types')

    const validInput = {
      noteId: testUuid1,
      content: 'Contenu mis à jour',
    }

    expect(UpdateClientNoteInput.parse(validInput)).toEqual(validInput)

    // Invalid: empty content
    expect(() => UpdateClientNoteInput.parse({ ...validInput, content: '' })).toThrow(/requis/)

    // Invalid: content too long
    const longContent = 'a'.repeat(5001)
    expect(() => UpdateClientNoteInput.parse({ ...validInput, content: longContent })).toThrow(/5000/)
  })

  it('should validate DeferClientInput schema', async () => {
    const { DeferClientInput } = await import('./crm.types')

    // Valid: with date
    const validInput = {
      clientId: testUuid1,
      deferredUntil: '2026-02-20T10:00:00Z',
    }

    expect(DeferClientInput.parse(validInput)).toEqual(validInput)

    // Valid: clearing defer with null
    const clearInput = {
      clientId: testUuid1,
      deferredUntil: null,
    }

    expect(DeferClientInput.parse(clearInput)).toEqual(clearInput)

    // Invalid: bad date format
    expect(() => DeferClientInput.parse({ clientId: testUuid1, deferredUntil: '2026-02-20' })).toThrow()
  })

  it('should validate ClientListItem with isPinned and deferredUntil', async () => {
    const { ClientListItem } = await import('./crm.types')

    // Valid: with both isPinned and deferredUntil
    const pinnedClient = {
      id: testUuid1,
      name: 'Test Client',
      company: 'Test Company',
      clientType: 'complet' as const,
      status: 'lab-actif' as const,
      createdAt: now,
      isPinned: true,
      deferredUntil: '2026-02-20T10:00:00Z',
    }

    expect(ClientListItem.parse(pinnedClient)).toBeDefined()

    // Valid: without optional fields
    const simpleClient = {
      id: testUuid1,
      name: 'Test Client',
      company: 'Test Company',
      clientType: 'ponctuel' as const,
      status: 'inactif' as const,
      createdAt: now,
    }

    expect(ClientListItem.parse(simpleClient)).toBeDefined()

    // Valid: with isPinned false and deferredUntil null
    const unpinnedClient = {
      ...simpleClient,
      isPinned: false,
      deferredUntil: null,
    }

    expect(ClientListItem.parse(unpinnedClient)).toBeDefined()
  })
})
