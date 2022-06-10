import { InjectionKey } from 'vue'

export default function createInjectionKey<T> (key: string): InjectionKey<T> {
  return key as any
}
