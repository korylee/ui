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

export function resolveWrappedSlot(
  slot: Slot | undefined,
  wrapper: (children: VNodeArrayChildren | null) => VNodeChild
): VNodeChild {
  const children = (slot && ensureValidVNode(slot())) || null
  return wrapper(children)
}
