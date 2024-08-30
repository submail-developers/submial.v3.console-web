import { Descriptions, Space, Tag, Divider } from 'antd'
import type { DescriptionsProps } from 'antd'
import { API } from 'apis'
import { StatusText, reCall } from '../../../type'
import { useSize } from '@/hooks'
import ACopy from '@/components/aCopy'
import { IDIcon } from '@/components/aIcons'

type Props = {
  data: API.GetVCTaskDetailRes
}

export default function Fn(props: Props) {
  const size = useSize()
  let resultsTextArr = [] // 外呼结果
  let interval = '' // 间隔时间
  if (props.data?.results) {
    const results = props.data.results.split(',')
    resultsTextArr = results.map((item) => {
      let _item = reCall.resOptions.find((im) => im.value == item)
      return _item?.label || ''
    })
  }
  if (props.data?.interval) {
    let obj = reCall.timesOptions.find(
      (item) => item.value == Number(props.data.interval),
    )
    interval = obj?.label || ''
  }

  // 未接通再次外呼
  const recallConfig =
    resultsTextArr.length > 0 ? (
      <Space wrap size={[8, 8]}>
        {resultsTextArr.map((item) => (
          <Tag key={item} color='blue' className='m-r-0'>
            {item}
          </Tag>
        ))}
        {props.data?.maxTimes && (
          <>
            <Divider type='vertical' style={{ height: 16 }} className='m-x-0' />
            <Tag color='orange' className='m-r-0'>
              外呼{props.data?.maxTimes}次
            </Tag>
          </>
        )}
        {interval && (
          <>
            <Divider type='vertical' style={{ height: 16 }} className='m-x-0' />
            <Tag color='magenta' className='m-r-0'>
              间隔{interval}
            </Tag>
          </>
        )}
      </Space>
    ) : (
      '-'
    )
  const smsConfig =
    props.data?.smsIntentions && props.data?.smsTemplate ? (
      <Space wrap size={[8, 8]}>
        {props.data?.smsIntentions.split(',').map((item) => (
          <Tag key={item} color='blue' className='m-r-0'>
            {item}类客户
          </Tag>
        ))}
        <Divider type='vertical' style={{ height: 16 }} className='m-x-0' />
        <div style={{ position: 'relative' }}>
          <ACopy text={props.data.smsTemplate} />
          <Tag color='orange' className='m-r-0'>
            【{props.data.smsTemplate}】<IDIcon />
          </Tag>
        </div>
      </Space>
    ) : (
      '-'
    )
  const items: DescriptionsProps['items'] = [
    {
      label: '任务名称',
      span: 2,
      children: props.data?.title || '-',
    },
    // {
    //   label: '任务状态',
    //   span: 2,
    //   children: (
    //     <span className={`send-type status-${props.data?.status}`}>
    //       {StatusText[props.data?.status]}
    //     </span>
    //   ),
    // },
    {
      label: '话术名称',
      span: 2,
      children: props.data?.speechskill_name || '-',
    },
    {
      label: '未接通再次外呼',
      span: 2,
      children: recallConfig,
    },
    {
      label: '挂机短信与模版ID',
      span: 2,
      children: smsConfig,
    },
    {
      label: '预设开始/结束时间',
      span: 2,
      children:
        props.data && `${props.data?.life_start} - ${props.data?.life_end}`,
    },
    {
      label: '机器人工作时间',
      span: 2,
      children: (
        <Space size={[24, 0]} wrap>
          {props.data && (
            <>
              <span>
                {props.data?.work_morning_start} -{' '}
                {props.data?.work_morning_end}
              </span>
              <span>
                {props.data?.work_afternoon_start +
                  ' - ' +
                  props.data?.work_afternoon_end}{' '}
              </span>
            </>
          )}
        </Space>
      ),
    },
    {
      label: '是否跳过节假日',
      span: 2,
      children: props.data?.skipHolidays == 'true' ? '是' : '否',
    },
  ]
  return (
    <Descriptions
      title=''
      bordered
      size='middle'
      column={2}
      labelStyle={{
        width: size == 'middle' ? 180 : 140,
        backgroundColor: 'var(--table-bg)',
        fontSize: '15px',
      }}
      items={items}
    />
  )
}
