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
} from 'antd'
import PageContent from '@/components/pageContent'
import { DownOutlined } from '@ant-design/icons'
import { Outlet, useNavigate } from 'react-router-dom'

import { getSendlists } from '@/api'
import { API } from 'apis'
import topIco from '@/assets/rcs/batchreport/batchreport_ico.png'
import './index.scss'

import { useSize, usePoint } from '@/hooks'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
const { Option } = Select

const { RangePicker } = DatePicker

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

export default function Fn() {
  const size = useSize()
  const point = usePoint('lg')

  const [currentPage, setcurrentPage] = useState<number>(1)
  const [pageSize, setpageSize] = useState<number>(40)
  const [total, setTotal] = useState<number>(0)
  const [getSendList, setGetSendList] = useState<API.GetSendlistsItems[]>()
  const [form] = Form.useForm()

  const nav = useNavigate()
  // 获取任务发送报告
  const getList = async () => {
    const fromValues = await form.getFieldsValue()
    const start =
      (fromValues.time && fromValues.time[0].format('YYYY-MM-DD')) || ''
    const end =
      (fromValues.time && fromValues.time[1].format('YYYY-MM-DD')) || ''
    let params = {
      start,
      end,
      keywords: fromValues.keywords,
      status: fromValues.status,
      order_by: fromValues.order_by,
      type: fromValues.type,
      page: currentPage,
      limit: pageSize,
    }
    const res = await getSendlists(params)
    setGetSendList(res.data)
    setTotal(res.rows)
    try {
    } catch (error) {
      console.log(error)
    }
  }

  const onRangeChange = (dates, dateStrings) => {}

  useEffect(() => {
    getList()
  }, [])

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
      dataIndex: 'project',
      key: 'project',
      width: 120,
    },
    {
      title: 'Chatbot名称',
      dataIndex: 'chatbot_name',
      width: 200,
    },
    {
      title: '联系人(数量)',
      dataIndex: 'address',
      width: 120,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (_, record) => (
        <span className='send-type'>
          {record.type == '1' ? '普通发送' : '定时发送'}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (_, record) => (
        <div className={statusStyle[record.status]}>
          {statusNum[record.status]}
        </div>
      ),
    },
    {
      title: '提交时间',
      dataIndex: 'send',
      width: 200,
    },
    {
      title: '完成日期',
      dataIndex: 'sent',
      width: 200,
    },
    {
      title: '操作',
      width: 160,
      className: 'paddingL20',
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
      label: '导出 CSV',
      key: '1',
    },

    {
      label: '导出 EXCEL',
      key: '2',
    },
  ]

  const edit = async (e) => {
    console.log(e)
  }
  const typeOptions = [
    {
      value: 'all',
      label: '所有类型',
    },
    {
      value: '1',
      label: '普通发送',
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

  const toDetail = (id) => {
    nav(`/console/rcs/batchreport/detail/${id}`)
  }
  return (
    <PageContent extClass='batchreport'>
      <Form
        form={form}
        className='batchreport-form'
        name='batchreport'
        layout='vertical'
        autoComplete='off'
        initialValues={{
          type: 'all',
          status: 'all',
          order_by: 'send',
          time: [dayjs().add(-1, 'd'), dayjs().add(0, 'd')],
        }}>
        <Image src={topIco} preview={false} width={72}></Image>
        <Flex
          justify='space-between'
          align='center'
          style={{ marginTop: '4px' }}>
          <div className='fn22 fw-500'>批量任务发送报告</div>

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
          <Col span={12} md={4} lg={3} xl={3}>
            <Form.Item
              label='任务类型'
              name='type'
              style={{ marginBottom: '0px' }}>
              <Select placeholder='全部类型' popupMatchSelectWidth={120}>
                {typeOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12} md={4} lg={3} xl={3}>
            <Form.Item
              label='发送状态'
              name='status'
              style={{ marginBottom: '0px' }}>
              <Select placeholder='全部标签' popupMatchSelectWidth={120}>
                {sendOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
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
                style={{ width: '240px' }}></RangePicker>
            </Form.Item>
          </Col>
          <Col span={24} md={4} xl={6}>
            <Form.Item
              label='搜索'
              name='keywords'
              style={{ marginBottom: '0px' }}>
              <Input placeholder='请输入关键词' />
            </Form.Item>
          </Col>
          <Col span={6} md={4} xl={3}>
            <Form.Item label=' ' style={{ marginBottom: '0px' }}>
              <Button
                type='primary'
                className='w-100'
                htmlType='submit'
                onClick={() => getList()}>
                查询
              </Button>
            </Form.Item>
          </Col>
          <Col span={12} md={4} xl={3} className='order-by fx-y-center'>
            <i className='icon iconfont icon-paixu color fn14 m-r-10'></i>
            <Form.Item
              name='order_by'
              label=' '
              style={{ marginBottom: '0px' }}>
              <Select
                placeholder='选择排序'
                popupMatchSelectWidth={120}
                suffixIcon={''}>
                {order.map((order) => (
                  <Option key={order.value} value={order.value}>
                    {order.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Table
          className='theme-cell reset-table'
          columns={columns}
          dataSource={getSendList}
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
      <Outlet />
    </PageContent>
  )
}
