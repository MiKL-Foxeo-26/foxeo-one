// Documented `as T` usage: These functions transform object keys at the DB/API
// boundary. The generic T preserves the caller's expected type shape. The actual
// runtime keys differ (snake_case ↔ camelCase) but the value types remain correct.
// TypeScript cannot express key-transformed types generically without complex mapped
// types that would reduce DX. Tested via co-located unit tests.

function toCamelCaseKey(key: string): string {
  return key.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())
}

function toSnakeCaseKey(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

export function toCamelCase<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item)) as T
  }
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [toCamelCaseKey(key)]: toCamelCase(value),
      }),
      {} as T
    )
  }
  return obj
}

export function toSnakeCase<T>(obj: T): T {
  if (Array.isArray(obj)) {
    return obj.map((item) => toSnakeCase(item)) as T
  }
  if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.entries(obj).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [toSnakeCaseKey(key)]: toSnakeCase(value),
      }),
      {} as T
    )
  }
  return obj
}
