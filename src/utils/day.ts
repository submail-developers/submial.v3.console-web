import dayjs from 'dayjs'
import type { TimeRangePickerProps } from 'antd'

// 预设时间
const fastPresets = {
  0: {
    label: '今天',
    value: [dayjs().add(0, 'd'), dayjs()],
  },
  1: {
    label: '昨天',
    value: [dayjs().add(-1, 'd'), dayjs().add(-1, 'd')],
  },
  3: {
    label: '最近 3 天',
    value: [dayjs().add(-2, 'd'), dayjs()],
  },
  7: {
    label: '最近 7 天',
    value: [dayjs().add(-6, 'd'), dayjs()],
  },
  15: {
    label: '最近 15 天',
    value: [dayjs().add(-14, 'd'), dayjs()],
  },
  30: {
    label: '最近一个月',
    value: [dayjs().add(-29, 'd'), dayjs()],
  },
  90: {
    label: '最近三个月',
    value: [dayjs().add(-89, 'd'), dayjs()],
  },
}

export type GetPresetsParams = 0 | 1 | 3 | 7 | 15 | 30 | 90

/**
 * 获取预设日期
 * @param params: 仅支持Array<0 | 1 | 3 | 7 | 15 | 30 | 90>
 * 注意：该方法仅支持【n天前-今天】共n天，设置disabledDate时必须包含预设日期，否则点击不生效
 */
export const getPresets = (
  params: GetPresetsParams[],
): TimeRangePickerProps['presets'] => {
  let presets: TimeRangePickerProps['presets'] = []
  params.forEach((item) => {
    if (fastPresets[item]) {
      // @ts-ignore
      presets.push(fastPresets[item])
    }
  })
  return presets
}
