import { Row, Col } from 'antd'
import { API } from 'apis'
import './index.scss'

type Props = {
  data?: API.ScheduleList
  mob_total_num?: number
}

function formatSeconds(seconds) {
  if (seconds > 60 * 60) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}小时${minutes}分钟${secs}秒`
  } else if (seconds > 60) {
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${minutes}分钟${secs}秒`
  } else {
    return `${seconds}秒`
  }
}

export default function Fn(props: Props) {
  let connect_rate = '0' // 接通率
  let call_time = '0'
  if (props.data) {
    call_time = formatSeconds(
      Number((props.data?.call_duration / 1000).toFixed(0)),
    )
    if (props.data?.call_num > 0) {
      connect_rate = (
        (Number(props.data?.connect_num) / Number(props.data?.call_num)) *
        100
      ).toFixed(2)
    }
  }
  return (
    <Row className='newVision-welcome-overview p-y-12' gutter={[0, 32]}>
      <Col span={12} md={6}>
        <div className='color fn24'>{props.data?.call_num || '0'}</div>
        <div className='gray-color fn12 m-t-8'>呼叫总量</div>
      </Col>
      <Col span={12} md={6}>
        <div className='color fn24'>{props.mob_total_num || '0'}</div>
        <div className='gray-color fn12 m-t-8'>号码总量</div>
      </Col>
      <Col span={12} md={6}>
        <div className='color fn24'>{props.data?.connect_num || '0'}</div>
        <div className='gray-color fn12 m-t-8'>接通量</div>
      </Col>
      <Col span={12} md={6}>
        <div className='color fn24'>{connect_rate}%</div>
        <div className='gray-color fn12 m-t-8'>接通率</div>
      </Col>
      <Col span={12} md={6}>
        <div
          className={`color ${call_time.includes('小时') ? 'fn16' : 'fn24'}`}>
          {call_time}
        </div>
        <div className='gray-color fn12 m-t-8'>通话总时长</div>
      </Col>
      <Col span={12} md={6}>
        <div className='color fn24'>
          {Number(props.data?.connect_num) > 0 &&
          Number(props.data?.call_duration) > 0
            ? (
                Number(props.data.call_duration / 1000) /
                Number(props.data.connect_num)
              ).toFixed(0) + '秒'
            : '0秒'}
        </div>
        <div className='gray-color fn12 m-t-8'>平均通话时长</div>
      </Col>
      <Col span={12} md={6}>
        <div className='color fn24'>{props.data?.artificial_num || '0'}</div>
        <div className='gray-color fn12 m-t-8'>转人工量</div>
      </Col>
      <Col span={12} md={6}>
        <div className='color fn24'>{props.data?.hangup_num || '0'}</div>
        <div className='gray-color fn12 m-t-8'>短信发送量</div>
      </Col>
    </Row>
  )
}
