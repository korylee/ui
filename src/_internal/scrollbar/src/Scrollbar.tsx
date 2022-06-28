import { defineComponent, HTMLAttributes, PropType } from 'vue'
import { ExtractPublicPropTypes, TsxComponent } from '../../../_utils'

const scrollbarProps = {
  size: { type: Number, default: 5 },
  duration: { type: Number, default: 0 },
  trigger: String as PropType<'none' | 'hover'>,
  xScrollable: Boolean,
  onScroll: Function as PropType<(e: Event) => void>
} as const

export type ScrollbarProps = ExtractPublicPropTypes<typeof scrollbarProps>

const Scrollbar = defineComponent({
  name: 'ScrollBar',
  props: scrollbarProps,
  inheritAttrs: false,
  render(){
    return <div></div>
  }
})

export default Scrollbar

export const XScrollbar: TsxComponent<typeof scrollbarProps, HTMLAttributes> =
  Scrollbar as any
