import {
  isVNode,
  Slot,
  VNodeArrayChildren,
  Comment,
  Fragment,
  VNodeChild
} from 'vue'

function ensureValidVNode(vnodes: VNodeArrayChildren) {
  const valid = vnodes.some((child) => {
    if (!isVNode(child)) return true
    if (child.type === Comment) return false
    if (
      child.type === Fragment &&
      !ensureValidVNode(child.children as VNodeArrayChildren)
    ) {
      return false
    }
    return true
  })
  if (valid) return vnodes
  return null
}

export const resolveSlot = <T>(slot: Slot | undefined, props?: T) =>
  (slot && ensureValidVNode(slot(props))) ?? null

export const isSlotEmpty = (slot: Slot | undefined) =>
  !(slot && ensureValidVNode(slot()))

export function resolveWrappedSlot<T, R = any>(
  slot: Slot | undefined,
  wrapper: (children: VNodeArrayChildren | null) => T,
  props?: R
) {
  const children = resolveSlot(slot, props)
  return wrapper(children)
}
