import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col, Space, Flex } from 'antd'
import type { MenuProps } from 'antd'
import ACard from '@/components/aCard'
import AExport from '@/components/aExport'
import { downloadFile } from '@/utils'
import Des from './des'
import Rate from './rate'
import TimeChat from './timeChat'
import TimesChat from './timesChat'
import Grade from './grade'
import Address from './address'
import Hot from './hot'
import { API } from 'apis'
import {
  getVCTaskSchedule,
  getVCTaskTalkInfo,
  getVCTaskGradeInfo,
  getVCTaskCityInfo,
  exportVCTaskSchedule,
} from '@/api'
import { StatusText } from '../../type'
import { useStateStore } from '../reducer'

import './index.scss'
const items: MenuProps['items'] = [
  { label: '导出 CSV', key: 'csv' },
  { label: '导出 EXCEL', key: 'excel' },
  { label: '导出 JSON', key: 'json' },
  { label: '导出 XML', key: 'xml' },
]

export default function Fn() {
  const store = useStateStore()
  const { id } = useParams()
  const [speedLoading, setspeedLoading] = useState(false)
  const [talkLoading, settalkLoading] = useState(false)
  const [gradeLoading, setgradeLoading] = useState(false)
  const [cityLoading, setcityLoading] = useState(false)
  const [speedData, setspeedData] = useState<API.GetVCTaskScheduleRes>() // 任务进度
  const [talkData, settalkData] = useState<API.GetVCTaskTalkRes>() // 对话轮次
  const [gradeData, setgradeData] = useState<API.VCTaskGradeItem[]>([]) // 意向客户
  const [cityData, setcityData] = useState<API.GetVCTaskCityRes>() // 城市分析

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
  // 导出
  const exportEvent = async (file_type) => {
    const res = await exportVCTaskSchedule({
      sendlist: id,
      type: file_type,
    })
    if (res.status == 'success') {
      downloadFile()
    }
  }

  useEffect(() => {
    if (store.loading) {
      getSchedule()
      getTalk()
      getGrade()
      getCity()
    }
  }, [store.loading])
  return (
    <div className='call-detail-info'>
      <Row gutter={[16, 16]} className='m-t-16'>
        <Col span={24} xl={12}>
          <Des data={store.detail} />
        </Col>

        <Col span={24} xl={12}>
          <ACard
            title={
              <Flex justify='space-between' align='center' className='w-100'>
                <Space size={0}>
                  <span>任务进度</span>
                  {store.detail && (
                    <span
                      className={`send-type status-${store.detail?.status}`}>
                      （{StatusText[store.detail?.status]}）
                    </span>
                  )}
                </Space>
                <AExport
                  items={items}
                  onExportEvent={exportEvent}
                  useCode={false}
                  dropDownProps={{ placement: 'bottomRight' }}
                  // useCode={rcsSetting?.settings?.export_confrim == '1'}
                >
                  <div className='g-pointer color fn14 fw-400'>
                    导出
                    <i
                      className='icon iconfont icon-xiangxia m-l-8 fn8 g-rotate-90'
                      style={{ transform: 'translateY(4px)' }}></i>
                  </div>
                </AExport>
              </Flex>
            }
            minHeight={240}
            loading={speedLoading}>
            {speedData && (
              <Rate
                address_total={store.detail?.address || '0'}
                data={speedData}
              />
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
            loading={store.loading}
            contentStyle={{ maxHeight: '240px', overflow: 'auto' }}>
            <Address
              loading={store.loading}
              address={store.detail?.addressbook || []}
              addressfile_oss_path={store.detail?.addressfile_oss_path || ''}
            />
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
