import { useState, useEffect } from 'react'
import {
  Flex,
  Table,
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
import type { GetProps } from 'antd'
import PageContent from '@/components/pageContent'
import ACopy from '@/components/aCopy'
import { DownOutlined } from '@ant-design/icons'
import { getChatbot, getHistory, exportHistory, downLaodFile } from '@/api'
import { API } from 'apis'
import topIco from '@/assets/rcs/history/history_ico.png'
import './index.scss'
import VerifyCode from './verifyCodeDialog/index'
import { usePoint } from '@/hooks'
import dayjs from 'dayjs'
import { getPresets } from '@/utils/day'

enum statusNum {
  '等待',
  '成功',
  '失败',
  '撤回',
}
enum statusStyle {
  'gray-color',
  'success-color',
  'error-color',
  'warning-color',
}
enum ExportType {
  'txt' = 0,
  'csv' = 1,
  'excel' = 2,
  'jso' = 3,
  'xml' = 4,
}

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>
const { RangePicker } = DatePicker

const rangePresets = getPresets([0, 1, 3, 7, 15, 30])
// 只允许选择15天前-今天的日期
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  const today = dayjs()
  // const fifteenDaysAgo = today.subtract(90, 'day')
  const currentDate = dayjs(current)
  // return currentDate.isBefore(fifteenDaysAgo) || currentDate.isAfter(today)
  return currentDate.isAfter(today)
}

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

export default function Fn() {
  const [form] = Form.useForm()
  const pointXs = usePoint('xs')
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const [tableData, setTableData] = useState<API.GetHistoryItems[]>()
  const [chatBotList, setChatBotList] = useState<API.ChatbotItem[]>([])
  // 导出
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [exportconfirm, setExportconfirm] = useState(false)
  const [exportParams, setExportParams] = useState([])
  const [fileType, setFileType] = useState()
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

  // 获取历史明细
  const getList = async () => {
    setLoading(true)
    try {
      const formValues = form.getFieldsValue()
      const start = formValues.time[0].format('YYYY-MM-DD')
      const end = formValues.time[1].format('YYYY-MM-DD')

      let params = {
        page: page,
        limit: limit,
        start,
        end,
        appid: formValues?.appid || 'all',
        status: formValues?.status || 'all',
        send_id: formValues.send_id,
        to: formValues.to,
        content: formValues.content,
      }

      const res = await getHistory(params)
      setTableData(res.history)
      setTotal(res.row)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsOpenModal(false)
  }
  const exportEvent = async (e) => {}

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
    let changeKey = Object.keys(changedValues)[0]
    if (!['send_id', 'to', 'content'].includes(changeKey)) {
      if (page == 1) {
        getList()
      } else {
        setPage(1)
      }
    }
  }

  const search = () => {
    setLoading(true)
    if (page == 1) {
      getList()
    } else {
      setPage(1)
    }
  }

  useEffect(() => {
    getChatbotList()
  }, [])

  useEffect(() => {
    getList()
  }, [limit, page])

  const columns = [
    {
      title: '手机号',
      fixed: true,
      width: 140,
      className: 'paddingL20',
      render: (_, record) => (
        <div style={{ height: 40 }} className='fx-y-center'>
          {record.to}
        </div>
      ),
    },
    {
      title: '号码详情',
      width: 200,
      render: (_, record) => (
        <>
          {record.mobileType}
          {record.mobileArea
            ? `/${record.mobileArea.split(' ').join('/')}`
            : '-'}
        </>
      ),
    },
    {
      title: '模板ID',
      width: 100,
      render: (_, record) => (
        <div className='w-100' style={{ position: 'relative' }}>
          <ACopy text={record.sign} />
          {record.sign}
        </div>
      ),
    },
    {
      title: '发送时间',
      dataIndex: 'send',
      width: 180,
    },
    {
      title: '送达时间',
      dataIndex: 'sent',
      width: 180,
    },
    {
      title: '送达状态',
      dataIndex: 'status',
      width: 120,
      render: (_, record) => (
        <div className={statusStyle[record.status]}>
          {statusNum[record.status]}
        </div>
      ),
    },
    {
      title: '计费',
      width: 100,
      render: (_, record) => <div>{record.status == '1' ? '1' : '0'}</div>,
    },
  ]

  return (
    <PageContent extClass='api-history' xxl={1260}>
      <Image src={topIco} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center' style={{ marginTop: '4px' }}>
        <div className='fn22 fw-500'>API历史明细</div>
        <Dropdown
          className='export'
          menu={{ items, selectable: true, onClick: exportEvent }}
          trigger={['click']}>
          <Button type='primary'>
            <span className='m-r-8'>导 出</span>
            <DownOutlined rev={null} />
          </Button>
        </Dropdown>
      </Flex>
      <Divider className='line'></Divider>
      <Form
        form={form}
        className='api-history-form'
        name='api-history'
        layout='vertical'
        autoComplete='off'
        onValuesChange={onValuesChange}
        initialValues={{
          time: rangePresets[0].value,
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
          <Form.Item label='发送状态' name='status' className='m-b-0'>
            <Select
              placeholder='全部状态'
              allowClear
              popupMatchSelectWidth={120}
              style={{ width: 120 }}
              options={sendOptions}></Select>
          </Form.Item>
          <Form.Item label='时间范围' name='time' className='m-b-0'>
            <RangePicker
              presets={!pointXs && rangePresets}
              allowClear={false}
              disabledDate={disabledDate}></RangePicker>
          </Form.Item>
          <Form.Item label='SEND ID' name='send_id' className='m-b-0'>
            <Input placeholder='请输入sendid' onPressEnter={search} />
          </Form.Item>
          <Form.Item label='手机号码' name='to' className='m-b-0'>
            <Input placeholder='请输入手机号码' onPressEnter={search} />
          </Form.Item>
          <Form.Item label='短信内容' name='content' className='m-b-0'>
            <Input placeholder='请输入短信内容' onPressEnter={search} />
          </Form.Item>
          <Form.Item label='' className='m-b-0'>
            <Button type='primary' htmlType='submit' onClick={search}>
              查询
            </Button>
          </Form.Item>
        </Flex>

        <Table
          loading={loading}
          className='theme-cell reset-table m-t-24'
          columns={columns}
          dataSource={tableData}
          rowKey='sendID'
          pagination={{
            defaultPageSize: limit,
            position: ['bottomRight'],
            current: page,
            pageSize: limit,
            showQuickJumper: true,
            pageSizeOptions: [10, 20, 50],
            total: total,
            showTotal: (total) => `共 ${total} 条`,
            onChange: changePageInfo,
          }}
          scroll={{ x: 'fit-content' }}
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
