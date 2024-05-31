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
  Dropdown,
  Space,
  Input,
  message,
} from 'antd'
import PageContent from '@/components/pageContent'
import { DownOutlined } from '@ant-design/icons'
import { getChatbot, getHistory, exportHistory, downLaodFile } from '@/api'
import { API } from 'apis'
import topIco from '@/assets/rcs/history/history_ico.png'
import './index.scss'
import VerifyCode from './verifyCodeDialog/index'
import { useSize, usePoint } from '@/hooks'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
const { Option } = Select
const { RangePicker } = DatePicker

const allChatBot = {
  id: 'all',
  name: '全部ChatBot',
} as API.ChatbotItem

enum statusNum {
  '无状态' = 0,
  '成功',
  '失败',
  '已撤回',
}
enum statusStyle {
  'text-color' = 0,
  'success-color',
  'error-color',
  'gray-color',
}
enum ExportType {
  'txt' = 0,
  'csv' = 1,
  'excel' = 2,
  'jso' = 3,
  'xml' = 4,
}

export default function Fn() {
  const [form] = Form.useForm()
  const size = useSize()
  const point = usePoint('lg')
  const [loading, setLoading] = useState(false)
  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(40)
  const [total, setTotal] = useState<number>(0)
  const [historyList, setHistoryList] = useState<API.GetHistoryItems[]>()
  const [chatBotList, setChatBotList] = useState<API.ChatbotItem[]>([
    allChatBot,
  ])
  // 导出
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [exportconfirm, setExportconfirm] = useState(false)
  const [exportParams, setExportParams] = useState([])
  const [fileType, setFileType] = useState()
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

  // 获取历史明细
  const getList = async () => {
    const formValues = form.getFieldsValue()
    const start =
      (formValues.time && formValues.time[0].format('YYYY-MM-DD')) || ''
    const end =
      (formValues.time && formValues.time[1].format('YYYY-MM-DD')) || ''

    let params = {
      page: currentPage,
      limit: pageSize,
      start,
      end,
      appid: formValues.appid,
      status: formValues.status,
      send_id: formValues.send_id,
      to: formValues.to,
      content: formValues.content,
    }
    let arr = []

    arr.push(params)
    setExportParams(arr)
    const res = await getHistory(params)
    if (res.exportconfirm == '1') {
      setExportconfirm(true)
    } else {
      setExportconfirm(false)
    }
    setHistoryList(res.history)
    setTotal(res.row)
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
      title: '手机号',
      dataIndex: 'to',
      fixed: true,
      width: size == 'small' ? 150 : 200,
      className: size == 'small' ? 'paddingL20' : 'paddingL30',
    },
    {
      title: '号码详情',
      dataIndex: 'mobDedail',
      key: 'mobDedail',
      width: 200,
      render: (_, record) => (
        <div>
          {record.mobileType}/{record.mobileArea}
        </div>
      ),
    },
    {
      title: '模板ID',
      dataIndex: 'sign',
      width: 120,
    },
    {
      title: '发送时间',
      dataIndex: 'send',
      width: 200,
    },
    {
      title: '送达时间',
      dataIndex: 'sent',
      width: 200,
    },
    {
      title: '计费(元)',
      dataIndex: 'fee',
      width: 100,
      render: (_, record) => <div>1</div>,
    },
    {
      title: '送达状态',
      dataIndex: 'status',
      width: 200,
      render: (_, record) => (
        <div className={statusStyle[record.status]}>
          {statusNum[record.status]}
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

  const items = [
    {
      label: '导出 TXT (仅手机号码)',
      key: '0',
    },
    {
      label: '导出 CSV',
      key: '1',
    },

    {
      label: '导出 EXCEL',
      key: '2',
    },
    {
      label: '导出 JSON',
      key: '3',
    },
    {
      label: '导出 XML',
      key: '4',
    },
  ]

  const sendOptions = [
    {
      value: 'all',
      label: '全部状态',
    },
    {
      value: 'delivered',
      label: '发送成功',
    },
    {
      value: 'dropped',
      label: '发送失败',
    },
    {
      value: 'pending',
      label: '等待中',
    },
  ]

  const handleCancel = () => {
    setIsOpenModal(false)
  }
  const edit = async (e) => {
    if (exportconfirm) {
      setIsOpenModal(true)
      setFileType(e.key)
    } else {
      const formValues = form.getFieldsValue()
      const start =
        (formValues.time && formValues.time[0].format('YYYY-MM-DD')) || ''
      const end =
        (formValues.time && formValues.time[1].format('YYYY-MM-DD')) || ''

      const res = await exportHistory({
        start,
        end,
        appid: formValues.appid,
        status: formValues.status,
        send_id: formValues.send_id,
        to: formValues.to,
        content: formValues.content,
        type: ExportType[e.key],
      })
      if (res.status == 'success') {
        downLaodFile('')
      } else {
        message.error(res.message)
      }
    }
  }

  return (
    <PageContent extClass='api-history'>
      <Form
        form={form}
        className='api-history-form'
        name='api-history'
        layout='vertical'
        autoComplete='off'
        initialValues={{
          chatbot: 'all',
          sendStatus: 'all',
          time: [dayjs().add(-1, 'd'), dayjs().add(0, 'd')],
        }}>
        <Image src={topIco} preview={false} width={72}></Image>
        <Flex
          justify='space-between'
          align='center'
          style={{ marginTop: '4px' }}>
          <div className='fn22 fw-500'>API历史明细</div>
          <Button type='primary' size={point ? 'large' : 'middle'}>
            <Dropdown
              className='export'
              menu={{ items, selectable: true, onClick: edit }}
              trigger={['click']}>
              <Space>
                导出
                <DownOutlined rev={null} />
              </Space>
            </Dropdown>
          </Button>
        </Flex>
        <Divider className='line'></Divider>

        <Row gutter={16} className='m-b-20'>
          <Col>
            <Form.Item
              label='ChatBot选择'
              name='chatbot'
              style={{ width: '140px', marginBottom: '0px' }}>
              <Select placeholder='所有标签' popupMatchSelectWidth={120}>
                {chatBotList.map((option) => (
                  <Option key={option.id} value={option.id}>
                    {option.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} md={8} lg={6} xl={3}>
            <Form.Item
              label='发送状态'
              name='status'
              style={{ marginBottom: '0px' }}>
              <Select placeholder='所有标签' popupMatchSelectWidth={120}>
                {sendOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={24} md={8} lg={6} xl={3}>
            <Form.Item
              label='SEND ID'
              name='send_id'
              style={{ marginBottom: '0px' }}>
              <Input placeholder='请输入sendid' />
            </Form.Item>
          </Col>
          <Col span={24} md={8} lg={6} xl={3}>
            <Form.Item
              label='手机号码'
              name='to'
              style={{ marginBottom: '0px' }}>
              <Input placeholder='请输入手机号码' />
            </Form.Item>
          </Col>

          <Col span={24} md={8} lg={6} xl={3}>
            <Form.Item
              label='短信内容'
              name='content'
              style={{ marginBottom: '0px' }}>
              <Input placeholder='请输入短信内容' />
            </Form.Item>
          </Col>
          <Col>
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
          dataSource={historyList}
          rowKey={'sendID'}
          sticky
          pagination={{
            position: ['bottomRight'],
            pageSize: 100,
            pageSizeOptions: [100, 200, 300],
          }}
          scroll={{ x: 'max-content' }}
        />
      </Form>
      <VerifyCode
        fileType={fileType}
        exportParams={exportParams}
        open={isOpenModal}
        onCancel={handleCancel}
      />
    </PageContent>
  )
}
