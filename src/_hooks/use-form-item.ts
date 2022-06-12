import { computed } from 'vue'

type FormItemSize = 'small' | 'medium' | 'large'
type AllowedSize = 'tiny' | 'small' | 'medium' | 'large' | 'huge' | number

interface UseFormItemProps<T> {
  size?: T
  disabled?: boolean
}

export default function useFormItem<T extends AllowedSize = FormItemSize>(
  props: UseFormItemProps<T>
) {
  const mergedDisabledRef = computed(() => {
    const { disabled } = props
    if (disabled !== undefined) return disabled
    return false
  })
  return { mergedDisabledRef }
}
