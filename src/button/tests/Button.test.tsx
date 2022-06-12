import { describe, it, vi, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Button } from '../index'
import { h } from 'vue'

describe('k-button', () => {
  it('should work with import on demand', () => {
    const inst = mount(Button)
    inst.unmount()
  })
  it('clickable', async () => {
    const onClick = vi.fn()
    const inst = mount(Button, { props: { onClick } })
    expect(onClick).not.toHaveBeenCalled()
    await inst.trigger('click')
    expect(onClick).toHaveBeenCalled()
    inst.unmount()
  })
  it('keyboard', async () => {
    const onClick = vi.fn()
    const inst = mount(Button, { props: { keyboard: true, onClick } })
    await inst.trigger('click')
    expect(onClick).toBeCalledTimes(1)
    await inst.trigger('keydown.space')
    expect(onClick).toBeCalledTimes(1)
    await inst.trigger('keydown.enter')
    expect(onClick).toBeCalledTimes(1)
    inst.unmount()
  })
  it('disabled', async () => {
    const onClick = vi.fn()
    const inst = mount(Button, { props: { disabled: true, onClick } })
    await inst.trigger('click')
    expect(onClick).not.toHaveBeenCalled()
    inst.unmount()
  })
  it('pressed native event & attr tsx type check', () => {
    ;<div>
      <Button onMousedown={() => {}}></Button>
      <Button formaaction=""></Button>
    </div>
  })
  it('show work with `attr-type prop`', () => {
    ;['button', 'submit', 'reset'].forEach((type) => {
      const inst = mount(Button, { props: { attrType: type } })
      expect(inst.find('button').attributes('type')).toContain(type)
      inst.unmount()
    })
  })
  it(`show work with 'size' prop`, () => {
    ;['tiny', 'small', 'medium', 'large'].forEach((size) => {
      const inst = mount(Button, { props: { size } })
      expect(inst.find('button').attributes('style')).toMatchSnapshot()
      inst.unmount()
    })
  })
  it('should work iwth `test` prop', () => {
    const inst = mount(Button, {
      props: { text: true },
      slots: { default: () => 'test' }
    })

    expect(inst.find('button').attributes('style')).toMatchSnapshot()
    expect(inst.find('.k-button__content').element.textContent).toBe('test')
    inst.unmount()
  })
})
