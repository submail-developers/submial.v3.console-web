import { useEffect, useState } from 'react'
import { Image, Flex, Divider, Row, Col, DatePicker, Form, Select } from 'antd'
import type { GetProps } from 'antd'
import PageContent from '@/components/pageContent'
import AExport from '@/components/aExport'
import { useAppSelector } from '@/store/hook'
import { settingRcs } from '@/store/reducers/settingRcs'
import { downloadFile } from '@/utils'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

import MyCard from '@/components/aCard'
import Overview from './components/overview'
import MySuccess from './components/success'
import MyError from './components/error'
import MyHot from './components/hot'
import { getPresets } from '@/utils/day'
import { usePoint } from '@/hooks'

import { API } from 'apis'
import { getChatbot, getUnionAnalysis, exportRcsAnalysis } from '@/api'

import faceImg from '@/assets/rcs/face/analysis.png'

import './index.scss'
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>
const { RangePicker } = DatePicker

// 只允许选择90天前-今天的日期
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  const today = dayjs()
  // const fifteenDaysAgo = today.subtract(90, 'day')
  const currentDate = dayjs(current)
  // return currentDate.isBefore(fifteenDaysAgo) || currentDate.isAfter(today)
  return currentDate.isAfter(today)
}
// 预设日期
const rangePresets = getPresets([0, 1, 3, 7, 15, 30, 90])
const initTime = rangePresets[3].value

const items = [
  {
    label: '导出 CSV',
    key: 'csv',
  },

  {
    label: '导出 EXCEL',
    key: 'excel',
  },
  {
    label: '导出 JSON',
    key: 'json',
  },

  {
    label: '导出 XML',
    key: 'xml',
  },
]

export default function Fn() {
  const pointXs = usePoint('xs')
  const rcsSetting = useAppSelector(settingRcs)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [time, setTime] = useState<[Dayjs, Dayjs]>(initTime)
  const [chatbotList, setChatbotLit] = useState<API.ChatbotItem[]>([])

  const [echartsData, setechartsData] = useState<API.GetUnionAnalysis>()

  const initChatbot = async () => {
    try {
      const res = await getChatbot({
        page: 1,
        limit: 10000,
        appid: '',
        keywords: '',
        status: '1',
      })
      setChatbotLit(
        res.list.map((item) => {
          item.name = `${item.name}(${item.id})`
          return item
        }),
      )
    } catch (error) {}
  }

  const initData = async () => {
    setLoading(true)
    try {
      const fromValues = await form.getFieldsValue()
      setTime(fromValues.time)
      const res = await getUnionAnalysis({
        appid: fromValues.appid || '',
        start: fromValues.time[0].format('YYYY-MM-DD'),
        end: fromValues.time[1].format('YYYY-MM-DD'),
      })
      setechartsData(res.analysis)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  // 导出
  const exportEvent = async (file_type) => {
    const { time, appid = '' } = await form.getFieldsValue()
    const start = time[0].format('YYYY-MM-DD')
    const end = time[1].format('YYYY-MM-DD')
    const res = await exportRcsAnalysis({
      file_type,
      start,
      end,
      appid,
    })
    if (res.status == 'success') {
      downloadFile()
    }
  }

  useEffect(() => {
    initChatbot()
    initData()
  }, [])

  return (
    <PageContent extClass='api-analysis'>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center'>
        <div className='fn22 fw-500'>API分析报告</div>

        <AExport
          items={items}
          onExportEvent={exportEvent}
          useCode={rcsSetting?.settings?.export_confrim == '1'}
        />
      </Flex>
      <Divider />
      <Form
        form={form}
        layout='vertical'
        autoComplete='off'
        onValuesChange={() => initData()}
        initialValues={{ time: initTime }}>
        <Flex align='flex-end' wrap='wrap' gap={16}>
          <Form.Item label='Chatbot选择' name='chatbot'>
            <Select
              allowClear
              popupMatchSelectWidth={200}
              style={{ width: 200 }}
              placeholder='全部'
              options={chatbotList}
              fieldNames={{ label: 'name', value: 'id' }}></Select>
          </Form.Item>
          <Form.Item label='时间范围' name='time'>
            <RangePicker
              presets={!pointXs && rangePresets}
              allowClear={false}
              disabledDate={disabledDate}
            />
          </Form.Item>
        </Flex>
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
            province={echartsData?.province || []}
            city={echartsData?.city || []}
          />
        </Col>
      </Row>
    </PageContent>
  )
}
