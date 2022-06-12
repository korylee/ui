import { c, cB, cE } from '../../../../_utils'

export default c([
  c('@keyframes loading-container-rotate', {
    to: {
      '-webkit-transform': 'rotate(360deg)',
      transform: 'rotate(360deg)'
    }
  }),
  cB(
    'base-loading',
    {
      position: 'relative',
      lineHeight: 0,
      width: '1em',
      height: '1em'
    },
    [
      cE('transition-wrapper', {
        position: 'absolute',
        width: '100%',
        height: '100%'
      })
    ]
  )
])
