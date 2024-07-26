import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Flex,
  Table,
  Divider,
  Image,
  DatePicker,
  Form,
  Select,
  Space,
} from 'antd'
import type { GetProps } from 'antd'
import PageContent from '@/components/pageContent'

import { API } from 'apis'
import { getErrorsLogs, getChatbot } from '@/api'
import faceImg from '@/assets/rcs/face/errors.png'
import { usePoint } from '@/hooks'
import { getPresets } from '@/utils/day'
import dayjs from 'dayjs'

import './index.scss'
import ACopy from '@/components/aCopy'

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

const { RangePicker } = DatePicker
const rangePresets = getPresets([0, 1, 3, 7, 15, 30, 90])
// 只允许选择15天前-今天的日期
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  const today = dayjs()
  const fifteenDaysAgo = today.subtract(90, 'day')
  const currentDate = dayjs(current)
  return currentDate.isBefore(fifteenDaysAgo) || currentDate.isAfter(today)
}

export default function Fn() {
  const pointXs = usePoint('xs')
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const [getErrorList, setGetErrorList] = useState<API.GetErrorsLogsItems[]>()
  const [chatbotList, setChatbotList] = useState<API.ChatbotItem[]>([])

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
      setChatbotList(
        res.list.map((item) => {
          item.name = `${item.name}(${item.id})`
          return item
        }),
      )
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
      title: 'Chatbot名称(ID)',
      fixed: true,
      width: 200,
      className: 'paddingL20',
      render: (_, record) => (
        <Space size={0} align='center' wrap style={{ width: 180 }}>
          <div style={{ position: 'relative' }}>
            <ACopy text={record.chatbot_name} title='点击复制Chatbot名称' />
            {record.chatbot_name}
          </div>
          <NavLink
            target='__blank'
            to={`/console/rcs/chatbot/detail/${record.appid}`}
            className='gray-color-sub g-pointer'>
            ({record.appid})
          </NavLink>
        </Space>
      ),
    },
    {
      title: 'API',
      dataIndex: 'api',
      className: 'paddingL20',
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
      width: 260,
      dataIndex: 'msg',
    },
  ]

  return (
    <PageContent extClass='api-errorlogs'>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center' style={{ height: 40 }}>
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
          time: rangePresets[2].value,
        }}>
        <Flex align='flex-end' wrap='wrap' gap={16}>
          <Form.Item label='Chatbot选择' name='chatbot' className='m-b-0'>
            <Select
              placeholder='全部Chatbot'
              allowClear
              popupMatchSelectWidth={200}
              style={{ width: 200 }}
              options={chatbotList}
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
            showTotal: (total) => `共 ${total} 条`,
            onChange: changePageInfo,
          }}
          scroll={{ x: 'max-content' }}
        />
      </Form>
    </PageContent>
  )
}
