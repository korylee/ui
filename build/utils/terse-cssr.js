import { parse } from '@babel/parser'
import traverse from '@babel/traverse'
import generator from '@babel/generator'

export default function terseCssr(code) {
  const patternSpace = / +/g
  const patternEnter = /\n+/g

  const ast = parse(code, { sourceType: 'module' })

  traverse(ast, {
    TemplateElement(path) {
      ;['raw', 'cooked'].forEach((type) => {
        path.node.value[type] = path.node.value[type]
          .replace(patternSpace, ' ')
          .replace(patternEnter, '\n')
      })
    }
  })
  return generator(ast).code
}
