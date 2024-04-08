import { useState, useEffect } from 'react'
import { Grid } from 'antd'
import { debounce } from 'lodash'
// 自定义hooks
/**
 * 根据屏幕大小 返回 'large' | 'middle' | 'small'
 */
type Size = 'middle' | 'small'
export const useSize = () => {
  let localSize = (localStorage.getItem('size') as Size) || 'middle' // 获取缓存的size
  const [size, setSize] = useState<Size>(localSize) // 默认大屏
  const { useBreakpoint } = Grid
  const screens = useBreakpoint()

  useEffect(() => {
    // 防抖处理
    const debouncedHandleChange = debounce(() => {
      // 根据屏幕大小更新状态值
      if (Object.keys(screens).length > 0) {
        if (screens.md) {
          localStorage.setItem('size', 'middle')
          setSize('middle')
        } else {
          localStorage.setItem('size', 'small')
          setSize('small')
        }
      }
    }, 200)

    debouncedHandleChange() // 执行防抖处理后的函数调用
  }, [screens]) // 当screens变化时执行防抖处理

  return size // 返回状态值，以便在组件中使用
}

/**
 * 当前窗口大小是否达到某个临界值
 * @param 参数可选值 'xxl' | 'xl' | 'lg' | 'md' | 'sm' | 'xs'
 */
export const usePoint = (point: Points) => {
  let localScreenJson = localStorage.getItem('screens')
  let localScreen = localScreenJson ? JSON.parse(localScreenJson) : {}
  const { useBreakpoint } = Grid
  const screens = useBreakpoint()
  const [pointFlag, setPointFlag] = useState<boolean>(
    localScreen[point] || true,
  )
  useEffect(() => {
    const debouncedHandleChange = debounce(() => {
      // 防抖处理
      if (Object.keys(screens).length > 0) {
        localStorage.setItem('screens', JSON.stringify(screens))
        setPointFlag(screens[point])
      }
    }, 200)
    debouncedHandleChange()
  }, [screens])

  return pointFlag
}

/**
 * 自定义 hook 用于从 localStorage 中获取值
 * @param key string
 * @param initialValue any 初始值
 */
export const useLocalStorage = (key, initialValue) => {
  // 使用 useState 来创建状态
  const [storedValue, setStoredValue] = useState(() => {
    // 从 localStorage 中获取值，如果不存在则使用初始值
    const item = window.localStorage.getItem(key)
    return item ? JSON.parse(item) : initialValue
  })

  // 定义一个函数用于更新 localStorage 中的值
  const setValue = (value) => {
    // 保存新值到 localStorage
    setStoredValue(value)
    window.localStorage.setItem(key, JSON.stringify(value))
  }

  return [storedValue, setValue]
}
