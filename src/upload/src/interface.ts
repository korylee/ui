import type { Ref } from 'vue'
import type { MergedTheme } from '../../_hooks'
import { createInjectionKey } from '../../_utils'
import type { UploadTheme } from '../styles'

export interface FileInfo {
  id: string
  name: string
  batchId?: string | null
  percentage?: number | null
  status: 'pending' | 'uploading' | 'finished' | 'removed' | 'error'
  url?: string | null
  file?: File | null
  thumbnailUrl?: string | null
  type?: string | null
  fullPath?: string | null
}

export type SettledFileInfo = Required<FileInfo>

export type FuncOrRecordOrUndef =
  | Record<string, string>
  | (({ file }: { file: SettledFileInfo }) => Record<string, string>)
  | undefined

export type OnChange = (data: {
  file: SettledFileInfo
  fileList: SettledFileInfo[]
  event?: ProgressEvent | Event
}) => void

export type OnRemove = (data: {
  file: SettledFileInfo
  fileList: SettledFileInfo[]
}) => Promise<boolean> | boolean | any

export type OnFinish = (data: {
  file: SettledFileInfo
  event?: ProgressEvent
}) => FileInfo | undefined

export type OnDownload = (
  file: SettledFileInfo
) => Promise<boolean> | boolean | any

export type OnError = (data: {
  file: SettledFileInfo
  event?: ProgressEvent
}) => FileInfo | undefined

export type OnBeforeUpload = (data: {
  file: SettledFileInfo
  fileList: SettledFileInfo[]
}) => Promise<unknown>

export type OnPreview = (file: SettledFileInfo) => void

export interface UploadInternalInst {
  doChange: DoChange
  xhrMap: Map<string, XMLHttpRequest>
  isErrorState: ((xhr: XMLHttpRequest) => boolean) | undefined
  onFinish: OnFinish | undefined
  onError: OnError | undefined
}

export type OnUpdateFileList = (fileList: SettledFileInfo[]) => void

export interface UploadInjection {
  mergedClsPrefixRef: Ref<string>
  mergedThemeRef: Ref<MergedTheme<UploadTheme>>
  mergedDisabledRef: Ref<boolean>
}

export const uploadInjectionKey =
  createInjectionKey<UploadInjection>('k-upload')

export type ListType = 'text' | 'image' | 'image-card'

export type CreateThumbnailUrl = (file: File) => Promise<string>

export interface CustomRequestOptions {
  file: SettledFileInfo
  action?: string
  withCredentials?: boolean
  data?: FuncOrRecordOrUndef
  headers?: FuncOrRecordOrUndef
  onProgress: (e: { percent: number }) => void
  onFinish: () => void
  onError: () => void
}

export type CustomRequest = (options: CustomRequestOptions) => void

export interface FileAndEntry {
  file: File
  entry: FileSystemFileEntry | null
  source: 'dnd' | 'input'
}

export type DoChange = (
  fileAfterChange: SettledFileInfo,
  event?: ProgressEvent | Event,
  options?: {
    append?: boolean
    remove?: boolean
  }
) => void
