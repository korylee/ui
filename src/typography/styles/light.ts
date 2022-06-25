import { Theme } from '../../_hooks'
import { commonLight, ThemeCommonVars } from '../../_styles/common'
import commonVars from './common-vars'

export const self = (vars: ThemeCommonVars) => {
  const {
    primaryColor,
    textColor1,
    textColor2,
    textColor3,
    codeColor,
    borderRadiusSmall,
    fontSize
  } = vars
  return {
    ...commonVars,
    textColor: textColor2,
    aTextColor: primaryColor,
    blockquoteTextColor: textColor2,
    textColor1Depth: textColor1,
    textColor2Depth: textColor2,
    textColor3Depth: textColor3,
    textColorPrimary: primaryColor,
    pFontSize: fontSize,
    codeColor,
    codeBorderRadius: borderRadiusSmall,
    codeTextColor: textColor2,
    codeBorder: '1px solid #0000'
  }
}

export type TypographyThemeVars = ReturnType<typeof self>

const typographyLight: Theme<'Typography', TypographyThemeVars> = {
  name: 'Typography',
  common: commonLight,
  self
}

export default typographyLight

export type TypographyTheme = typeof typographyLight
