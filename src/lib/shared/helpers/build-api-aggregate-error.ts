import type { Api404ErrorResponse, ApiErrorResponse } from '../schema'

export function buildApiAggregateError(
  response: Api404ErrorResponse | ApiErrorResponse,
  message: string,
): AggregateError {
  if ('error' in response) {
    return new AggregateError(
      [new Error(`${response.status}: ${response.error}`)],
      message,
    )
  }

  return new AggregateError(
    response.errors.map(
      (error) => new Error(`${error.status}: ${error.title} - ${error.detail}`),
    ),
    message,
  )
}
