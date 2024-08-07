import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Flex,
  Table,
  Button,
  Divider,
  Image,
  DatePicker,
  Form,
  Select,
  Input,
  Space,
} from 'antd'
import type { GetProps } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { usePoint } from '@/hooks'
import PageContent from '@/components/pageContent'
import { getChatbot, getHistory, exportRcsHistory } from '@/api'
import { API } from 'apis'
import faceImg from '@/assets/rcs/face/history.png'
import dayjs from 'dayjs'
import { getPresets } from '@/utils/day'
import { downloadFile } from '@/utils'
import type { ColumnsType } from 'antd/es/table'

import './index.scss'

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

type T = {
  id: string
}

// interface DataType extends API.GetHistoryItems {}
interface DataType extends T {}

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
        keyword: formValues.keyword,
      }

      const res = await getHistory(params)
      // setTableData(res.history)
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
      title: '任务名称',
      fixed: true,
      width: 160,
      className: 'paddingL20',
      render: (_, record) => (
        <div style={{ height: 40 }} className='fw-500'>
          名称
        </div>
      ),
    },
    {
      title: '话术名称',
      width: 260,
      className: 'tag-color',
      render: (_, record) => (
        <Space className='w-100' size={0}>
          话术名称
        </Space>
      ),
    },
    {
      title: '预设开始时间',
      dataIndex: 'send',
      width: 180,
    },
    {
      title: '预设结束时间',
      dataIndex: 'sent',
      width: 180,
    },
    {
      title: '号码量',
      width: 100,
      render: (_, record) => <div>200</div>,
    },
    {
      title: '呼叫量',
      width: 100,
      render: (_, record) => <div>200</div>,
    },
    {
      title: '接通量',
      width: 100,
      render: (_, record) => <div>200</div>,
    },
    {
      title: '接通率',
      width: 100,
      render: (_, record) => <div>90%</div>,
    },
    {
      title: '任务状态',
      width: 120,
      render: (_, record) => (
        <>
          <span className='send-type'>普通发送</span>
          {/* <span className='send-type type2'>定时发送</span> */}
        </>
      ),
    },
    {
      title: '操作',
      width: 180,
      render: (_, record) => (
        <>
          <Button type='link' style={{ paddingLeft: 0 }}>
            <NavLink to={`/console/voiceChatbot/call/detail/${record.id}/info`}>
              查看
            </NavLink>
          </Button>
        </>
      ),
    },
  ]

  return (
    <PageContent extClass='call-list' xxl={'90%'} xl={'100%'}>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center'>
        <div className='fn22 fw-500'>创建/管理外呼任务</div>
        <NavLink to='/console/voiceChatbot/call/create'>
          <Button
            type='primary'
            icon={<PlusOutlined className='fn14' rev={undefined} />}>
            创建外呼任务
          </Button>
        </NavLink>
      </Flex>
      <Divider />
      <Form
        form={form}
        name='call-list-form'
        layout='vertical'
        autoComplete='off'
        onValuesChange={onValuesChange}
        initialValues={{
          time: rangePresets[5].value,
        }}>
        <Flex align='flex-end' wrap='wrap' gap={16}>
          <Form.Item label='话术名称' name='chatbot' className='m-b-0'>
            <Select
              placeholder='全部话术'
              allowClear
              popupMatchSelectWidth={200}
              style={{ width: 200 }}
              options={[]}
              fieldNames={{ label: 'name', value: 'id' }}></Select>
          </Form.Item>
          <Form.Item label='任务状态' name='status' className='m-b-0'>
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
          <Form.Item label='任务名称' name='send_id' className='m-b-0'>
            <Input placeholder='请输入' onPressEnter={search} />
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
            onChange: changePageInfo,
          }}
          scroll={{ x: 'fit-content' }}
        />
      </Form>
    </PageContent>
  )
}
