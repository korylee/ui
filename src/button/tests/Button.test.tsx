import { describe, it, vi, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Button, XButton } from '../index'
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
      <XButton onMousedown={() => {}}></XButton>
      <XButton formaction=""></XButton>
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
  it(`should work with 'tag' prop`, () => {
    const inst = mount(Button, {
      props: {
        text: true,
        tag: 'a',
        href: 'https://github.com/korylee',
        target: '_blank',
        type: 'primary'
      },
      slots: {
        default: () => 'test'
      }
    })
    expect(inst.find('a').attributes('style')).toMatchSnapshot()
    expect(inst.find('a').classes()).toContain('k-button--primary-type')
    expect(inst.find('a').attributes('href')).toContain(
      'https://github.com/korylee'
    )
    expect(inst.find('a').attributes('type')).toContain('button')
    expect(inst.find('a').attributes('disabled')).toContain('false')
    expect(inst.find('a').attributes('target')).toContain('_blank')
    expect(inst.find('.k-button__content').element.textContent).toBe('test')
    inst.unmount()
  })
})
