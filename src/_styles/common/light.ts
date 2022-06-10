import commonVariables from './common-variables'

const base = {
  neutralBase: '#ffffff',
  neutralInvertBase: '#000000',
  neutralTextBase: '#000000',
  neutralPopover: '#ffffff',

  alpha1: '0.82',
  alpha2: '0.72',
  alpha3: '0.38',
  alpha4: '0.24', // disabled text, placeholder, icon
  alpha5: '0.18', // disabled placeholder

  primaryDefault: '#36ad6a'
}

const derived = {
  name: 'common',
  ...commonVariables,
  baseColor: base.neutralBase,

  primaryColor: base.primaryDefault
}

export default derived

export type ThemeCommonVars = typeof derived
