import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { Code } from '../'

describe('k-code', () => {
  it('should warn when nohljs is set', () => {
    const spy = vi.spyOn(console, 'error')
    const inst = mount(Code)
    expect(spy).toHaveBeenCalled()
    inst.unmount()
  })
  it(`should work with 'code' prop`, () => {
    const inst = mount(Code, { props: { code: 'console.log(a)' } })
    expect(inst.text()).toEqual('console.log(a)')
    inst.unmount()
  })
})
