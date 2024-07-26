import { useState, useEffect } from 'react'
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
  Tooltip,
  Space,
} from 'antd'
import type { GetProps } from 'antd'
import { usePoint } from '@/hooks'
import AExport from '@/components/aExport'
import { useAppSelector } from '@/store/hook'
import { settingRcs } from '@/store/reducers/settingRcs'
import PageContent from '@/components/pageContent'
import ACopy from '@/components/aCopy'
import { getChatbot, getHistory, exportRcsHistory } from '@/api'
import { API } from 'apis'
import faceImg from '@/assets/rcs/face/history.png'
import dayjs from 'dayjs'
import { getPresets } from '@/utils/day'
import { downloadFile } from '@/utils'
import SeeModal from '@/pages/rcs/template/seeModal'
import type { ColumnsType } from 'antd/es/table'

import './index.scss'

enum statusNum {
  '等待',
  '成功',
  '失败',
  '撤回',
}
enum statusStyle {
  'gray-color',
  'success-color',
  'error-color',
  'warning-color',
}
enum SendTypeEnum {
  '5G消息',
  '回落为短信',
  '回落为彩信',
}

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

const items = [
  {
    label: '导出 TXT (仅手机号码)',
    key: 'txt',
  },
  {
    label: '导出 CSV',
    key: 'csv',
  },

  {
    label: '导出 EXCEL',
    key: 'excel',
  },
  {
    label: '导出 JSON',
    key: 'json',
  },

  {
    label: '导出 XML',
    key: 'xml',
  },
]

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

interface DataType extends API.GetHistoryItems {}

export default function Fn() {
  const rcsSetting = useAppSelector(settingRcs)
  const [form] = Form.useForm()
  const pointXs = usePoint('xs')
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const [tableData, setTableData] = useState<DataType[]>([])
  const [chatBotList, setChatBotList] = useState<API.ChatbotItem[]>([])
  // 获取chatbot
  const getChatbotList = async () => {
    try {
      const res = await getChatbot({
        page: 1,
        limit: 10000,
        appid: '',
        keywords: '',
        status: '1',
      })
      setChatBotList(
        res.list.map((item) => {
          item.name = `${item.name}(${item.id})`
          return item
        }),
      )
    } catch (error) {}
  }

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
      setTableData(res.history)
      setTotal(res.row)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  // 导出
  const exportEvent = async (type) => {
    const {
      appid = 'all',
      status,
      send_id,
      to,
      keyword,
      time,
    } = await form.getFieldsValue()
    const start = time[0].format('YYYY-MM-DD')
    const end = time[1].format('YYYY-MM-DD')
    const res = await exportRcsHistory({
      type,
      start,
      end,
      appid,
      status,
      send_id,
      to,
      keyword,
    })
    if (res.status == 'success') {
      downloadFile()
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
    getChatbotList()
  }, [])

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
        <Space style={{ height: 40 }} className='fx-y-center'>
          <span>{record.to}</span>
          <Tooltip
            title={
              <>
                {record.mobileType}
                {record.mobileArea
                  ? `/${record.mobileArea.split(' ').join(' ')}`
                  : '-'}
              </>
            }
            placement='bottom'
            trigger={['hover', 'click']}>
            <span className='icon iconfont icon-gps gray-color-sub'></span>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: '模板',
      width: 260,
      render: (_, record) => (
        <Space className='w-100' size={0}>
          <div style={{ position: 'relative', minWidth: 80 }}>
            <ACopy text={record.sign} />【{record.sign}】
          </div>
          <SeeModal message={record.message} sign={record.sign}>
            <div className='g-ellipsis' style={{ maxWidth: 160 }}>
              {record.template_name}
            </div>
          </SeeModal>
        </Space>
      ),
    },
    {
      title: '发送时间',
      dataIndex: 'send',
      width: 180,
    },
    {
      title: '送达时间',
      dataIndex: 'sent',
      width: 180,
    },
    {
      title: '送达状态',
      dataIndex: 'status',
      width: 180,
      render: (_, record) => (
        <div className={statusStyle[record.status]}>
          {statusNum[record.status]}
          {record.status == '1' && <> ({SendTypeEnum[record.sentType]})</>}
          {record.status == '2' && <>({record.message_resp})</>}
        </div>
      ),
    },
    {
      title: '计费',
      width: 100,
      className: 'paddingL20',
      render: (_, record) => <div>{record.status == '1' ? '1' : '0'}</div>,
    },
  ]

  return (
    <PageContent extClass='api-history' xl={'100%'} xxl={'90%'}>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center'>
        <div className='fn22 fw-500'>API历史明细</div>

        <AExport
          items={items}
          onExportEvent={exportEvent}
          useCode={rcsSetting?.settings?.export_confrim == '1'}
        />
      </Flex>
      <Divider />
      <Form
        form={form}
        className='api-history-form'
        name='api-history'
        layout='vertical'
        autoComplete='off'
        onValuesChange={onValuesChange}
        initialValues={{
          time: rangePresets[0].value,
        }}>
        <Flex align='flex-end' wrap='wrap' gap={16}>
          <Form.Item label='Chatbot选择' name='chatbot' className='m-b-0'>
            <Select
              placeholder='全部Chatbot'
              allowClear
              popupMatchSelectWidth={200}
              style={{ width: 200 }}
              options={chatBotList}
              fieldNames={{ label: 'name', value: 'id' }}></Select>
          </Form.Item>
          <Form.Item label='发送状态' name='status' className='m-b-0'>
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
          <Form.Item label='SEND ID' name='send_id' className='m-b-0'>
            <Input placeholder='请输入' onPressEnter={search} />
          </Form.Item>
          <Form.Item label='手机号码' name='to' className='m-b-0'>
            <Input placeholder='请输入' onPressEnter={search} />
          </Form.Item>
          <Form.Item label='模版名称或ID' name='keyword' className='m-b-0'>
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
      </Form>
    </PageContent>
  )
}
