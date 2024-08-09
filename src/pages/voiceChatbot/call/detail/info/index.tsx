import { Row, Col, Space, Divider, Button, Image, Descriptions } from 'antd'
import type { DescriptionsProps } from 'antd'
import Nav from '../nav'
import ACard from '@/components/aCard'
import Des from './des'
import Rate from './rate'
import TimeChat from './timeChat'
import TimesChat from './timesChat'
import Grade from './grade'
import Address from './address'
import Hot from './hot'
import './index.scss'
export default function Fn() {
  return (
    <div className='call-detail-info'>
      <Nav />
      <Row gutter={[16, 16]} className='m-t-16'>
        <Col span={24} xl={12}>
          <Des />
        </Col>
        <Col span={24} xl={12}>
          <ACard
            title={
              <Space size={0}>
                <span>任务进度</span>
                <span className='success-color'>（进行中）</span>
              </Space>
            }
            minHeight={240}
            loading={false}>
            <Rate />
          </ACard>
        </Col>
        <Col span={24} xl={12}>
          <ACard title='通话概览' minHeight={240} loading={false}>
            <TimeChat />
          </ACard>
        </Col>
        <Col span={24} xl={12}>
          <ACard title='对话轮次概览' minHeight={240} loading={false}>
            <TimesChat />
          </ACard>
        </Col>
        <Col span={24} xl={12}>
          <ACard
            title={
              <Row className='w-100' style={{ textIndent: 0 }}>
                <Col className='fn16 fw-500' span={14}>
                  意向客户
                </Col>
                <Col className='fn16 fw-500' span={5}>
                  数量
                </Col>
                <Col className='fn16 fw-500' span={5}>
                  占比
                </Col>
              </Row>
            }
            loading={false}
            minHeight={200}>
            <Grade />
          </ACard>
        </Col>
        <Col span={24} xl={12} xxl={12}>
          <ACard
            title='外呼号码'
            minHeight={240}
            loading={false}
            contentStyle={{ maxHeight: '240px', overflow: 'auto' }}>
            <Address />
          </ACard>
        </Col>
      </Row>
      <Hot
        loading={false}
        city={[
          {
            city: '上海',
            cnt: '2',
          },
          {
            city: '北京',
            cnt: '2',
          },
        ]}
        province={[
          {
            province: '上海',
            cnt: '10',
          },
          {
            province: '北京',
            cnt: '10',
          },
        ]}
      />
    </div>
  )
}
