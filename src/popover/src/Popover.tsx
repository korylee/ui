import { defineComponent, h } from 'vue'
import { VBinder } from 'vueuc'
export default defineComponent({
  render() {
    return (
      <VBinder ref="binderInstRef">
        {{
          default: () => {}
        }}
      </VBinder>
    )
  }
})
