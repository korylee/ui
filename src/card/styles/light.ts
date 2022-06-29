import { Theme } from '../../_hooks'
import { commonLight, ThemeCommonVars } from '../../_styles/common'
import commonVariables from './common-variables'

export const self = (vars: ThemeCommonVars) => {
  const { primaryColor, lineHeight } = vars
  return {
    ...commonVariables,
    lineHeight,
    colorTarget: primaryColor
  }
}

export type CardThemeVars = ReturnType<typeof self>

const cardLight: Theme<'Card', CardThemeVars> = {
  name: 'Card',
  common: commonLight,
  self
}

export default cardLight

export type CardTheme = typeof cardLight
