import { projectPath } from '../utils/common'
import convertMdToDoc from './convert-md-to-doc'

export default function docLoader(content, path) {
  const env = process.env.NODE_ENV
  const relativeUrl = path.replace(projectPath + '/', '')
  return convertMdToDoc(content, relativeUrl, env)
}
