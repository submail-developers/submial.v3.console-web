import { useState, useEffect } from 'react'
import { useSize, usePoint } from '@/hooks'
import { Outlet, useNavigate } from 'react-router-dom'
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
} from 'antd'
import type { GetProps } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

import PageContent from '@/components/pageContent'
import ACopy from '@/components/aCopy'
import { getPresets } from '@/utils/day'

import { getSendlists } from '@/api'
import { API } from 'apis'

import topIco from '@/assets/rcs/batchreport/batchreport_ico.png'

import './index.scss'

const { Option } = Select

const { RangePicker } = DatePicker
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

enum statusNum {
  '发送完成' = 1,
  '尚未开始' = 0,
  '已撤销' = 9,
}
enum statusStyle {
  'success-color' = 1,
  'text-color' = 0,
  'error-colo' = 9,
}

const items = [
  {
    label: '导出 CSV',
    key: '1',
  },

  {
    label: '导出 EXCEL',
    key: '2',
  },
]

const typeOptions = [
  {
    value: 'all',
    label: '所有类型',
  },
  {
    value: '1',
    label: '即时发送',
  },
  {
    value: '2',
    label: '定时发送',
  },
]
const sendOptions = [
  {
    value: 'all',
    label: '全部状态',
  },
  {
    value: '1',
    label: '发送完成',
  },
  {
    value: '0',
    label: '尚未开始',
  },
  {
    value: '9',
    label: '已撤销',
  },
]
const order = [
  { label: '提交日期', value: 'send' },
  { label: '完成日期', value: 'sent' },
]
// 只允许选择15天前-今天的日期
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  const today = dayjs()
  const fifteenDaysAgo = today.subtract(90, 'day')
  const currentDate = dayjs(current)
  return currentDate.isBefore(fifteenDaysAgo) || currentDate.isAfter(today)
}
// 预设日期
const rangePresets = getPresets([3, 7, 15, 30, 90])

export default function Fn() {
  const size = useSize()
  const pointXs = usePoint('xs')
  const nav = useNavigate()

  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const [getSendList, setGetSendList] = useState<API.GetSendlistsItems[]>()
  const [form] = Form.useForm()

  // 获取任务发送报告
  const getList = async () => {
    setLoading(true)
    try {
      const fromValues = await form.getFieldsValue()
      const start = fromValues.time[0].format('YYYY-MM-DD')
      const end = fromValues.time[1].format('YYYY-MM-DD')
      let params = {
        start,
        end,
        keywords: fromValues.keywords,
        status: fromValues.status,
        order_by: fromValues.order_by,
        type: fromValues.type,
        page: page,
        limit: limit,
      }
      const res = await getSendlists(params)
      setGetSendList(res.data)
      setTotal(res.rows)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const onRangeChange = (dates, dateStrings) => {
    form.setFieldValue('time', dates)
  }

  const changePageInfo = (page, pageSize) => {
    setPage(page)
    setLimit(pageSize)
  }

  // 除搜索关键字，其他字段改变直接搜索
  const onValuesChange = (changedValues, allValues) => {
    if (!('keywords' in changedValues)) {
      if (page == 1) {
        getList()
      } else {
        setPage(1)
      }
    }
  }

  // 导出
  const exportEvent = async (e) => {
    console.log(e)
  }

  // 查看详情
  const toDetail = (id) => {
    nav(`/console/rcs/batchreport/detail/${id}`)
  }

  useEffect(() => {
    getList()
  }, [limit, page])

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'title',
      fixed: true,
      width: size == 'small' ? 150 : 200,
      className: size == 'small' ? 'paddingL20' : 'paddingL30',
    },
    {
      title: '模板ID',
      width: 100,
      render: (_, record) => (
        <div className='w-100' style={{ position: 'relative' }}>
          <ACopy text={record.project} />
          {record.project}
        </div>
      ),
    },
    {
      title: 'Chatbot名称',
      width: 160,
      render: (_, record) => (
        <div
          className='g-ellipsis'
          style={{ width: 150 }}
          title={record.chatbot_name}>
          {record.chatbot_name}
        </div>
      ),
    },
    {
      title: '联系人(数量)',
      dataIndex: 'address',
      width: 110,
      render: (_, record) => (
        <span>{Number(record.address).toLocaleString()}</span>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 120,
      render: (_, record) => (
        <span className={`send-type ${record.type == '1' ? '' : 'type2'}`}>
          {record.type == '1' ? '普通发送' : '定时发送'}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (_, record) => (
        <div className={statusStyle[record.status]}>
          {statusNum[record.status]}
        </div>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'send',
      width: 180,
    },
    {
      title: '完成日期',
      dataIndex: 'sent',
      width: 180,
    },
    {
      title: '操作',
      width: 100,
      render: (_, record) => (
        <>
          <span>
            <Button
              type='link'
              style={{ paddingLeft: 0 }}
              onClick={() => toDetail(record.id)}>
              查看
            </Button>
          </span>
        </>
      ),
    },
  ]

  return (
    <PageContent extClass='batchreport' xxl={1300}>
      <Image src={topIco} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center' style={{ marginTop: '4px' }}>
        <div className='fn22 fw-500'>批量任务发送报告</div>

        <Dropdown
          className='export'
          menu={{ items, selectable: true, onClick: exportEvent }}
          trigger={['click']}>
          <Button type='primary' style={{ width: 120 }}>
            <Flex align='center' justify='space-around'>
              <span>导出</span>
              <DownOutlined rev={null} />
            </Flex>
          </Button>
        </Dropdown>
      </Flex>
      <Divider className='line'></Divider>
      <Form
        form={form}
        className='batchreport-form'
        name='batchreport'
        layout='vertical'
        autoComplete='off'
        onValuesChange={onValuesChange}
        initialValues={{
          type: 'all',
          status: 'all',
          order_by: 'send',
          time: rangePresets[4].value,
        }}>
        <Flex align='flex-end' wrap='wrap' gap={16}>
          <Form.Item label='任务类型' name='type' className='m-b-0'>
            <Select
              placeholder=''
              popupMatchSelectWidth={120}
              style={{ width: 120 }}
              options={typeOptions}></Select>
          </Form.Item>
          <Form.Item label='发送状态' name='status' className='m-b-0'>
            <Select
              placeholder=''
              popupMatchSelectWidth={120}
              style={{ width: 120 }}
              options={sendOptions}></Select>
          </Form.Item>
          <Form.Item name='order_by' label='排序' className='m-b-0'>
            <Select
              placeholder='选择排序'
              popupMatchSelectWidth={120}
              style={{ width: 120 }}
              suffixIcon={
                <i className='icon iconfont icon-paixu color fn14'></i>
              }
              options={order}></Select>
          </Form.Item>
          <Form.Item name='time' label='时间范围' className='m-b-0'>
            <RangePicker
              presets={!pointXs && rangePresets}
              allowClear={false}
              disabledDate={disabledDate}
              onChange={onRangeChange}
            />
          </Form.Item>
          <Form.Item
            label='搜索'
            name='keywords'
            style={{ marginBottom: '0px' }}>
            <Input placeholder='请输入关键词' onPressEnter={getList} />
          </Form.Item>
          <Form.Item label='' className='m-b-0'>
            <Button
              type='primary'
              className='w-100'
              htmlType='submit'
              onClick={getList}>
              查询
            </Button>
          </Form.Item>
        </Flex>

        <Table
          loading={loading}
          className='theme-cell reset-table m-t-24'
          columns={columns}
          dataSource={getSendList}
          rowKey={'id'}
          sticky
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
      <Outlet />
    </PageContent>
  )
}
