import type { ExtractPropTypes, HTMLAttributes } from 'vue'

export type TsxComponent<
  T extends Record<string, unknown>,
  R extends HTMLAttributes
> = new () => {
  $props: Partial<ExtractPropTypes<T> & Omit<R, keyof T>>
}
