import { defineComponent, h } from 'vue'

const iconProps = {}

export default defineComponent({
  __icon__: true,
  name: 'Icon',
  inheritAttrs: true,
  props: iconProps,
  setup() {},
  render() {
    return h(
      'i',
      {
        role: 'img',
        class: [],
        style: []
      },
      this.$slots
    )
  }
})
