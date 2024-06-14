import { useState, useEffect } from 'react'
import {
  Flex,
  Table,
  Row,
  Col,
  Button,
  Divider,
  Image,
  DatePicker,
  Form,
  Select,
} from 'antd'
import PageContent from '@/components/pageContent'

import { getErrorsLogs, getChatbot } from '@/api'
import { API } from 'apis'
import topIco from '@/assets/rcs/errorlogs/err_ico.png'
import './index.scss'
import { useSize } from '@/hooks'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
const { Option } = Select

const { RangePicker } = DatePicker
const allChatBot = {
  id: 'all',
  name: '全部Chatbot',
} as API.ChatbotItem

export default function Fn() {
  const size = useSize()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(40)
  const [total, setTotal] = useState<number>(0)
  const [getErrorList, setGetErrorList] = useState<API.GetErrorsLogsItems[]>()
  const [chatBotList, setChatBotList] = useState<API.ChatbotItem[]>([
    allChatBot,
  ])

  // 获取chatbot
  const getChatbotList = async () => {
    setLoading(true)
    try {
      const res = await getChatbot({
        page: currentPage,
        limit: pageSize,
        appid: '',
        keywords: '',
        status: 'all',
      })
      setChatBotList([...chatBotList, ...res.list])

      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  // 获取错误日志
  const getList = async () => {
    setLoading(true)
    try {
      const formValues = await form.getFieldsValue()
      const start =
        (formValues.time && formValues.time[0].format('YYYY-MM-DD')) || ''
      const end =
        (formValues.time && formValues.time[1].format('YYYY-MM-DD')) || ''
      let params = {
        appid: formValues.chatbot,
        start,
        end,
        page: currentPage,
        limit: pageSize,
      }

      const res = await getErrorsLogs(params)
      setGetErrorList(res.data)
      setTotal(res.rows)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      console.log('From: ', dates[0], ', to: ', dates[1])
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
    } else {
      console.log('Clear')
    }
  }

  useEffect(() => {
    getList()
    getChatbotList()
  }, [])

  const columns = [
    {
      title: 'Chatbot',
      dataIndex: 'chatbot_name',
      fixed: true,
      width: size == 'small' ? 150 : 240,
      className: size == 'small' ? 'paddingL20' : 'paddingL30',
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
      dataIndex: 'detail',
      key: 'detail',
      render: (_, record) => (
        <div className='g-ellipsis-2' style={{ width: '240px' }}>
          {record.msg}
        </div>
      ),
    },
  ]

  const rangePresets: {
    label: string
    value: [Dayjs, Dayjs]
  }[] = [
    {
      label: '最近 7 天',
      value: [dayjs().add(-7, 'd'), dayjs()],
    },
    {
      label: '最近 15 天',
      value: [dayjs().add(-15, 'd'), dayjs()],
    },
    {
      label: '最近一个月',
      value: [dayjs().add(-30, 'd'), dayjs()],
    },
    {
      label: '最近三个月',
      value: [dayjs().add(-90, 'd'), dayjs()],
    },
  ]

  return (
    <PageContent extClass='api-errorlogs'>
      <Form
        form={form}
        className='api-errorlogs-form'
        name='api-errorlogs'
        layout='vertical'
        autoComplete='off'
        initialValues={{
          chatbot: 'all',
          time: [dayjs().add(-1, 'd'), dayjs().add(0, 'd')],
        }}>
        <Image src={topIco} preview={false} width={72}></Image>
        <Flex
          justify='space-between'
          align='center'
          style={{ marginTop: '4px' }}>
          <div className='fn22 fw-500'>API错误日志</div>
        </Flex>
        <Divider className='line'></Divider>

        <Row gutter={16}>
          <Col className='top-item m-b-20'>
            <Form.Item
              label='Chatbot选择'
              name='chatbot'
              style={{ width: '140px', marginBottom: '0px' }}>
              <Select placeholder='所有标签' popupMatchSelectWidth={120}>
                {chatBotList?.map((option) => (
                  <Option key={option.id} value={option.id}>
                    {option.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col className='top-item m-b-20'>
            <Form.Item
              label='时间范围'
              name='time'
              style={{ marginBottom: '0px' }}>
              <RangePicker
                clearIcon={false}
                presets={rangePresets}
                onChange={onRangeChange}
                style={{ width: size == 'small' ? 190 : 240 }}></RangePicker>
            </Form.Item>
          </Col>

          <Col span={6} md={4} xl={3}>
            <Form.Item label=' '>
              <Button
                type='primary'
                className='w-100'
                htmlType='submit'
                onClick={() => getList()}>
                查询
              </Button>
            </Form.Item>
          </Col>
        </Row>

        <Table
          className='theme-cell reset-table'
          columns={columns}
          dataSource={getErrorList}
          rowKey={'id'}
          sticky
          pagination={{
            position: ['bottomRight'],
            pageSize: 100,
            pageSizeOptions: [100, 200, 300],
          }}
          scroll={{ x: 'max-content' }}
        />
      </Form>
    </PageContent>
  )
}
