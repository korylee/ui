import { createTheme } from '../../_hooks/use-theme'
import { commonLight, ThemeCommonVars } from '../../_styles/common'

export const self = (vars: ThemeCommonVars) => {
  const { baseColor, bodyColor, actionColor, textColor2 } = vars
  return {
    textColor: textColor2,
    color: bodyColor,
    colorEmbedded: actionColor,
    siderToggleButtonColor: baseColor
  }
}

export type LayoutThemeVars = ReturnType<typeof self>

const layoutLight = createTheme({
  name: 'Layout',
  common: commonLight,
  peers: {
    // Scrollbar: scrollbarLight
  },
  self
})

export default layoutLight

export type LayoutTheme = typeof layoutLight
