import { Row, Col } from 'antd'
import './index.scss'
export default function Fn() {
  return (
    <Row className='call-rate' gutter={[12, 20]}>
      <Col span={12} md={8} xl={6}>
        <div className='rate-info'>
          <div className='color fn20 fw-500'>200</div>
          <div className='gray-color m-t-8'>呼较量</div>
        </div>
      </Col>
      <Col span={12} md={8} xl={6}>
        <div className='rate-info'>
          <div className='color fn20 fw-500'>200</div>
          <div className='gray-color m-t-8'>号码量</div>
        </div>
      </Col>
      <Col span={12} md={8} xl={6}>
        <div className='rate-info'>
          <div className='color fn20 fw-500'>200</div>
          <div className='gray-color m-t-8'>接通量</div>
        </div>
      </Col>
      <Col span={12} md={8} xl={6}>
        <div className='rate-info'>
          <div className='color fn20 fw-500'>200</div>
          <div className='gray-color m-t-8'>接通率</div>
        </div>
      </Col>
      <Col span={12} md={8} xl={6}>
        <div className='rate-info'>
          <div className='color fn20 fw-500'>200</div>
          <div className='gray-color m-t-8'>通话总时长</div>
        </div>
      </Col>
      <Col span={12} md={8} xl={6}>
        <div className='rate-info'>
          <div className='color fn20 fw-500'>200</div>
          <div className='gray-color m-t-8'>通话平均时长</div>
        </div>
      </Col>
      <Col span={12} md={8} xl={6}>
        <div className='rate-info'>
          <div className='color fn20 fw-500'>200</div>
          <div className='gray-color m-t-8'>重呼次数</div>
        </div>
      </Col>
      <Col span={12} md={8} xl={6}>
        <div className='rate-info'>
          <div className='color fn20 fw-500'>200</div>
          <div className='gray-color m-t-8'>转人工次数</div>
        </div>
      </Col>
      <Col span={12} md={8} xl={6}>
        <div className='rate-info'>
          <div className='color fn20 fw-500'>200</div>
          <div className='gray-color m-t-8'>发送短信数</div>
        </div>
      </Col>
      <Col span={12} md={8} xl={6}>
        <div className='rate-info'>
          <div className='color fn20 fw-500'>200</div>
          <div className='gray-color m-t-8'>机器人已工作时间</div>
        </div>
      </Col>
    </Row>
  )
}
