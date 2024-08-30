import { useState, useEffect, useCallback, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import {
  Flex,
  Table,
  Button,
  DatePicker,
  Form,
  Select,
  Input,
  Space,
  Tag,
} from 'antd'
import type { GetProps, MenuProps } from 'antd'
import { usePoint } from '@/hooks'
import { getVCTaskCalledList, exportVCTaskCalledList } from '@/api'
import { API } from 'apis'
import dayjs, { Dayjs } from 'dayjs'
import type { ColumnsType } from 'antd/es/table'
import { useStateStore } from '../../reducer'
import ACopy from '@/components/aCopy'
import { IDIcon } from '@/components/aIcons'
import DetailModal from './modal'
import AExport from '@/components/aExport'
import { downloadFile } from '@/utils'

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

interface DataType extends API.GetVCTaskCalledListItem {}
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

// 0成功, 1无法接通, 2机器人挂机, 3用户主动挂机, 4呼叫失败, 5关机, 6空号, 7无人接听, 8停机, 9正在通话中, 10无法接听, 11用户拒接, 12超时, 13线路超频
const typeText = {
  '0': '外呼成功',
  '1': '无法接通',
  '2': '机器人挂机',
  '3': '用户主动挂机',
  '4': '呼叫失败',
  '5': '关机',
  '6': '空号',
  '7': '无人接听',
  '8': '停机',
  '9': '正在通话中',
  '10': '无法接听',
  '11': '用户拒接',
  '12': '超时',
  '13': '线路超频',
}

const typeOptions = [
  {
    label: '全部类型',
    value: 'all',
  },
  {
    label: '外呼成功',
    value: '0',
  },
  {
    label: '无法接通',
    value: '1',
  },
  {
    label: '机器人挂机',
    value: '2',
  },
  {
    label: '用户主动挂机',
    value: '3',
  },
  {
    label: '呼叫失败',
    value: '4',
  },
  {
    label: '关机',
    value: '5',
  },
  {
    label: '空号',
    value: '6',
  },
  {
    label: '无人接听',
    value: '7',
  },
  {
    label: '停机',
    value: '8',
  },
  {
    label: '正在通话中',
    value: '9',
  },
  {
    label: '无法接听',
    value: '10',
  },
  {
    label: '用户拒接',
    value: '11',
  },
  {
    label: '超时',
    value: '12',
  },
  {
    label: '线路超频',
    value: '13',
  },
]

const gradeOtions = [
  {
    label: '全部意向度',
    value: 'all',
  },
  {
    label: 'A类客户',
    value: 'A',
  },
  {
    label: 'B类客户',
    value: 'B',
  },
  {
    label: 'C类客户',
    value: 'C',
  },
  {
    label: 'D类客户',
    value: 'D',
  },
]

const items: MenuProps['items'] = [
  { label: '导出 TXT', key: 'txt' },
  { label: '导出 CSV', key: 'csv' },
  { label: '导出 EXCEL', key: 'excel' },
  { label: '导出 JSON', key: 'json' },
  { label: '导出 XML', key: 'xml' },
]

export default function Fn() {
  const store = useStateStore()
  const { id } = useParams()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const [tableData, setTableData] = useState<DataType[]>([])
  const [lifeTime, setLifeTime] = useState<[Dayjs, Dayjs]>([null, null]) // 暂存时间范围

  const [open, setOpen] = useState(false)
  const [item, setItem] = useState<DataType>()

  const onShow = (record: DataType) => {
    setItem(record)
    setOpen(true)
  }

  const onHide = () => {
    setOpen(false)
    setItem(null)
  }

  // 可选时间范围
  const disabledDate: RangePickerProps['disabledDate'] = useMemo(() => {
    return (current) => {
      const currentDate = dayjs(current)
      // const today = dayjs()
      return (
        currentDate.isBefore(lifeTime[0]) || currentDate.isAfter(lifeTime[1])
        // || currentDate.isAfter(today)
      )
    }
  }, [lifeTime])

  const getList = async () => {
    setLoading(true)
    try {
      const {
        result = '',
        intention = '',
        times = [],
        keywords,
      } = await form.getFieldsValue()
      const start = times[0]?.format('YYYY-MM-DD') || ''
      const end = times[1]?.format('YYYY-MM-DD') || ''
      const res = await getVCTaskCalledList({
        start,
        end,
        result,
        intention,
        keywords,
        page,
        limit,
        sendlist: id,
      })
      if (res.status == 'success') {
        setTableData(
          res.list.map((item) => {
            item.ring_duration = formatMilliseconds(
              Number(item.ring_duration || 0),
              'S',
            )
            item.call_duration = formatMilliseconds(
              Number(item.call_duration || 0),
              's',
            )
            return item
          }),
        )
        setTotal(res.row)
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
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

  // 导出
  const exportEvent = async (file_type) => {
    const { times, result, intention, keywords } = await form.getFieldsValue()
    const start = times[0].format('YYYY-MM-DD')
    const end = times[1].format('YYYY-MM-DD')
    const res = await exportVCTaskCalledList({
      type: file_type,
      sendlist: id,
      result,
      intention,
      keywords,
      start,
      end,
    })
    if (res.status == 'success') {
      downloadFile()
    }
  }

  useEffect(() => {
    if (store.detail && form) {
      const lifeDay: [Dayjs, Dayjs] = [
        dayjs(dayjs(store.detail.life_start).format('YYYY-MM-DD')),
        dayjs(dayjs(store.detail.life_end).format('YYYY-MM-DD')),
      ]
      setLifeTime(lifeDay)
      form.setFieldValue('times', lifeDay)
      getList()
    }
  }, [limit, page, store.detail, form])

  const columns: ColumnsType<DataType> = [
    {
      title: '手机号',
      fixed: true,
      width: 160,
      className: 'paddingL20',
      render: (_, record) => <div className='fw-500'>{record.to}</div>,
    },
    {
      title: '外呼时间',
      width: 160,
      dataIndex: 'send',
    },
    {
      title: '振铃时长',
      width: 100,
      className: 'success-color',
      render: (_, record) => (
        <Space>
          <span className='icon iconfont icon-calling fn14'></span>
          <span>{record.ring_duration}</span>
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
          <span>{record.call_duration}</span>
        </Space>
      ),
    },
    {
      title: '交互次数',
      width: 100,
      render: (_, record) => <div>{record.traces_num || ''}</div>,
    },
    {
      title: '外呼结果',
      width: 100,
      render: (_, record) => (
        <div
          className={`${
            record.call_result == '0' ? 'success-color' : 'error-color'
          }`}>
          {record.call_result_desc}
        </div>
      ),
    },
    {
      title: (
        <div style={{ position: 'relative' }}>
          挂机短信
          {store.detail?.smsTemplate && (
            <>
              【{store.detail.smsTemplate}】
              <ACopy text={store.detail.smsTemplate} />
            </>
          )}
        </div>
      ),
      width: 120,
      render: (_, record) => (
        <div>
          {store.detail?.smsTemplate ? (
            <span>{record.hangup_sms == '1' ? '已下发' : '未下发'}</span>
          ) : (
            '未配置'
          )}
        </div>
      ),
    },
    {
      title: '意向度',
      width: 100,
      render: (_, record) => <div>{record.intention}</div>,
    },
    {
      title: '对话详情',
      width: 180,
      render: (_, record) => (
        <>
          <Button
            type='link'
            style={{ paddingLeft: 0 }}
            onClick={() => onShow(record)}
            icon={<span className='icon iconfont icon-xianshi fn13'></span>}>
            <span>查看</span>
          </Button>
        </>
      ),
    },
  ]
  return (
    <div>
      <Form
        form={form}
        className='m-t-24'
        name='called-form'
        layout='vertical'
        autoComplete='off'
        onValuesChange={onValuesChange}>
        <Flex justify='space-between' align='flex-end' wrap='wrap' gap={16}>
          <Flex align='flex-end' wrap='wrap' gap={16}>
            <Form.Item label='外呼结果' name='result' className='m-b-0'>
              <Select
                placeholder='全部类型'
                allowClear
                popupMatchSelectWidth={200}
                style={{ width: 200 }}
                options={typeOptions}></Select>
            </Form.Item>
            <Form.Item label='意向度' name='intention' className='m-b-0'>
              <Select
                placeholder='全部意向度'
                allowClear
                popupMatchSelectWidth={200}
                style={{ width: 200 }}
                options={gradeOtions}></Select>
            </Form.Item>
            <Form.Item label='时间范围' name='times' className='m-b-0'>
              <RangePicker
                // presets={!pointXs && rangePresets}
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
          <Form.Item label='' className='m-b-0'>
            <AExport
              items={items}
              onExportEvent={exportEvent}
              useCode={false}
            />
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
          onChange: () => {},
        }}
        scroll={{ x: 'fit-content' }}
      />

      <DetailModal open={open} onCancel={onHide} item={item} />
    </div>
  )
}
