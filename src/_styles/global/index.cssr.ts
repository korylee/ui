import { c } from '../../_utils/cssr'
import commonVariables from '../common/common-vars'

const { fontSize, fontFamily, lineHeight } = commonVariables

export default c(
  'body',
  {
    margin: 0,
    fontSize: fontSize,
    fontFamily,
    lineHeight,
    '-webkit-text-size-adjust': '100%',
    '-webkit-tap-highlight-color': 'transparent'
  },

  [
    c('input', {
      fontFamily: 'inherit',
      fontSize: 'inherit'
    })
  ]
)
