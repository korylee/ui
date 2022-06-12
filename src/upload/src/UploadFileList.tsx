import { computed, defineComponent, inject, h } from 'vue'
import { throwError } from '../../_utils'
import { uploadInjectionKey } from './interface'

export default defineComponent({
  name: 'UploadFileList',
  setup() {
    const uploadInjection = inject(uploadInjectionKey, null)
    if (!uploadInjection) {
      throwError(
        'upload-file-list',
        `'UploadFileList' must be placed inside 'Upload'`
      )
    }
    const { mergedClsPrefixRef } = uploadInjection
    return { mergedClsPrefix: mergedClsPrefixRef }
  },
  render() {
    const { mergedClsPrefix } = this

    return <div class={[`${mergedClsPrefix}-upload-file-list`]}></div>
  }
})
