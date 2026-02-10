export type ActionError = {
  message: string
  code: string
  details?: unknown
}

export type ActionResponse<T> = {
  data: T | null
  error: ActionError | null
}

export function successResponse<T>(data: T): ActionResponse<T> {
  return { data, error: null }
}

export function errorResponse(
  message: string,
  code: string,
  details?: unknown
): ActionResponse<never> {
  return { data: null, error: { message, code, details } }
}
