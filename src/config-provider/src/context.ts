import { createInjectionKey } from '../../_utils'
import { ConfigProviderInjection } from './internal-interface'

export const configProviderInjectionKey =
  createInjectionKey<ConfigProviderInjection>('k-config-provider')
