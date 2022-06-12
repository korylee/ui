import { composite } from 'seemly'

export const createHoverColor = (rgb: string) =>
  composite(rgb, [255, 255, 255, 0.16])

export const createPressedColor = (rgb: string) =>
  composite(rgb, [0, 0, 0, 0.12])
