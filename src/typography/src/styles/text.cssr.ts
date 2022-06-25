import { cB, cM } from '../../../_utils'

export default cB(
  'text',
  {
    transition: 'color .3s var(--k-bezier)',
    color: 'var(--k-text-color)'
  },
  [
    cM('strong', {
      fontWeight: 'var(--k-font-weight-strong)'
    }),
    cM('italic', { fontStyle: 'italic' }),
    cM('code', {
      lineHeight: 1.4,
      display: 'inline-block',
      fontFamily: 'var(--k-font-family-mono)',
      boxSizing: 'border-box',
      padding: '.05em .35em 0 .25em',
      borderRadius: 'var(--k-code-border-radius)',
      fontSize: '.9em',
      color: 'var(--k-code-text-color)',
      backgroundColor: 'var(--k-code-color)',
      border: 'var(--k-code-border)',
      transition: `
      color .3s var(--k-bezier),
      border-color .3s var(--k-bezier),
      background-color .3s var(--k-bezier)
      `
    })
  ]
)
