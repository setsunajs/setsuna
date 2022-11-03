export function error(type, message, errorTask = []) {
  return message
    ? console.error(`[setsuna \`${type}\` error]: ${message}`, ...errorTask)
    : console.error(type)
}
