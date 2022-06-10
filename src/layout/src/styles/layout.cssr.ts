import { cB } from '../../../_utils/cssr'

export default cB(
  'layout',
  {
    color: 'var(--k-text-color)',
    backgroundColor: 'var(--k-color)'
  },
  [
    cB('layout-srcoll-container', {
      overflowX: 'hidden'
    })
  ]
)
