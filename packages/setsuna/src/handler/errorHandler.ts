export function error(type: string, message?: string, errorTask?: unknown[]) {
  return message
    ? console.error(
        `[setsuna \`${type}\` error]: ${message}`,
        ...(errorTask || [])
      )
    : console.error(type)
}
