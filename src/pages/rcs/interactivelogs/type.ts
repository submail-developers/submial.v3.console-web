import type { MenuProps } from 'antd'

export const exportItems: MenuProps['items'] = [
  {
    label: '导出 TXT (仅手机号码)',
    key: 'txt',
  },
  {
    label: '导出 CSV',
    key: 'csv',
  },

  {
    label: '导出 EXCEL',
    key: 'excel',
  },
  {
    label: '导出 JSON',
    key: 'json',
  },

  {
    label: '导出 XML',
    key: 'xml',
  },
]

export const searchType = [
  { label: '全部', value: 'all' },
  { label: '上行回复', value: '0' },
  { label: '固定菜单按钮', value: '1' },
  { label: '模版/悬浮按钮', value: '2' },
  { label: '纯文字消息', value: '3' },
]
export enum EnumSearchTypeTxt {
  '上行回复',
  '固定菜单按钮',
  '模版/悬浮按钮',
  '纯文字消息',
}

export enum EnumSearchTypeColor {
  'match_type_color_0',
  'match_type_color_1',
  'match_type_color_2',
  'match_type_color_3',
}
