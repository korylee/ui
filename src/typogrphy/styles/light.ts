import { Theme } from '../../_hooks'
import { commonLight, ThemeCommonVars } from '../../_styles/common'
import commonVars from './common-vars'

export const self = (vars: ThemeCommonVars) => {
  const { primaryColor, textColor2 } = vars
  return {
    ...commonVars,
    aTextColor: primaryColor,
    blockquoteTextColor: textColor2,
    codeBorder: '1px solid #0000'
  }
}

export type TypographyThemeVars = ReturnType<typeof self>

const typographyList: Theme<'Typography', TypographyThemeVars> = {
  name: 'Typography',
  common: commonLight,
  self
}

export default typographyList

export type TypographyTheme = typeof typographyList
