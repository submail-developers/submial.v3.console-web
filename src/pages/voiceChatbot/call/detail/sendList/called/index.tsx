import { useState, useEffect } from 'react'
import {
  Flex,
  Table,
  Button,
  DatePicker,
  Form,
  Select,
  Input,
  Space,
} from 'antd'
import type { GetProps } from 'antd'
import { EyeOutlined } from '@ant-design/icons'
import { usePoint } from '@/hooks'
import { getChatbot, getHistory, exportRcsHistory } from '@/api'
import { API } from 'apis'
import dayjs from 'dayjs'
import { getPresets } from '@/utils/day'
import { downloadFile } from '@/utils'
import type { ColumnsType } from 'antd/es/table'

import Nav from '../../nav'
import SendNav from '../nav'

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>
type T = {
  id: string
}

// interface DataType extends API.GetHistoryItems {}
interface DataType extends T {}
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

export default function Fn() {
  const [form] = Form.useForm()
  const pointXs = usePoint('xs')
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const [tableData, setTableData] = useState<DataType[]>([
    {
      id: '123',
    },
  ])

  const getList = async () => {}

  // 除搜索关键字，其他字段改变直接搜索
  const onValuesChange = (changedValues, allValues) => {
    let changeKey = Object.keys(changedValues)[0]
    if (!['send_id', 'to', 'keyword'].includes(changeKey)) {
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
    getList()
  }, [limit, page])

  const columns: ColumnsType<DataType> = [
    {
      title: '手机号',
      fixed: true,
      width: 160,
      className: 'paddingL20',
      render: (_, record) => <div className='fw-500'>13112312332</div>,
    },
    {
      title: '外呼时间',
      width: 140,
      render: (_, record) => (
        <Space className='w-100' size={0}>
          2024-12-21 12:23:12
        </Space>
      ),
    },
    {
      title: '振铃时长',
      width: 100,
      className: 'success-color',
      render: (_, record) => (
        <Space>
          <span className='icon iconfont icon-calling fn14'></span>
          <span>00:08</span>
        </Space>
      ),
    },
    {
      title: '通话时长',
      width: 100,
      className: 'color',
      render: (_, record) => (
        <Space>
          <span className='icon iconfont icon-say fn14'></span>
          <span>00:08</span>
        </Space>
      ),
    },
    {
      title: '交互次数',
      width: 100,
      render: (_, record) => <div>200</div>,
    },
    {
      title: '挂机类型',
      width: 100,
      render: (_, record) => <div>用户挂机</div>,
    },
    {
      title: '挂机短信',
      width: 100,
      render: (_, record) => <div>无</div>,
    },
    {
      title: '意向度',
      width: 100,
      render: (_, record) => <div>A</div>,
    },
    {
      title: '对话详情',
      width: 180,
      render: (_, record) => (
        <>
          <Button
            type='link'
            style={{ paddingLeft: 0 }}
            icon={<span className='icon iconfont icon-xianshi fn13'></span>}>
            <span>查看对话详情</span>
          </Button>
        </>
      ),
    },
  ]
  return (
    <div>
      <Nav />
      <SendNav />
      <Form
        form={form}
        className='m-t-24'
        name='called-form'
        layout='vertical'
        autoComplete='off'
        onValuesChange={onValuesChange}
        initialValues={{
          time: rangePresets[5].value,
        }}>
        <Flex justify='space-between' align='flex-end' wrap='wrap' gap={16}>
          <Flex align='flex-end' wrap='wrap' gap={16}>
            <Form.Item label='挂机类型' name='chatbot' className='m-b-0'>
              <Select
                placeholder='全部类型'
                allowClear
                popupMatchSelectWidth={200}
                style={{ width: 200 }}
                options={[]}
                fieldNames={{ label: 'name', value: 'id' }}></Select>
            </Form.Item>
            <Form.Item label='意向度' name='chatbot' className='m-b-0'>
              <Select
                placeholder='全部意向度'
                allowClear
                popupMatchSelectWidth={200}
                style={{ width: 200 }}
                options={[]}
                fieldNames={{ label: 'name', value: 'id' }}></Select>
            </Form.Item>
            <Form.Item label='时间范围' name='time' className='m-b-0'>
              <RangePicker
                presets={!pointXs && rangePresets}
                allowClear={false}
                disabledDate={disabledDate}></RangePicker>
            </Form.Item>
            <Form.Item label='手机号' name='send_id' className='m-b-0'>
              <Input placeholder='请输入' onPressEnter={search} />
            </Form.Item>
            <Form.Item label='' className='m-b-0'>
              <Button type='primary' htmlType='submit' onClick={search}>
                查询
              </Button>
            </Form.Item>
          </Flex>
          <Form.Item label='' className='m-b-0'>
            <Button type='primary' htmlType='submit' onClick={search}>
              导出已外呼号码
            </Button>
          </Form.Item>
        </Flex>
      </Form>

      <Table
        loading={loading}
        className='theme-cell reset-table m-t-24'
        columns={columns}
        dataSource={tableData}
        rowKey='id'
        pagination={{
          defaultPageSize: limit,
          position: ['bottomRight'],
          current: page,
          pageSize: limit,
          showQuickJumper: true,
          pageSizeOptions: [10, 20, 50],
          total: total,
          showTotal: (total) => `共 ${total} 条`,
          onChange: () => {},
        }}
        scroll={{ x: 'fit-content' }}
      />
    </div>
  )
}
