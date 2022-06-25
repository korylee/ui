import { createTextVNode, Fragment, VNode, VNodeChild } from 'vue'

export function flatten(
  vNodes: VNodeChild[],
  filterCommentNode: boolean = true,
  result: VNode[] = []
): VNode[] {
  vNodes.forEach((vNode) => {
    if (vNode === null) return
    else if (typeof vNode !== 'object') {
      if (typeof vNode === 'string' || typeof vNode === 'number') {
        result.push(createTextVNode(String(vNode)))
      }
      return
    } else if (Array.isArray(vNode)) {
      flatten(vNode, filterCommentNode, result)
      return
    } else if (vNode.type === Fragment) {
      if (vNode.children === null) return
      if (Array.isArray(vNode.children))
        flatten(vNode.children, filterCommentNode, result)
      else flatten([vNode.children as VNodeChild], filterCommentNode, result)
    } else if (vNode.type === Comment && filterCommentNode) return
    else result.push(vNode)
  })
  return result
}
