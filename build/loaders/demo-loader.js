import { projectPath } from '../utils/common'
import convertMd2Demo from './convert-md-to-demo'
import concertVue2Demo from './convert-vue-to-demo'

export default function demoLoader(content, path, type) {
  const relativeUrl = path.replace(projectPath + '/', '')
  if (type === 'vue') {
    return concertVue2Demo(content, {
      relativeUrl,
      resourcePath: path,
      isVue: true
    })
  }
  return convertMd2Demo(content, {
    relativeUrl,
    resourcePath: path,
    isVue: false
  })
}
