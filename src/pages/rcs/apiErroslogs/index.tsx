import { useState, useEffect } from 'react'
import { Flex, Table, Divider, Image, DatePicker, Form, Select } from 'antd'
import type { GetProps } from 'antd'
import PageContent from '@/components/pageContent'

import { API } from 'apis'
import { getErrorsLogs, getChatbot } from '@/api'
import topIco from '@/assets/rcs/errorlogs/err_ico.png'
import { useSize, usePoint } from '@/hooks'
import { getPresets } from '@/utils/day'
import dayjs from 'dayjs'

import './index.scss'

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

const { RangePicker } = DatePicker
const rangePresets = getPresets([7, 15, 30, 90])
// 只允许选择15天前-今天的日期
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  const today = dayjs()
  const fifteenDaysAgo = today.subtract(90, 'day')
  const currentDate = dayjs(current)
  return currentDate.isBefore(fifteenDaysAgo) || currentDate.isAfter(today)
}

export default function Fn() {
  const pointXs = usePoint('xs')
  const size = useSize()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const [getErrorList, setGetErrorList] = useState<API.GetErrorsLogsItems[]>()
  const [chatBotList, setChatBotList] = useState<API.ChatbotItem[]>([])

  // 获取chatbot
  const getChatbotList = async () => {
    try {
      const res = await getChatbot({
        page: 1,
        limit: 10000,
        appid: '',
        keywords: '',
        status: '1',
      })
      setChatBotList(res.list)
    } catch (error) {}
  }

  // 获取错误日志
  const getList = async () => {
    setLoading(true)
    try {
      const formValues = await form.getFieldsValue()
      const start = formValues.time[0].format('YYYY-MM-DD')
      const end = formValues.time[1].format('YYYY-MM-DD')
      let params = {
        appid: formValues.chatbot,
        start,
        end,
        page: page,
        limit: limit,
      }
      const res = await getErrorsLogs(params)
      setGetErrorList(res.data)
      setTotal(res.rows)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const changePageInfo = (page, pageSize) => {
    if (pageSize != limit) {
      setPage(1)
      setLimit(pageSize)
    } else {
      setPage(page)
    }
  }

  // 除搜索关键字，其他字段改变直接搜索
  const onValuesChange = (changedValues, allValues) => {
    getList()
  }

  useEffect(() => {
    getChatbotList()
  }, [])

  useEffect(() => {
    getList()
  }, [limit, page])

  const columns = [
    {
      title: 'Chatbot',
      fixed: true,
      width: size == 'small' ? 150 : 200,
      className: size == 'small' ? 'paddingL20' : 'paddingL30',
      render: (_, record) => (
        <div style={{ height: 40 }} className='fx-y-center'>
          {record.chatbot_name}
        </div>
      ),
    },
    {
      title: 'API',
      dataIndex: 'api',
      width: 180,
    },
    {
      title: '错误码',
      dataIndex: 'code',
      width: 120,
    },
    {
      title: '日期',
      dataIndex: 'datetime',
      width: 200,
    },
    {
      title: 'IP来源',
      dataIndex: 'ip',
      width: 160,
    },
    {
      title: '详情',
      render: (_, record) => (
        <div
          className='g-ellipsis-2 p-r-24'
          style={{ width: '240px' }}
          title={record.msg}>
          {record.msg}
        </div>
      ),
    },
  ]

  return (
    <PageContent extClass='api-errorlogs'>
      <Image src={topIco} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center' className='m-t-4'>
        <div className='fn22 fw-500'>API错误日志</div>
      </Flex>
      <Divider />
      <Form
        form={form}
        className='api-errorlogs-form'
        name='api-errorlogs'
        layout='vertical'
        autoComplete='off'
        onValuesChange={onValuesChange}
        initialValues={{
          time: rangePresets[3].value,
        }}>
        <Flex align='flex-end' wrap='wrap' gap={16}>
          <Form.Item label='Chatbot选择' name='chatbot' className='m-b-0'>
            <Select
              placeholder='全部Chatbot'
              allowClear
              popupMatchSelectWidth={120}
              style={{ width: 120 }}
              options={chatBotList}
              fieldNames={{ label: 'name', value: 'id' }}></Select>
          </Form.Item>
          <Form.Item label='时间范围' name='time' className='m-b-0'>
            <RangePicker
              presets={!pointXs && rangePresets}
              allowClear={false}
              disabledDate={disabledDate}></RangePicker>
          </Form.Item>
        </Flex>
        <Table
          loading={loading}
          className='theme-cell reset-table m-t-24'
          columns={columns}
          dataSource={getErrorList}
          rowKey={'id'}
          pagination={{
            position: ['bottomRight'],
            current: page,
            pageSize: limit,
            showQuickJumper: true,
            pageSizeOptions: [10, 20, 50],
            total: total,
            onChange: changePageInfo,
          }}
          scroll={{ x: 'max-content' }}
        />
      </Form>
    </PageContent>
  )
}
