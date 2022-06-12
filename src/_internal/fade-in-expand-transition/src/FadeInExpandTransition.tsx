import { defineComponent, h, PropType, Transition, TransitionGroup } from 'vue'

export default defineComponent({
  name: 'FadeInExpandTransition',
  props: {
    appear: Boolean,
    group: Boolean,
    mode: String as PropType<'in-out' | 'out-in' | 'default'>,
    onLeave: Function as PropType<() => void>,
    onAfterLeave: Function as PropType<() => void>,
    onAfterEnter: Function as PropType<() => void>,
    width: Boolean,
    reverse: Boolean
  },
  setup(props) {
    function handleBeforeLeave(el: HTMLElement) {
      if (props.width) el.style.maxWidth = `${el.offsetWidth}px`
      else el.style.maxHeight = `${el.offsetHeight}px`
      void el.offsetWidth
    }
    function handleLeave(el: HTMLElement) {
      if (props.width) el.style.maxWidth = '0'
      else el.style.maxHeight = '0'
      void el.offsetWidth
      props.onLeave?.()
    }

    function handleAfterLeave(el: HTMLElement) {
      if (props.width) el.style.maxWidth = ''
      else el.style.maxHeight = ''
      props.onAfterLeave?.()
    }
    function handleEnter(el: HTMLElement) {
      el.style.transition = 'none'
      if (props.width) {
        const memorizedWidth = el.offsetWidth
        el.style.maxWidth = '0'
        void el.offsetWidth
        el.style.transition = ''
        el.style.maxWidth = `${memorizedWidth}px`
      } else {
        if (props.reverse) {
          el.style.maxHeight = `${el.offsetHeight}px`
          void el.offsetHeight
          el.style.transition = ''
          el.style.maxHeight = '0'
        } else {
          const memorizedHeight = el.offsetHeight
          el.style.maxHeight = '0'
          void el.offsetWidth
          el.style.transition = ''
          el.style.maxHeight = `${memorizedHeight}px`
        }
      }
      void el.offsetWidth
    }
    function handleAfterEnter(el: HTMLElement) {
      if (props.width) el.style.maxWidth = ''
      else !props.reverse && (el.style.maxHeight = '')
      props.onAfterEnter?.()
    }
    return {
      handleEnter,
      handleAfterEnter,
      handleBeforeLeave,
      handleLeave,
      handleAfterLeave
    }
  },
  render() {
    const { mode, appear, width } = this
    const Comp = this.group ? TransitionGroup : Transition
    const name = width
      ? 'fade-in-width-expand-transition'
      : 'fade-in-height-expand-transition'
    return (
      <Comp
        {...{ mode, appear, name }}
        onEnter={this.handleEnter as any}
        onAfterEnter={this.handleAfterLeave as any}
        onBeforeLeave={this.handleBeforeLeave as any}
        onLeave={this.handleLeave as any}
        onAfterLeave={this.handleAfterLeave as any}
      >
        {this.$slots}
      </Comp>
    )
  }
})
