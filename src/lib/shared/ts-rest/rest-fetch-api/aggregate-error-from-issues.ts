import { StandardSchemaV1 } from '@ts-rest/core'

function errorFromIssue({ message, path }: StandardSchemaV1.Issue) {
  const pathArray = Array.isArray(path) ? path : []
  const pathString = pathArray.map((part) => String(part)).join('.')
  const separator = pathString ? ': ' : ''
  return new Error(`${pathString}${separator}${message}`)
}

export function aggregateErrorFromIssues(
  issues: readonly StandardSchemaV1.Issue[],
  message: string,
): AggregateError {
  return new AggregateError(issues.map(errorFromIssue), message)
}
