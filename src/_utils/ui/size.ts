export type BasicSize = 'small' | 'medium' | 'large'

export function largerSize(size: BasicSize | 'tiny'): BasicSize | 'huge' {
  switch (size) {
    case 'tiny':
      return 'small'
    case 'small':
      return 'medium'
    case 'medium':
      return 'large'
    case 'large':
      return 'huge'
  }
}

export function smallerSize(
  size: BasicSize | 'huge' | 'tiny'
): BasicSize | 'tiny' | 'mini' {
  switch (size) {
    case 'tiny':
      return 'mini'
    case 'small':
      return 'tiny'
    case 'medium':
      return 'small'
    case 'large':
      return 'medium'
    case 'huge':
      return 'large'
  }
}
