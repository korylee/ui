import type { ThemeType } from '../../_hooks'

import commonVars from './common-vars'
const self = () => commonVars

export type SpaceThemeVars = ReturnType<typeof self>

const spaceLight: ThemeType<'Space', SpaceThemeVars> = {
  name: 'Space',
  self
}

export default spaceLight

export type SpaceTheme = typeof spaceLight
