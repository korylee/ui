import { Theme } from '../../_hooks'
import { commonLight } from '../../_styles/common'

export const self = () => {
  return {
    color: '#0000'
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
