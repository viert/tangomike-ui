import { computed, ref, watch, type Ref, type ComputedRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export enum Convert {
  INT,
  BOOL,
  STRING
}

export function useQuery<
  C extends Convert,
  T = C extends Convert.STRING ? string : C extends Convert.BOOL ? boolean : number
>(key: string, convert: C): { value: ComputedRef<T | null>; setValue: (v: T | null) => void } {
  const route = useRoute()
  const router = useRouter()
  const intrValue: Ref<string | null> = ref(null)

  const value = computed(() => {
    if (intrValue.value === null) return null

    switch (convert) {
      case Convert.STRING:
        return intrValue.value
      case Convert.INT:
        return parseInt(intrValue.value) || null
      case Convert.BOOL:
        return ['true', 'yes', '1'].includes(intrValue.value.toLowerCase().trim())
      default:
        return null
    }
  })

  function setValue(newValue: T | null) {
    const { query } = route
    if (newValue === null) {
      delete query[key]
    } else {
      query[key] = `${newValue}`
    }
    router.push({ query })
  }

  watch(
    () => route.query,
    () => {
      const { query } = route
      intrValue.value = (query[key] as string) || null
    },
    { immediate: true }
  )

  return { value: value as ComputedRef<T>, setValue }
}
