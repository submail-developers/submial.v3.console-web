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
  Divider,
  Image,
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
import PageContent from '@/components/pageContent'
import faceImg from '@/assets/rcs/face/history.png'

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
      render: (_, record) => (
        <div className='fw-500 fx-y-center' style={{ height: 40 }}>
          13112312332
        </div>
      ),
    },
    {
      title: '话术名称',
      width: 160,
      className: 'tag-color',
      render: (_, record) => (
        <Space className='w-100' size={0}>
          话术名称
        </Space>
      ),
    },
    {
      title: '线路',
      width: 100,
      render: (_, record) => <div>00:08</div>,
    },
    {
      title: '外呼时间',
      width: 180,
      render: (_, record) => <div>2025-12-12 12:00:08</div>,
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
      title: '类型',
      width: 100,
      render: (_, record) => <div>用户挂机</div>,
    },
    {
      title: '余额变动',
      width: 100,
      render: (_, record) => <div>无</div>,
    },
  ]
  return (
    <PageContent>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center'>
        <div className='fn22 fw-500'>计费日志</div>
      </Flex>
      <Divider />
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
        <Flex align='flex-end' wrap='wrap' gap={16}>
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
    </PageContent>
  )
}
