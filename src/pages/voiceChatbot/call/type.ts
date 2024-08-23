export const StatusText = {
  '1': '等待执行',
  '2': '任务进行中',
  '3': '暂停中',
  '4': '手动取消',
  '5': '超时结束',
  '6': '正常完成',
}

export const StatusOptions = [
  {
    label: '等待执行',
    value: '1',
  },
  {
    label: '任务进行中',
    value: '2',
  },
  {
    label: '暂停中',
    value: '3',
  },
  {
    label: '手动取消',
    value: '4',
  },
  {
    label: '超时结束',
    value: '5',
  },
  {
    label: '正常完成',
    value: '6',
  },
]

export const reCall = {
  // 外呼结果 disabled=true不展示
  resOptions: [
    {
      label: '成功',
      value: '0',
      disabled: true,
    },
    {
      label: '无法接通',
      value: '1',
    },
    {
      label: '机器人挂机',
      value: '2',
      disabled: true,
    },
    {
      label: '用户主动挂机',
      value: '3',
      disabled: true,
    },
    {
      label: '呼叫失败',
      value: '4',
      disabled: true,
    },
    {
      label: '关机',
      value: '5',
      disabled: true,
    },
    {
      label: '空号',
      value: '6',
      disabled: true,
    },
    {
      label: '无人接听',
      value: '7',
    },
    {
      label: '停机',
      value: '8',
      disabled: true,
    },
    {
      label: '正在通话中',
      value: '9',
    },
    {
      label: '无法接听',
      value: '10',
    },
    {
      label: '用户拒接',
      value: '11',
      disabled: true,
    },
    {
      label: '超时',
      value: '12',
    },
    {
      label: '线路超频',
      value: '13',
    },
  ],
  // 外呼次数
  numOptions: [
    {
      label: '1次',
      value: '1',
    },
    {
      label: '2次',
      value: '2',
    },
    {
      label: '3次',
      value: '3',
    },
    {
      label: '4次',
      value: '4',
    },
    {
      label: '5次',
      value: '5',
    },
    {
      label: '6次',
      value: '6',
    },
    {
      label: '7次',
      value: '7',
    },
    {
      label: '8次',
      value: '8',
    },
    {
      label: '9次',
      value: '9',
    },
    {
      label: '10次',
      value: '10',
    },
  ],
  // 间隔时间 单位毫秒
  timesOptions: [
    {
      label: '立即',
      value: 1000,
    },
    {
      label: '15分钟',
      value: 900000,
    },
    {
      label: '30分钟',
      value: 900000 * 2,
    },
    {
      label: '45分钟',
      value: 900000 * 3,
    },
    {
      label: '60分钟',
      value: 900000 * 4,
    },
    {
      label: '120分钟',
      value: 900000 * 8,
    },
    {
      label: '180分钟',
      value: 900000 * 12,
    },
  ],
}
