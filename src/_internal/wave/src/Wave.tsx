import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'BaseWave',
  props: {
    clsPrefix: {
      type: String,
      required: true
    }
  },
  render() {
    const { clsPrefix } = this
    return <div aria-hidden class={`${clsPrefix}-base-wave`} />
  }
})
