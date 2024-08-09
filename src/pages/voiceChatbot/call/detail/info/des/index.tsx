import { Descriptions } from 'antd'
import type { DescriptionsProps } from 'antd'

export default function Fn() {
  const items: DescriptionsProps['items'] = [
    {
      label: '任务名称',
      span: 2,
      children: '-',
    },
    {
      label: '话术名称',
      span: 2,
      children: '-',
    },
    {
      label: '预设开始/结束时间',
      span: 2,
      children: '-',
    },
    {
      label: '机器人工作时间',
      span: 2,
      children: '-',
    },
    {
      label: '外呼任务状态',
      span: 2,
      children: '-',
    },
    {
      label: '外显号码',
      span: 2,
      children: '-',
    },
    {
      label: '节假日',
      span: 2,
      children: '-',
    },
  ]
  return (
    <Descriptions
      title=''
      bordered
      size='middle'
      column={2}
      labelStyle={{
        width: 180,
        backgroundColor: 'var(--table-bg)',
        fontSize: '15px',
      }}
      items={items}
    />
  )
}
