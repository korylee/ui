import { composite, rgba } from 'seemly'
import commonVariables from './common-vars'

const base = {
  neutralBase: '#FFF',
  neutralInvertBase: '#000',
  neutralTextBase: '#000',
  neutralPopover: '#fff',
  neutralBody: '#fff',

  alpha1: '0.82',
  alpha2: '0.72',
  alpha3: '0.38',
  alpha4: '0.24', // disabled text, placeholder, icon
  alpha5: '0.18', // disabled placeholder
  alphaDisabled: '0.5',

  // primary
  primaryDefault: '#18a058',
  primaryHover: '#36ad6a',
  primaryActive: '#0c7a43',

  // info
  infoDefault: '#4098fc',
  infoHover: '#2080f0',
  infoActive: '#1060c9',
  infoSuppl: '#4098fc',
  //success
  successDefault: '#18a058',
  successHover: '#36ad6a',
  successActive: '#0c7a43',
  // warning
  warningDefault: '#fcb040',
  warningHover: '#f0a020',
  warningActive: '#c97c10',
  // error
  errorDefault: '#d03050',
  errorHover: '#de576d',
  errorActive: '#ab1f3f',
  errorSuppl: '#de576d'
}
const baseBackgroundRgb = rgba(base.neutralBase)
const baseInvertBackgroundRbg = rgba(base.neutralInvertBase)

function neutral(alpha: string | number) {
  const overlayRgba = Array.from(baseInvertBackgroundRbg)
  overlayRgba[3] = Number(alpha)
  return composite(
    baseBackgroundRgb,
    overlayRgba as [number, number, number, number]
  )
}

const derived = {
  name: 'common',
  ...commonVariables,
  baseColor: base.neutralBase,
  // primary
  primaryColor: base.primaryDefault,
  primaryColorHover: base.primaryHover,
  primaryColorPressed: base.primaryActive,
  // info
  infoColor: base.infoDefault,
  infoColorHover: base.infoHover,
  infoColorPressed: base.infoActive,
  // success
  successColor: base.successDefault,
  successColorHover: base.successHover,
  successColorPressed: base.successActive,
  // waring
  warningColor: base.warningDefault,
  warningColorHover: base.warningHover,
  warningColorPressed: base.warningActive,
  // error
  errorColor: base.errorDefault,
  errorColorHover: base.errorHover,
  errorColorPressed: base.errorActive,
  // text color
  textColorBase: base.neutralTextBase,
  textColor1: 'rgb(31, 34, 37)',
  textColor2: 'rgb(51, 54, 57)',
  textColor3: 'rgb(118, 124, 130)',

  iconColor: neutral(base.alpha4),

  borderColor: 'rgb(224, 224, 300)',
  bodyColor: base.neutralBody,
  codeColor: 'rgb(244, 244, 248)',
  actionColor: 'rgb(250, 250, 252)',
  opacityDisabled: base.alphaDisabled
}

export default derived

export type ThemeCommonVars = typeof derived
