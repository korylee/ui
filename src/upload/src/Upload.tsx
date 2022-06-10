import {
  CreateThumbnailUrl,
  CustomRequest,
  FileAndEntry,
  FileInfo,
  FuncOrRecordOrUndef,
  ListType,
  OnBeforeUpload,
  OnChange,
  OnDownload,
  OnError,
  OnFinish,
  OnPreview,
  OnRemove,
  OnUpdateFileList,
  SettledFileInfo,
  DoChange,
  UploadInternalInst,
  uploadInjectionKey
} from './interface'

import {
  ExtractPublicPropTypes,
  throwError,
  warn,
  call,
  MaybeArray
} from '../../_utils'
import {
  defineComponent,
  PropType,
  Teleport,
  h,
  computed,
  CSSProperties,
  InputHTMLAttributes,
  toRef,
  ref,
  nextTick,
  provide
} from 'vue'
import useTheme, { ThemeProps } from '../../_hooks/use-theme'
import { UploadTheme } from '../styles/light'
import useConfig from '../../_hooks/use-config'
import {
  appendData,
  createSettledFileInfo,
  matchType,
  setHeaders
} from './utils'
import { useMergedState } from 'vooks'
import { createId } from 'seemly'
import UploadTrigger from './UploadTrigger'

interface CustomSubmitImplOptions {
  inst: Omit<UploadInternalInst, 'isErrorState'>
  data?: FuncOrRecordOrUndef
  headers?: FuncOrRecordOrUndef
  action?: string
  withCredentials?: boolean
  file: SettledFileInfo
  customRequest: CustomRequest
}

function customSubmitImpl(options: CustomSubmitImplOptions): void {
  const { inst, customRequest, file, data, headers, withCredentials, action } =
    options
  const { doChange } = inst
  let percentage = 0
  customRequest({
    file,
    data,
    headers,
    withCredentials,
    action,
    onProgress(event) {
      const fileAfterChange: SettledFileInfo = { ...file, status: 'uploading' }

      const progress = event.percent
      fileAfterChange.percentage = progress
      percentage = progress
      doChange(fileAfterChange)
    },
    onFinish() {
      let fileAfterChange: SettledFileInfo = {
        ...file,
        status: 'finished',
        percentage,
        file: null
      }

      fileAfterChange = createSettledFileInfo(
        inst.onFinish?.({ file: fileAfterChange }) || fileAfterChange
      )
      doChange(fileAfterChange)
    },
    onError() {
      let fileAfterChange: SettledFileInfo = {
        ...file,
        status: 'error',
        percentage
      }
      fileAfterChange = createSettledFileInfo(
        inst.onError?.({ file: fileAfterChange }) || fileAfterChange
      )
      doChange(fileAfterChange)
    }
  })
}

function submitImpl(
  inst: UploadInternalInst,
  filename: string,
  file: SettledFileInfo,
  {
    method,
    withCredentials,
    action,
    data,
    headers
  }: {
    withCredentials: boolean
    method: string
    action?: string
    data: FuncOrRecordOrUndef
    headers: FuncOrRecordOrUndef
  }
): void {
  const request = new XMLHttpRequest()
  inst.xhrMap.set(file.id, request)
  request.withCredentials = withCredentials
  const formData = new FormData()
  appendData(formData, data, file)
  formData.append(filename, file.file as File)
  registerHandler(inst, file, request)
  if (!action) return
  request.open(method.toUpperCase(), action)
  setHeaders(request, headers, file)
  request.send(formData)
  const fileAfterChange: SettledFileInfo = { ...file, status: 'uploading' }
  inst.doChange(fileAfterChange)
}

function createXhrHandlers(
  inst: UploadInternalInst,
  file: SettledFileInfo,
  xhr: XMLHttpRequest
) {
  const { doChange, xhrMap } = inst
  let percentage = 0
  function handleXHRError(e: ProgressEvent<EventTarget>): void {
    let fileAfterChange: SettledFileInfo = Object.assign({}, file, {
      status: 'error',
      percentage
    })
    xhrMap.delete(file.id)
    fileAfterChange = createSettledFileInfo(
      inst.onError?.({ file: fileAfterChange, event: e }) || fileAfterChange
    )
    doChange(fileAfterChange, e)
  }

  function handleXHRLoad(e: ProgressEvent<EventTarget>): void {
    if (inst.isErrorState) {
      if (inst.isErrorState(xhr)) {
        handleXHRError(e)
        return
      }
    } else {
      if (xhr.status <= 200 || xhr.status >= 300) {
        handleXHRError(e)
        return
      }
    }
    let fileAfterChange: SettledFileInfo = {
      ...file,
      status: 'finished',
      percentage,
      file: null
    }
    xhrMap.delete(file.id)
    fileAfterChange = createSettledFileInfo(
      inst.onFinish?.({ file: fileAfterChange, event: e }) ?? fileAfterChange
    )
    doChange(fileAfterChange, e)
  }
  function handleXHRAbort() {}
  function handleXHRProgress() {}
  return {
    handleXHRError,
    handleXHRLoad,
    handleXHRAbort,
    handleXHRProgress
  }
}

function registerHandler(
  inst: UploadInternalInst,
  file: SettledFileInfo,
  request: XMLHttpRequest
): void {
  const { handleXHRAbort, handleXHRError, handleXHRLoad, handleXHRProgress } =
    createXhrHandlers(inst, file, request)
  request.onabort = handleXHRAbort
  request.onerror = handleXHRError
  request.onload = handleXHRLoad
  if (request.upload) request.upload.onprogress = handleXHRProgress
}

export type UploadProps = ExtractPublicPropTypes<typeof uploadProps>

const uploadProps = {
  ...(useTheme.props as ThemeProps<UploadTheme>),
  name: {
    type: String,
    default: 'file'
  },
  abstract: Boolean,
  accept: String,
  action: String,
  customRequest: Function as PropType<CustomRequest>,
  directory: Boolean,
  directoryDnd: { type: Boolean, default: undefined },
  method: { type: String, default: 'post' },
  multiple: Boolean,
  showFileList: { type: Boolean, default: true },
  data: [Object, Function] as PropType<FuncOrRecordOrUndef>,
  headers: [Object, Function] as PropType<FuncOrRecordOrUndef>,
  withCredentials: Boolean,
  disabled: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined
  },
  onChange: Function as PropType<OnChange>,
  onRemove: Function as PropType<OnRemove>,
  onFinish: Function as PropType<OnFinish>,
  onError: Function as PropType<OnError>,
  onBeforeUpload: Function as PropType<OnBeforeUpload>,
  onDownload: Function as PropType<OnDownload>,
  onPreview: Function as PropType<OnPreview>,
  isErrorState: Function as PropType<(xhr: XMLHttpRequest) => boolean>,
  defaultUpload: { type: Boolean, default: true },
  fileList: Array as PropType<FileInfo[]>,
  'onUpdate:fileList': [Function, Array] as PropType<
    MaybeArray<OnUpdateFileList>
  >,
  onUpdateFileList: [Function, Array] as PropType<MaybeArray<OnUpdateFileList>>,
  defaultFileList: {
    type: Array as PropType<FileInfo[]>,
    default: () => []
  },
  showCancelButton: { type: Boolean, default: true },
  showRemoveButton: { type: Boolean, default: true },
  showDownloadButton: Boolean,
  showRetryButton: { type: Boolean, default: true },
  showPreviewButton: { type: Boolean, default: true },
  listType: { type: String as PropType<ListType>, default: 'text' },
  createThumbnailUrl: Function as PropType<CreateThumbnailUrl>,
  max: Number,
  showTrigger: { type: Boolean, default: true },
  imageGroupProps: Object as PropType<ImageGroupProps>,
  inputProps: Object as PropType<InputHTMLAttributes>,
  triggerStyle: [String, Object] as PropType<CSSProperties | string>
} as const

export default defineComponent({
  name: 'Upload',
  props: uploadProps,
  setup(props) {
    if (props.abstract && props.listType === 'image-card')
      throwError(
        'uplpad',
        'when the list-type is images-card, abstract is not supported'
      )
    const { mergedClsPrefixRef, inlineThemeDisabled } = useConfig(props)
    const controledFileListRef = toRef(props, 'fileList')
    const uncontroledFileListRef = ref(props.defaultFileList)
    const inputElRef = ref<HTMLInputElement | null>(null)

    const xhrMap = new Map<string, XMLHttpRequest>()

    const _mergedFileListRef = useMergedState(
      controledFileListRef,
      uncontroledFileListRef
    )
    const mergedFileListRef = computed(() =>
      _mergedFileListRef.value.map(createSettledFileInfo)
    )

    const mergedMultipleRef = computed(() => props.multiple || props.directory)

    const cssVarsRef = computed((): CSSProperties => {
      return {}
    })

    async function handleFileAddition(
      fileAndEntries: FileAndEntry[] | null,
      e?: Event
    ) {
      if (!fileAndEntries?.length) return
      const { onBeforeUpload, max, accept, defaultUpload } = props
      fileAndEntries = mergedMultipleRef.value
        ? fileAndEntries
        : [fileAndEntries[0]]
      fileAndEntries = fileAndEntries.filter(({ file, source }) =>
        source === 'dnd' && accept?.trim()
          ? matchType(file.name, file.type, accept)
          : true
      )
      if (max) {
        fileAndEntries.splice(max - mergedFileListRef.value.length)
      }
      const batchId = createId()
      const fileInfos = await Promise.all(
        fileAndEntries.map(async ({ file, entry }) => {
          const fileInfo: SettledFileInfo = {
            id: createId(),
            batchId,
            name: file.name,
            status: 'pending',
            percentage: 0,
            url: null,
            file,
            type: file.type,
            thumbnailUrl: null,
            fullPath:
              entry?.fullPath ?? `/${file.webkitRelativePath || file.name}`
          }
          if (
            !onBeforeUpload ||
            (await onBeforeUpload({
              file: fileInfo,
              fileList: mergedFileListRef.value
            })) !== false
          ) {
            return fileInfo
          }
          return null
        })
      )

      for (const fileInfo of fileInfos) {
        if (!fileInfo) continue
        await nextTick()
        doChange(fileInfo, e, {
          append: true
        })
      }
      if (!defaultUpload) return
      submit()
    }

    const doChange: DoChange = (fileAfterChange, event, options = {}) => {
      const { append = false, remove = false } = options
      const fileListAfterChange = Array.from(mergedFileListRef.value)
      const fileIndex = fileListAfterChange.findIndex(
        (file) => file.id === fileAfterChange.id
      )
      if (append || remove || ~fileIndex) {
        if (append) fileListAfterChange.push(fileAfterChange)
        else if (remove) fileListAfterChange.splice(fileIndex, 1)
        else fileListAfterChange.splice(fileIndex, 1, fileAfterChange)
        props.onChange?.({
          file: fileAfterChange,
          fileList: fileListAfterChange,
          event
        })
        doUpdateFileList(fileListAfterChange)
      } else if (__IS_DEV__) {
        warn('upload', 'File has no corresponding id in current file list.')
      }
    }

    function submit(fileId?: string): void {
      const {
        method,
        customRequest,
        action,
        headers,
        data,
        name: filename,
        withCredentials,
        onError,
        onFinish,
        isErrorState
      } = props
      const filesToUpload =
        fileId === undefined
          ? mergedFileListRef.value
          : mergedFileListRef.value.filter((file) => file.id === fileId)
      const showReupload = fileId !== undefined
      filesToUpload.forEach((file) => {
        const { status } = file
        if (status === 'pending' || (status === 'error' && showReupload)) {
          if (customRequest) {
            customSubmitImpl({
              inst: {
                doChange,
                xhrMap,
                onFinish,
                onError
              },
              file,
              action,
              withCredentials,
              headers,
              data,
              customRequest
            })
          } else {
            submitImpl(
              {
                doChange,
                xhrMap,
                onFinish,
                onError,
                isErrorState
              },
              filename,
              file,
              {
                method,
                action,
                withCredentials,
                headers,
                data
              }
            )
          }
        }
      })
    }

    function handleFileInputChange(e: Event): void {
      const target = e.target as HTMLInputElement

      const entries: FileAndEntry[] | null = target.files
        ? Array.from(target.files).map((file) => ({
            file,
            entry: null,
            source: 'input'
          }))
        : null
      console.log(entries)

      handleFileAddition(entries, e)
      target.value = ''
    }

    function doUpdateFileList(files: SettledFileInfo[]): void {
      const { 'onUpdate:fileList': _onUpdateFileList, onUpdateFileList } = props
      if (_onUpdateFileList) call(_onUpdateFileList, files)
      if (onUpdateFileList) call(onUpdateFileList, files)
      uncontroledFileListRef.value = files
    }

    provide(uploadInjectionKey, {
      mergedClsPrefixRef
    })

    return {
      inputElRef,
      mergedClsPrefix: mergedClsPrefixRef,
      mergedMultiple: mergedMultipleRef,
      mergedFileList: mergedFileListRef,
      cssVars: inlineThemeDisabled ? undefined : cssVarsRef,
      handleFileInputChange
    }
  },
  render() {
    const { $slots, directory, mergedClsPrefix } = this

    const inputVNode = (
      <input
        {...this.inputProps}
        ref="inputProps"
        type="file"
        accept={this.accept}
        multiple={this.mergedMultiple}
        class={`${mergedClsPrefix}-upload-file-input`}
        onChange={this.handleFileInputChange}
        // @ts-ignore
        webkitdirectory={directory}
        directory={directory}
      />
    )
    if (this.abstract)
      return (
        <>
          {$slots.default?.()}
          <Teleport to="body">{inputVNode}</Teleport>
        </>
      )

    return (
      <div class={`${mergedClsPrefix}-upload`} style={this.cssVars}>
        {inputVNode}
        {this.showTrigger && this.listType !== 'image-card' && (
          <UploadTrigger>{$slots}</UploadTrigger>
        )}
      </div>
    )
  }
})
