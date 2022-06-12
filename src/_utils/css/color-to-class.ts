export const colorToClass = (color: string): string =>
  color.replace(/#|\(|\)|,|\s/g, '_')
