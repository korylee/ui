import { defineComponent, h, inject } from 'vue'
import { throwError } from '../../_utils'
import { uploadInjectionKey } from './interface'

export default defineComponent({
  name: 'UploadTrigger',
  props: {
    abstract: Boolean
  },
  setup() {
    const uploadInjection = inject(uploadInjectionKey, null)
    if (!uploadInjection)
      throwError(
        'upload-trigger',
        `'upload-trigger' must be placed inside 'upload'.`
      )
    const { mergedClsPrefixRef } = uploadInjection
    return { mergedClsPrefix: mergedClsPrefixRef }
  },
  render() {
    const { mergedClsPrefix, $slots } = this
    if (this.abstract) return $slots.default?.()
    return <div class={[`${mergedClsPrefix}-upload-trigger`]}>{$slots}</div>
  }
})
