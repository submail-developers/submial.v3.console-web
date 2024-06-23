import { useEffect, useRef, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  Image,
  Flex,
  Space,
  Divider,
  Row,
  Col,
  DatePicker,
  Form,
  Select,
} from 'antd'
import type { GetProps } from 'antd'
import PageContent from '@/components/pageContent'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

import MyExport from './components/export'
import MyCard from './components/card'
import Overview from './components/overview'
import MySuccess from './components/success'
import MyError from './components/error'
import MyHot from './components/hot'
import { getPresets } from '@/utils/day'
import { usePoint } from '@/hooks'

import { API } from 'apis'
import { getChatbot, getUnionAnalysis } from '@/api'

import topIco from '@/assets/rcs/analysis/analysis_ico.png'

import './index.scss'
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>
const { RangePicker } = DatePicker

// 只允许选择90天前-今天的日期
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  const today = dayjs()
  const fifteenDaysAgo = today.subtract(90, 'day')
  const currentDate = dayjs(current)
  return currentDate.isBefore(fifteenDaysAgo) || currentDate.isAfter(today)
}
// 预设日期
const rangePresets = getPresets([7, 15, 30, 90])

export default function Fn() {
  const pointXs = usePoint('xs')
  const [loading, setLoading] = useState(false)
  const [chatbotList, setChatbotLit] = useState<API.ChatbotItem[]>([])
  const [appid, setappid] = useState('')

  const [echartsData, setechartsData] = useState<API.GetUnionAnalysis>()

  const [time, setTime] = useState<[Dayjs, Dayjs]>(rangePresets[0].value)
  const onRangeChange = (value: [Dayjs, Dayjs]) => {
    setTime(value)
  }

  const initChatbot = async () => {
    try {
      const res = await getChatbot({
        page: 1,
        limit: 10000,
        appid: '',
        keywords: '',
        status: 'all',
      })
      setChatbotLit(res.list || [])
      setLoading(false)
    } catch (error) {}
  }

  const initData = async () => {
    setLoading(true)
    try {
      const res = await getUnionAnalysis({
        appid: appid,
        start: time[0].format('YYYY-MM-DD'),
        end: time[1].format('YYYY-MM-DD'),
      })
      setechartsData(res.analysis)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const changeChatbot = (value) => {
    setappid(value)
  }

  useEffect(() => {
    initData()
  }, [appid, time])

  useEffect(() => {
    initChatbot()
  }, [])

  return (
    <PageContent extClass='api-analysis'>
      <Image src={topIco} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center'>
        <div className='fn22 fw-500'>API分析报告</div>
        <MyExport />
      </Flex>
      <Divider />
      <Form layout='vertical' initialValues={{ time: rangePresets[0].value }}>
        <Space size={24}>
          <Form.Item label='Chatbot选择' name='chatbot'>
            <Select
              allowClear
              value={appid}
              onChange={changeChatbot}
              style={{ width: 120 }}
              placeholder='全部'
              options={chatbotList}
              fieldNames={{ label: 'name', value: 'id' }}></Select>
          </Form.Item>
          <Form.Item label='时间范围' name='time'>
            <RangePicker
              presets={!pointXs && rangePresets}
              allowClear={false}
              disabledDate={disabledDate}
              onChange={onRangeChange}
            />
          </Form.Item>
        </Space>
      </Form>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <MyCard title='发送概览' minHeight={360} loading={loading}>
            {echartsData && (
              <Overview
                time={time}
                points={echartsData.points}
                rate={echartsData.rate}
              />
            )}
          </MyCard>
        </Col>
        <Col span={24} lg={12}>
          <MyCard title='成功分析' minHeight={240} loading={loading}>
            {echartsData && (
              <MySuccess successreason={echartsData.successreason} />
            )}
          </MyCard>
        </Col>
        <Col span={24} lg={12}>
          <MyCard title='失败分析' minHeight={240} loading={loading}>
            {echartsData && <MyError dropreason={echartsData.dropreason} />}
          </MyCard>
        </Col>
        <Col span={24}>
          <MyHot
            loading={loading}
            province={echartsData.province}
            city={echartsData.city}
          />
        </Col>
      </Row>
    </PageContent>
  )
}
