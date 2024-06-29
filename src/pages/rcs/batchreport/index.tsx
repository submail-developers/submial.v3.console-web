import { useState, useEffect } from 'react'
import { useSize, usePoint } from '@/hooks'
import { Outlet, useNavigate } from 'react-router-dom'
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
  Input,
} from 'antd'
import type { GetProps } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

import PageContent from '@/components/pageContent'
import ACopy from '@/components/aCopy'
import { getPresets } from '@/utils/day'

import { getSendlists } from '@/api'
import { API } from 'apis'

import faceImg from '@/assets/rcs/face/batchreport.png'

import './index.scss'

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

// 可选范围【无-今天】
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  const today = dayjs()
  // const fifteenDaysAgo = today.subtract(90, 'day')
  const currentDate = dayjs(current)
  // return currentDate.isBefore(fifteenDaysAgo) || currentDate.isAfter(today)
  return currentDate.isAfter(today)
}
// 预设日期
const rangePresets = getPresets([0, 1, 3, 7, 15])

export default function Fn() {
  const size = useSize()
  const pointXs = usePoint('xs')
  const nav = useNavigate()

  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const [tableData, setTableData] = useState<API.GetSendlistsItems[]>()
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
      setTableData(res.data)
      setTotal(res.rows)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
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

  const search = () => {
    setLoading(true)
    if (page == 1) {
      getList()
    } else {
      setPage(1)
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
      width: size == 'small' ? 170 : 220,
      className: size == 'small' ? 'paddingL20' : 'paddingL30',
      render: (_, record) => (
        <div className='w-100 p-r-16 g-ellipsis-2' title={record.title}>
          {record.title}
        </div>
      ),
    },
    {
      title: '模板ID',
      width: 120,
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
    <PageContent extClass='batchreport'>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center'>
        <div className='fn22 fw-500'>批量任务发送报告</div>
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
      <Divider />
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
          time: rangePresets[2].value, // 默认获取最近三天的数据
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
            />
          </Form.Item>
          <Form.Item
            label='搜索'
            name='keywords'
            style={{ marginBottom: '0px' }}>
            <Input placeholder='请输入关键词' onPressEnter={search} />
          </Form.Item>
          <Form.Item label='' className='m-b-0'>
            <Button
              type='primary'
              className='w-100'
              htmlType='submit'
              onClick={search}>
              查询
            </Button>
          </Form.Item>
        </Flex>

        <Table
          loading={loading}
          className='theme-cell reset-table m-t-24'
          columns={columns}
          dataSource={tableData}
          rowKey={'id'}
          sticky
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
      <Outlet />
    </PageContent>
  )
}
