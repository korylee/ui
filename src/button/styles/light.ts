import { Theme } from '../../_hooks'
import { commonLight, ThemeCommonVars } from '../../_styles/common'
import commonVars from './common-vars'

const createBorder = (color: string) => `1px solid ${color}`

export const self = (vars: ThemeCommonVars) => {
  const {
    heightTiny,
    heightSmall,
    heightMedium,
    heightLarge,
    primaryColor,
    fontWeight,
    fontWeightStrong,
    textColor2,
    baseColor,
    primaryColorHover,
    primaryColorPressed,
    infoColor,
    infoColorHover,
    infoColorPressed,
    successColor,
    successColorHover,
    successColorPressed,
    warningColor,
    warningColorHover,
    warningColorPressed,
    errorColor,
    errorColorHover,
    errorColorPressed,
    borderRadius,
    fontSizeTiny,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    opacityDisabled,
    borderColor
  } = vars
  return {
    ...commonVars,
    heightTiny,
    heightSmall,
    heightMedium,
    heightLarge,
    borderRadiusTiny: borderRadius,
    borderRadiusSmall: borderRadius,
    borderRadiusMedium: borderRadius,
    borderRadiusLarge: borderRadius,
    fontSizeTiny,
    fontSizeSmall,
    fontSizeMedium,
    fontSizeLarge,
    opacityDisabled,
    //default
    color: '#0000',
    colorHover: '#0000',
    colorPressed: '#0000',
    colorFocus: '#0000',
    colorDisabled: '#0000',
    textColor: textColor2,
    textColorText: textColor2,
    textColorTextHover: primaryColorHover,
    textColorTextPressed: primaryColorPressed,
    textColorTextFocus: primaryColorHover,
    textColorTextDisabled: textColor2,
    textColorGhost: textColor2,
    textColorGhostHover: primaryColorHover,
    textColorGhostPressed: primaryColorPressed,
    textColorGhostFocus: primaryColorHover,
    textColorGhostDisabled: textColor2,
    border: `1px solid ${borderColor}`,
    //primary
    colorPrimary: primaryColor,
    colorHoverPrimary: primaryColorHover,
    colorPressedPrimary: primaryColorPressed,
    textColorPrimary: baseColor,
    textColorTextPrimary: primaryColor,
    textColorTextHoverPrimary: primaryColorHover,
    borderPrimary: createBorder(primaryColor),
    //info
    colorInfo: infoColor,
    colorHoverInfo: infoColorHover,
    colorPressedInfo: infoColorPressed,
    textColorTextInfo: infoColor,
    borderInfo: createBorder(infoColor),
    // success
    colorSuccess: successColor,
    colorHoverSuccess: successColorHover,
    colorPressedSuccess: successColorPressed,
    textColorTextSuccess: successColor,
    borderSuccess: createBorder(successColor),
    // warning
    colorWarning: warningColor,
    colorHoverWarning: warningColorHover,
    colorPressedWarning: warningColorPressed,
    textColorTextWarning: warningColor,
    borderWarning: createBorder(warningColor),
    //error
    colorError: errorColor,
    colorHoverError: errorColorHover,
    colorPressedError: errorColorPressed,
    textColorTextError: errorColor,
    borderError: createBorder(errorColor),

    waveOpacity: '0.6',
    fontWeight,
    fontWeightStrong
  }
}

export type ButtonThemeVars = ReturnType<typeof self>

const buttonLight: Theme<'Button', ButtonThemeVars> = {
  name: 'Button',
  common: commonLight,
  self
}

export default buttonLight
export type ButtonTheme = typeof buttonLight
