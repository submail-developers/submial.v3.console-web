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
import { useNavigate } from 'react-router-dom'
import { EyeOutlined } from '@ant-design/icons'
import { usePoint } from '@/hooks'
import { getChatbot, getHistory, getVCFeeList } from '@/api'
import { API } from 'apis'
import dayjs from 'dayjs'
import { getPresets } from '@/utils/day'
import { downloadFile } from '@/utils'
import type { ColumnsType } from 'antd/es/table'
import PageContent from '@/components/pageContent'
import faceImg from '@/assets/rcs/face/history.png'
import './index.scss'

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

interface DataType extends API.GetVCFeeListitem {}
const { RangePicker } = DatePicker

// 毫秒数/秒数转为 mm:ss 格式 type:S毫秒，s秒
const formatMilliseconds = (ms: number, type: 's' | 'S'): string => {
  const totalSeconds = type == 'S' ? Math.floor(ms / 1000) : ms
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  // 格式化为两位数
  const formattedMinutes = minutes.toString().padStart(2, '0')
  const formattedSeconds = seconds.toString().padStart(2, '0')

  return `${formattedMinutes}:${formattedSeconds}`
}

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
  const [tableData, setTableData] = useState<DataType[]>([])

  const getList = async () => {
    try {
      setLoading(true)
      const { keywords, time } = await form.getFieldsValue()

      const res = await getVCFeeList({
        page,
        limit,
        start: dayjs(time[0]).format('YYYY-MM-DD'),
        end: dayjs(time[1]).format('YYYY-MM-DD'),
        keywords,
      })
      setTableData(
        res.list.map((item) => {
          item.call_duration = formatMilliseconds(
            Number(item.call_duration),
            's',
          )
          return item
        }),
      )
      setTotal(res.row)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  // 除搜索关键字，其他字段改变直接搜索
  const onValuesChange = (changedValues, allValues) => {
    let changeKey = Object.keys(changedValues)[0]
    if (!['keywords'].includes(changeKey)) {
      if (page == 1) {
        getList()
      } else {
        setPage(1)
      }
    }
  }

  const search = () => {
    if (page == 1) {
      getList()
    } else {
      setPage(1)
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
          {record.to}
        </div>
      ),
    },
    {
      title: '任务名称',
      width: 160,
      className: 'tag-color',
      render: (_, record) => (
        <a
          href={`/console/voiceChatbot/call/detail/${record.sendlist}/info`}
          className='tag-color g-pointer'
          target='_blank'>
          {record.task_title}
        </a>
      ),
    },
    {
      title: '话术名称',
      width: 160,
      className: 'tag-color',
      render: (_, record) => (
        <a
          href={`/console/voiceChatbot/talk/edit/${record.SpeechSkillId}/0`}
          className='tag-color g-pointer'
          target='_blank'>
          {record.SpeechSkill_name}
        </a>
      ),
    },
    {
      title: '外呼时间',
      width: 180,
      dataIndex: 'send',
    },
    {
      title: '通话时长',
      width: 100,
      className: 'color',
      render: (_, record) => (
        <Space>
          <span className='icon iconfont icon-say fn14'></span>
          <span>{record.call_duration}</span>
        </Space>
      ),
    },
    {
      title: '类型',
      width: 100,
      render: (_, record) => <div>{record.call_result_desc || '-'}</div>,
    },
    {
      title: '余额变动',
      width: 100,
      render: (_, record) => (
        <div>
          {record.status == '0' || (record.status == null && '-')}
          {record.status == '1' &&
            `-${(Number(record.fee) * Number(record.count)).toFixed(4)}`}
          {record.status == '2' && `0`}
          {record.status == '3' &&
            `+${(Number(record.fee) * Number(record.count)).toFixed(4)}`}
        </div>
      ),
    },
  ]
  return (
    <PageContent extClass='vc-fee'>
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
          <Form.Item label='手机号' name='keywords' className='m-b-0'>
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
    </PageContent>
  )
}
