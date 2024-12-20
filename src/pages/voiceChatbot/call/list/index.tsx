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
  Popconfirm,
} from 'antd'
import type { GetProps } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { usePoint } from '@/hooks'
import PageContent from '@/components/pageContent'
import { getUsableTalkList, getVCTaskList, changeVCTaskStatus } from '@/api'
import { API } from 'apis'
import faceImg from '@/assets/voiceChatbot/face/call.png'
import dayjs from 'dayjs'
import { getPresets } from '@/utils/day'
import { downloadFile } from '@/utils'
import type { ColumnsType } from 'antd/es/table'
import { StatusText, StatusOptions } from '../type'

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

interface DataType extends API.VCTaskItem {}

export default function Fn() {
  const [form] = Form.useForm()
  const pointXs = usePoint('xs')
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [total, setTotal] = useState<number>(0)
  const [tableData, setTableData] = useState<DataType[]>([])
  const [statusOptionsList, setstatusOptionsList] = useState(StatusOptions)

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
        keywords: formValues.keywords,
        talk_name: formValues.talk_name,
      }

      const res = await getVCTaskList(params)
      if (res.status == 'success') {
        setTableData(res.list)
        setTotal(res.row)
        if (res.task_info) {
          setstatusOptionsList((prev) => {
            return prev.map((item) => {
              item.num = res.task_info[item.key] || 0
              return item
            })
          })
        }
      }
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

  // 开始执行2  暂停3  取消4
  const updateTask = async (id, status) => {
    try {
      const res = await changeVCTaskStatus({ sendlist: id, status })
      if (res.status == 'success') {
        getList()
      }
    } catch (error) {}
  }

  // 除搜索关键字，其他字段改变直接搜索
  const onValuesChange = (changedValues, allValues) => {
    let changeKey = Object.keys(changedValues)[0]
    if (!['keywords', 'talk_name'].includes(changeKey)) {
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
      width: pointXs ? 160 : 240,
      className: 'paddingL20',
      dataIndex: 'title',
    },
    {
      title: '创建时间',
      dataIndex: 'send',
      width: 180,
    },
    {
      title: '话术名称',
      width: 160,
      className: 'tag-color',
      render: (_, record) => (
        <a
          href={`/console/voiceChatbot/talk/edit/${record.speechSkillId}/0`}
          className='color g-pointer'
          target='_blank'>
          {record.speechskill_name}
        </a>
      ),
    },
    {
      title: '预设开始/结束时间',
      width: 360,
      render: (_, record) => (
        <div>
          {record.life_start} - {record.life_end}
        </div>
      ),
    },
    {
      title: '号码量',
      width: 100,
      render: (_, record) => <div>{record.address || '0'}</div>,
    },
    {
      title: '呼叫量',
      width: 100,
      render: (_, record) => <div>{record.call_num || '0'}</div>,
    },
    {
      title: '接通量',
      width: 100,
      render: (_, record) => <div>{record.connect_num || '0'}</div>,
    },
    {
      title: '接通率',
      width: 100,
      render: (_, record) => <div>{record.call_rate || 0}%</div>,
    },
    {
      title: '任务状态',
      width: 120,
      render: (_, record) => (
        <>
          <span className={`send-type status-${record.status}`}>
            {StatusText[record.status]}
          </span>
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
          {record.status == '2' && (
            <Button
              type='link'
              style={{ paddingLeft: 0 }}
              onClick={() => updateTask(record.id, '3')}>
              暂停
            </Button>
          )}
          {['3'].includes(record.status) && (
            <Button
              type='link'
              style={{ paddingLeft: 0 }}
              onClick={() => updateTask(record.id, '2')}>
              开始
            </Button>
          )}
          {['1', '2', , '3'].includes(record.status) && (
            <Popconfirm
              title='警告'
              description='确定取消该任务？'
              onConfirm={() => updateTask(record.id, '4')}
              okText='确定'
              cancelText='取消'>
              <Button type='link' style={{ paddingLeft: 0 }}>
                取消
              </Button>
            </Popconfirm>
          )}
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
          status: 'all',
        }}>
        <Flex align='flex-end' wrap='wrap' gap={16}>
          <Form.Item label='任务状态' name='status' className='m-b-0'>
            <Select
              placeholder='全部状态'
              popupMatchSelectWidth={160}
              style={{ width: 160 }}>
              {statusOptionsList.map((item) => (
                <Select.Option key={item.value} value={item.value}>
                  {item.label}({item.num})
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label='时间范围' name='time' className='m-b-0'>
            <RangePicker
              presets={!pointXs && rangePresets}
              allowClear={false}
              disabledDate={disabledDate}></RangePicker>
          </Form.Item>
          <Form.Item label='任务名称' name='keywords' className='m-b-0'>
            <Input placeholder='请输入' onPressEnter={search} />
          </Form.Item>
          <Form.Item label='话术名称' name='talk_name' className='m-b-0'>
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
          onChange: changePageInfo,
        }}
        scroll={{ x: 'fit-content' }}
      />
    </PageContent>
  )
}
