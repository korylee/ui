import { c, cB, cE, cM, cNotM } from '../../../_utils'

export default c([
  cB(
    'button',
    {
      margin: 0,
      fontWeight: 'var(--k-font-weight)',
      lineHeight: 1,
      fontFamily: 'inherit',
      padding: 'var(--k-padding)',
      height: 'var(--k-height)',
      fontSize: 'var(--k-font-size)',
      borderRadius: 'var(--k-border-radius)',
      color: 'var(--k-text-color)',
      backgroundColor: 'var(--k-color)',
      width: 'var(--k-width)',
      whiteSpace: 'nowrap',
      outline: 'none',
      position: 'relative',
      zIndex: 'auto',
      border: 'none',
      display: 'inline-flex',
      flexWrap: 'nowrap',
      flexShrink: 0,
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      textAlign: 'center',
      cursor: 'pointer',
      textDecoration: 'none',
      transition: `
        color: .3s var(--k-bezier),
        background-color .3s var(--k-bezier)
        opacity .3s var(--k-bezier)
        border-color .3s var(--k-bezier)
      `
    },
    [
      cM('color', [
        cE('border', { borderColor: 'var(--k-border-color)' }),
        cM('disabled', [
          cE('border', { borderColor: 'var(--k-border-color-disabled)' })
        ]),
        cNotM('disabled', [])
      ]),
      cM('disabled', []),
      cNotM('disabled', []),
      cM('loading', 'cursor: wait'),
      cB(
        'base-wave',
        {
          pointerEvents: 'none',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          animationIterationCount: 1,
          animationDuration: 'var(--k-ripple-duration)',
          animationTimingFunction:
            'var(--k-bezier-ease-out), var(--k-bezier-ease-out)'
        },
        [
          cM('active', {
            zIndex: 1,
            animationName: 'button-wave-spread, button-wave-opacity'
          })
        ]
      ),
      c('&::moz-focus-inner', { border: 0 }),
      cE('border, state-border', {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        borderRadius: 'inherit',
        transition: 'border-color .3s var(--k-bezier)',
        pointerEvents: 'none'
      }),
      cE('border', { border: 'var(--k-border)' }),
      cE('state-border', {
        border: 'var(--k-border)',
        borderColor: '#0000',
        zIndex: 1
      })
    ]
  ),
  c('@keyframes button-wave-spread', {
    from: { boxShadow: '0 0 0.5px 0 var(--k-ripple-color)' },
    to: { boxShadow: '0 0 0.5px 4.5px var(--k-ripple-color)' }
  }),
  c('@keyframes button-wave-opacity', {
    from: { opacity: 'var(--k-wave-opacity)' },
    to: { opacity: 0 }
  })
])
