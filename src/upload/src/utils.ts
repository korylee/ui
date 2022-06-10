import type {
  FileInfo,
  FuncOrRecordOrUndef,
  SettledFileInfo
} from './interface'

export function matchType(
  name: string,
  mineType: string,
  accept: string
): boolean {
  name = name.toLowerCase()
  mineType = mineType.toLocaleLowerCase()
  accept = accept.toLocaleLowerCase()
  return accept.split(',').some((acceptAtom) => {
    acceptAtom = acceptAtom.trim()
    if (!acceptAtom) return false
    if (acceptAtom.startsWith('.')) {
      if (name.endsWith(acceptAtom)) return true
    } else if (acceptAtom.includes('/')) {
      const [type, subtype] = mineType.split('/')
      const [acceptType, acceptSubtype] = acceptAtom.split('/')
      if (acceptType === '*' || (type && acceptType === type)) {
        if (acceptSubtype === '*' || (subtype && acceptSubtype === subtype)) {
          return true
        }
      }
    } else {
      return true
    }
    return false
  })
}

export function createSettledFileInfo(fileInfo: FileInfo): SettledFileInfo {
  const {
    id,
    name,
    percentage = null,
    status,
    url = null,
    file = null,
    thumbnailUrl = null,
    type = null,
    fullPath = null,
    batchId = null
  } = fileInfo
  return {
    id,
    name,
    percentage,
    status,
    url,
    file,
    thumbnailUrl,
    type,
    fullPath,
    batchId
  }
}

function unwrapFunctionValue(
  data: FuncOrRecordOrUndef,
  file: SettledFileInfo
): Record<string, string> {
  if (typeof data === 'function') return data({ file })
  if (data) return data
  return {}
}

export function appendData(
  formData: FormData,
  data: FuncOrRecordOrUndef,
  file: SettledFileInfo
) {
  const dataObject = unwrapFunctionValue(data, file)
  if (!dataObject) return
  Object.keys(dataObject).forEach((key) => {
    formData.append(key, dataObject[key])
  })
}

export function setHeaders(
  request: XMLHttpRequest,
  headers: FuncOrRecordOrUndef,
  file: SettledFileInfo
): void {
  const headersObject = unwrapFunctionValue(headers, file)
  if (!headersObject) return
  Object.keys(headersObject).forEach((key) => {
    request.setRequestHeader(key, headersObject[key])
  })
}
