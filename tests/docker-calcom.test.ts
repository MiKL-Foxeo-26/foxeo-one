import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const CALCOM_DIR = join(__dirname, '..', 'docker', 'calcom')

describe('Cal.com Docker Compose', () => {
  const composePath = join(CALCOM_DIR, 'docker-compose.yml')

  it('docker-compose.yml exists', () => {
    expect(existsSync(composePath)).toBe(true)
  })

  it('defines calcom service', () => {
    const content = readFileSync(composePath, 'utf-8')
    expect(content).toContain('calcom/cal.com')
  })

  it('exposes port 3001 for Cal.com', () => {
    const content = readFileSync(composePath, 'utf-8')
    expect(content).toContain('3001:3000')
  })

  it('defines calcom-db service with postgres 15', () => {
    const content = readFileSync(composePath, 'utf-8')
    expect(content).toContain('calcom-db:')
    expect(content).toContain('postgres:15')
  })

  it('calcom depends on calcom-db', () => {
    const content = readFileSync(composePath, 'utf-8')
    expect(content).toContain('depends_on')
    expect(content).toContain('calcom-db')
  })

  it('uses environment variables for secrets (not hardcoded)', () => {
    const content = readFileSync(composePath, 'utf-8')
    expect(content).toContain('${CALCOM_NEXTAUTH_SECRET}')
    expect(content).toContain('${CALCOM_ENCRYPTION_KEY}')
  })

  it('defines persistent volume for database', () => {
    const content = readFileSync(composePath, 'utf-8')
    expect(content).toContain('calcom_data:')
  })
})
