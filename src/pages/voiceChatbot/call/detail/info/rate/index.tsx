import { Row, Col } from 'antd'
import { API } from 'apis'
import './index.scss'

type Props = {
  data: API.GetVCTaskScheduleRes
  address_total: string
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
  const call_duration = formatSeconds(Number(props.data.call_duration))
  return (
    <Row className='call-rate' gutter={[12, 24]}>
      <Col span={12} md={8} xl={6}>
        <div className='rate-info'>
          <div className='color fn22 fw-500'>{props.address_total || '0'}</div>
          <div className='gray-color m-t-8'>号码量</div>
        </div>
      </Col>
      <Col span={12} md={8} xl={6}>
        <div className='rate-info'>
          <div className='color fn22 fw-500'>{props.data.call_num || '0'}</div>
          <div className='gray-color m-t-8'>呼较量</div>
        </div>
      </Col>
      <Col span={12} md={8} xl={6}>
        <div className='rate-info'>
          <div className='color fn22 fw-500'>
            {props.data.connect_num || '0'}
          </div>
          <div className='gray-color m-t-8'>接通量</div>
        </div>
      </Col>
      <Col span={12} md={8} xl={6}>
        <div className='rate-info'>
          <div className='color fn22 fw-500'>
            {Number(props.data.call_num) > 0 &&
            Number(props.data.connect_num) > 0
              ? (
                  (Number(props.data.connect_num) /
                    Number(props.data.call_num)) *
                  100
                ).toFixed(0) + '%'
              : '0%'}
          </div>
          <div className='gray-color m-t-8'>接通率</div>
        </div>
      </Col>
      <Col span={12} md={8} xl={6}>
        <div className='rate-info'>
          <div
            className={`color  fw-500 ${
              call_duration.includes('小时') ? 'fn16' : 'fn22'
            }`}>
            {call_duration}
          </div>
          <div className='gray-color m-t-8'>通话总时长</div>
        </div>
      </Col>
      <Col span={12} md={8} xl={6}>
        <div className='rate-info'>
          <div className='color fn22 fw-500'>
            {Number(props.data.call_duration) > 0 &&
            Number(props.data.call_num) > 0
              ? (
                  Number(props.data.call_duration) / Number(props.data.call_num)
                ).toFixed(0) + '秒'
              : '0'}
          </div>
          <div className='gray-color m-t-8'>通话平均时长</div>
        </div>
      </Col>
      <Col span={12} md={8} xl={6}>
        <div className='rate-info'>
          <div className='color fn22 fw-500'>
            {props.data.recall_num || '0'}
          </div>
          <div className='gray-color m-t-8'>重呼次数</div>
        </div>
      </Col>
      <Col span={12} md={8} xl={6}>
        <div className='rate-info'>
          <div className='color fn22 fw-500'>
            {props.data.artificial_num || '0'}
          </div>
          <div className='gray-color m-t-8'>转人工次数</div>
        </div>
      </Col>
      <Col span={12} md={8} xl={6}>
        <div className='rate-info'>
          <div className='color fn22 fw-500'>
            {props.data.hangup_num || '0'}
          </div>
          <div className='gray-color m-t-8'>发送短信数</div>
        </div>
      </Col>
    </Row>
  )
}
