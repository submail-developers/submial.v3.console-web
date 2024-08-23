import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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
import { API } from 'apis'
import {
  getVCTaskDetail,
  getVCTaskSchedule,
  getVCTaskTalkInfo,
  getVCTaskGradeInfo,
  getVCTaskCityInfo,
} from '@/api'
import './index.scss'
export default function Fn() {
  const { id } = useParams()
  const [loading, setLoading] = useState(false)
  const [speedLoading, setspeedLoading] = useState(false)
  const [talkLoading, settalkLoading] = useState(false)
  const [gradeLoading, setgradeLoading] = useState(false)
  const [cityLoading, setcityLoading] = useState(false)
  const [data, setData] = useState<API.GetVCTaskDetailRes>() // 任务详情
  const [speedData, setspeedData] = useState<API.GetVCTaskScheduleRes>() // 任务进度
  const [talkData, settalkData] = useState<API.GetVCTaskTalkRes>() // 对话轮次
  const [gradeData, setgradeData] = useState<API.VCTaskGradeItem[]>([]) // 意向客户
  const [cityData, setcityData] = useState<API.GetVCTaskCityRes>() // 城市分析

  // 获取详情
  const getDetail = async () => {
    setLoading(true)
    try {
      const res = await getVCTaskDetail({
        sendlist: id,
      })
      if (res.status == 'success') {
        setData(res.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  // 获取进度
  const getSchedule = async () => {
    setspeedLoading(true)
    try {
      const res = await getVCTaskSchedule({
        sendlist: id,
      })
      if (res.status == 'success') {
        setspeedData(res.data)
      }
      setspeedLoading(false)
    } catch (error) {
      setspeedLoading(false)
    }
  }
  // 获取通话概览
  const getTalk = async () => {
    settalkLoading(true)
    try {
      const res = await getVCTaskTalkInfo({
        sendlist: id,
      })
      if (res.status == 'success') {
        settalkData(res.data)
      }
      settalkLoading(false)
    } catch (error) {
      settalkLoading(false)
    }
  }
  // 获取通话概览
  const getGrade = async () => {
    setgradeLoading(true)
    try {
      const res = await getVCTaskGradeInfo({
        sendlist: id,
      })
      if (res.status == 'success') {
        setgradeData(res.list)
      }
      setgradeLoading(false)
    } catch (error) {
      setgradeLoading(false)
    }
  }

  // 获取进度
  const getCity = async () => {
    setcityLoading(true)
    try {
      const res = await getVCTaskCityInfo({
        sendlist: id,
      })
      if (res.status == 'success') {
        setcityData(res.data)
      }
      setcityLoading(false)
    } catch (error) {
      setcityLoading(false)
    }
  }

  const init = () => {
    getDetail()
    getSchedule()
    getTalk()
    getGrade()
    getCity()
  }

  useEffect(() => {
    init()
  }, [])
  return (
    <div className='call-detail-info'>
      <Nav onRefresh={init} />
      <Row gutter={[16, 16]} className='m-t-16'>
        <Col span={24} xl={12}>
          <Des data={data} />
        </Col>
        <Col span={24} xl={12}>
          <ACard title='任务进度' minHeight={240} loading={speedLoading}>
            {speedData && (
              <Rate address_total={data?.address || '0'} data={speedData} />
            )}
          </ACard>
        </Col>
        <Col span={24} xl={12}>
          <ACard title='通话概览' minHeight={240} loading={talkLoading}>
            <TimeChat data={talkData?.talk} />
          </ACard>
        </Col>
        <Col span={24} xl={12}>
          <ACard title='对话轮次概览' minHeight={240} loading={talkLoading}>
            <TimesChat data={talkData?.traces} />
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
            loading={gradeLoading}
            minHeight={200}>
            <Grade data={gradeData || []} />
          </ACard>
        </Col>
        <Col span={24} xl={12} xxl={12}>
          <ACard
            title='外呼号码'
            minHeight={240}
            loading={loading}
            contentStyle={{ maxHeight: '240px', overflow: 'auto' }}>
            <Address address={data?.addressbook || []} />
          </ACard>
        </Col>
      </Row>
      <Hot
        loading={cityLoading}
        city={cityData?.city || []}
        province={cityData?.province || []}
      />
    </div>
  )
}
