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

// import { getErrorLogs } from '@/api'
import { API } from 'apis'
import topIco from '@/assets/rcs/batchreport/batchreport_ico.png'
import './index.scss'

import { useSize, usePoint } from '@/hooks'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
const { Option } = Select

const { RangePicker } = DatePicker

export default function Fn() {
  const size = useSize()
  const point = usePoint('lg')

  const [form] = Form.useForm()
  const [getErrorList, setGetErrorList] = useState()
  const nav = useNavigate()
  // 获取错误日志
  // const getList = async () => {
  //   const res = await getErrorLogs({
  //     page: 1,
  //     start: '2022-05-20',
  //     end: '2024-05-22',
  //   })
  // }

  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      console.log('From: ', dates[0], ', to: ', dates[1])
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
    } else {
      console.log('Clear')
    }
  }

  useEffect(() => {
    // getList()
  }, [])

  const dataSource = [
    {
      key: '1',
      name: '【4399游戏盒】',
      tempId: 'UG1233',
      chatname: '演示文字',
      person: '李三',
      type: '及时',
      status: '发送完成',
      snedtime: '2023-03-12 17:00',
      date: '2023-03-12 17:00',
    },
  ]

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
      fixed: true,
      width: size == 'small' ? 150 : 200,
      className: size == 'small' ? 'paddingL20' : 'paddingL30',
    },
    {
      title: '模板ID',
      dataIndex: 'tempId',
      key: 'tempId',
      width: 120,
    },
    {
      title: 'ChatBot名称',
      dataIndex: 'chatname',
      key: 'chatname',
      width: 200,
    },
    {
      title: '联系人',
      dataIndex: 'person',
      key: 'person',
      width: 200,
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
    },
    {
      title: '提交时间',
      dataIndex: 'snedtime',
      key: 'snedtime',
      width: 200,
    },
    {
      title: '完成日期',
      dataIndex: 'date',
      key: 'date',
      width: 200,
    },
    {
      title: '操作',
      width: 160,
      className: 'paddingL20',
      render: (_, record) => (
        <>
          <span>
            <Button type='link' style={{ paddingLeft: 0 }} onClick={toDetail}>
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
      label: '即时发送',
    },
    {
      value: '2',
      label: '定时任务',
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

  const toDetail = () => {
    nav('/console/rcs/batchreport/detail/111')
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
          sendStatus: 'all',
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
          <Col span={8} md={4} lg={3} xl={3}>
            <Form.Item
              label='任务类型'
              name='type'
              style={{ marginBottom: '0px' }}>
              <Select placeholder='所有标签' popupMatchSelectWidth={120}>
                {typeOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} md={4} lg={3} xl={3}>
            <Form.Item
              label='发送状态'
              name='sendStatus'
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
          <Col span={8} md={8} lg={6} xl={5}>
            <Form.Item
              label='时间范围'
              name='time'
              style={{ marginBottom: '0px' }}>
              <RangePicker
                size={size}
                clearIcon={false}
                presets={rangePresets}
                onChange={onRangeChange}
                style={{ width: size == 'small' ? 190 : 240 }}></RangePicker>
            </Form.Item>
          </Col>
          <Col span={6} md={4} xl={6} className='m-l-6'>
            <Form.Item label='搜索' style={{ marginBottom: '0px' }}>
              <Input placeholder='请输入关键词' />
            </Form.Item>
          </Col>
          <Col span={6} md={4} xl={3}>
            <Form.Item label=' ' style={{ marginBottom: '0px' }}>
              <Button
                type='primary'
                style={{ width: '120px' }}
                // onClick={() => getList()}
              >
                查询
              </Button>
            </Form.Item>
          </Col>
          <Col span={6} md={4} xl={3} className='order-by fx-y-center'>
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
          dataSource={dataSource}
          rowKey={'key'}
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
