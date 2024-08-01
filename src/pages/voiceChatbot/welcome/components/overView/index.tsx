import { Row, Col } from 'antd'
import './index.scss'

export default function Fn() {
  return (
    <Row className='newVision-welcome-overview p-y-12' gutter={[0, 32]}>
      <Col span={12} md={6}>
        <div className='color fn18'>99912</div>
        <div className='gray-color fn12 m-t-8'>呼叫总量</div>
      </Col>
      <Col span={12} md={6}>
        <div className='color fn18'>99912</div>
        <div className='gray-color fn12 m-t-8'>号码总量</div>
      </Col>
      <Col span={12} md={6}>
        <div className='color fn18'>99912</div>
        <div className='gray-color fn12 m-t-8'>接通量</div>
      </Col>
      <Col span={12} md={6}>
        <div className='color fn18'>99912</div>
        <div className='gray-color fn12 m-t-8'>接通率</div>
      </Col>
      <Col span={12} md={6}>
        <div className='color fn18'>99912</div>
        <div className='gray-color fn12 m-t-8'>通话总时长</div>
      </Col>
      <Col span={12} md={6}>
        <div className='color fn18'>99912</div>
        <div className='gray-color fn12 m-t-8'>平均通话时长</div>
      </Col>
      <Col span={12} md={6}>
        <div className='color fn18'>99912</div>
        <div className='gray-color fn12 m-t-8'>转人工量</div>
      </Col>
      <Col span={12} md={6}>
        <div className='color fn18'>99912</div>
        <div className='gray-color fn12 m-t-8'>短信发送量</div>
      </Col>
    </Row>
  )
}
