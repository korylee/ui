import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { Upload } from '../'
import { h } from 'vue'

const getMockFile = (el: Element, files: File[]) => {
  Reflect.defineProperty(el, 'files', {
    get: () => files
  })
}

describe('k-upload', () => {
  it('should work import on demand', () => {
    const inst = mount(Upload)
    inst.unmount()
  })

  it(`should work with 'show-file-list' prop`, async () => {
    const inst = mount(Upload)
    await inst.setProps({ showFileList: true })
    expect(inst.find('.k-upload-file-list').exists()).toBe(true)
    inst.unmount()
  })

  it(`should work with 'disabled' prop`, async () => {
    const triggerClass = 'k-upload-trigger'
    const inst = mount(Upload)
    await inst.setProps({ disabled: true })

    expect(inst.find(`.${triggerClass}`).classes()).toContain(
      `${triggerClass}--disabled`
    )
    inst.unmount()
  })
})
