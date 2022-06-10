import { createTheme } from '../../_hooks/use-theme'
import { commonLight, ThemeCommonVars } from '../../_styles/common'

export const self = (vars: ThemeCommonVars) => {
  const { iconColor } = vars
  return {
    itemIconColor: iconColor
  }
}

export type UploadThemeVars = ReturnType<typeof self>

const uploadLight = createTheme({
  name: 'upload',
  common: commonLight,
  peers: {},
  self
})

export default uploadLight

export type UploadTheme = typeof uploadLight
