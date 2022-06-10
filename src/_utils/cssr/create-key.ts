export function createKey<P extends string, S extends string>(
  prefix: P,
  suffix: S
): S extends 'default' ? P : `${P}${Capitalize<S>}` {
  return suffix === 'default'
    ? prefix
    : (`${prefix}${suffix.replace(/^[a-z]/, (startChar) =>
        startChar.toUpperCase()
      )}` as any)
}
