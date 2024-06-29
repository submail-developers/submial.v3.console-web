import { useState, useEffect } from 'react'
import {
  Flex,
  Table,
  Divider,
  Image,
  DatePicker,
  Form,
  Input,
  Button,
} from 'antd'
import type { GetProps } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import PageContent from '@/components/pageContent'

import { API } from 'apis'
import { getRcsFeeLogs } from '@/api'
import faceImg from '@/assets/rcs/face/fee.png'
import { usePoint } from '@/hooks'
import { getPresets } from '@/utils/day'
import dayjs from 'dayjs'

import './index.scss'

enum Status {
  '等待',
  '扣费',
  '失败',
  '撤回',
}
enum StatusColor {
  'gray-color',
  'success-color',
  'error-color',
  'warning-color',
}

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

interface DataType extends API.RcsFeeLogItem {}
const { RangePicker } = DatePicker
const rangePresets = getPresets([0, 1, 7, 15, 30, 90])
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
  const [list, setList] = useState<DataType[]>()

  // 获取错误日志
  const getList = async () => {
    setLoading(true)
    try {
      const formValues = await form.getFieldsValue()
      const start = formValues.time[0].format('YYYY-MM-DD')
      const end = formValues.time[1].format('YYYY-MM-DD')
      const res = await getRcsFeeLogs({
        start,
        end,
        page: page,
        limit: limit,
        to: formValues.to,
        send_id: formValues.send_id,
      })
      setList(res.list)
      setTotal(res.row)
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
    let changeKey = Object.keys(changedValues)[0]
    if (!['send_id', 'to'].includes(changeKey)) {
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
      title: '日期',
      width: 200,
      className: 'paddingL20',
      render: (_, record) => (
        <div style={{ height: 40 }} className='fx-y-center'>
          {record.send}
        </div>
      ),
    },
    {
      title: 'API',
      dataIndex: 'api',
      width: 120,
    },
    {
      title: 'Send ID',
      dataIndex: 'sendID',
      width: 120,
    },
    {
      title: '手机号',
      dataIndex: 'to',
      className: 'paddingL20',
      width: 140,
    },
    {
      title: '类型',
      width: 100,
      render: (_, record) => (
        <div className={StatusColor[record.status]}>
          {Status[record.status]}
        </div>
      ),
    },
    {
      title: '余额变动',
      width: 100,
      render: (_, record) => <div>{record.status == '1' ? '-1' : '0'}</div>,
    },
  ]

  return (
    <PageContent extClass='fee-log'>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center' style={{ height: 40 }}>
        <div className='fn22 fw-500'>消费日志</div>
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
          time: rangePresets[0].value,
        }}>
        <Flex align='flex-end' wrap='wrap' gap={16}>
          <Form.Item label='时间范围' name='time' className='m-b-0'>
            <RangePicker
              presets={!pointXs && rangePresets}
              allowClear={false}
              disabledDate={disabledDate}></RangePicker>
          </Form.Item>
          <Form.Item label='Send ID' name='send_id' className='m-b-0'>
            <Input placeholder='请输入' />
          </Form.Item>
          <Form.Item label='手机号' name='to' className='m-b-0'>
            <Input placeholder='请输入' />
          </Form.Item>
          <Form.Item label='' className='m-b-0'>
            <Button type='primary' htmlType='submit' onClick={search}>
              搜索
            </Button>
          </Form.Item>
        </Flex>
        <Table
          loading={loading}
          className='theme-cell reset-table m-t-24'
          columns={columns}
          dataSource={list}
          rowKey={'sendID'}
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
