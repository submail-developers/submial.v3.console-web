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
} from 'antd'
import PageContent from '@/components/pageContent'
import { DownOutlined } from '@ant-design/icons'

// import { getErrorLogs } from '@/api'
import { API } from 'apis'
import topIco from '@/assets/rcs/history/history_ico.png'
import './index.scss'

import { useSize, usePoint } from '@/hooks'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
const { Option } = Select

const { RangePicker } = DatePicker
interface FormValues {
  chatbot: any
  sendStatus: any
  time: [Dayjs, Dayjs] | null
}

export default function Fn() {
  const size = useSize()
  const point = usePoint('lg')

  const [form] = Form.useForm()
  const [getErrorList, setGetErrorList] = useState()

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
      mob: '15900898337',
      mobDedail: '中国移动/安徽/合肥',
      tempId: '12332233',
      sendTime: '2023-03-12 17:00',
      endTime: '2023-03-12 17:00',
      fee: '0',
      status: '发送完成',
    },
    {
      key: '1',
      mob: '15900898337',
      mobDedail: '中国移动/安徽/合肥',
      tempId: '12332233',
      sendTime: '2023-03-12 17:00',
      endTime: '2023-03-12 17:00',
      fee: '0',
      status: '发送完成',
    },
  ]

  const columns = [
    {
      title: '手机号',
      dataIndex: 'mob',
      key: 'mob',
      fixed: true,
      width: size == 'small' ? 150 : 200,
      className: size == 'small' ? 'paddingL20' : 'paddingL30',
    },
    {
      title: '号码详情',
      dataIndex: 'mobDedail',
      key: 'mobDedail',
      width: 180,
    },
    {
      title: '模板id',
      dataIndex: 'tempId',
      key: 'tempId',
      width: 120,
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      key: 'sendTime',
      width: 200,
    },
    {
      title: '送达时间',
      dataIndex: 'endTime',
      key: 'endTime',
      width: 200,
    },
    {
      title: '计费(元)',
      dataIndex: 'fee',
      key: 'fee',
      width: 100,
    },
    {
      title: '送达状态',
      dataIndex: 'status',
      key: 'status',
      width: 200,
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

  const chatOptions = [
    {
      value: 0,
      label: '全部ChatBot',
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
  ]
  const initFormValues: FormValues = {
    sendStatus: sendOptions[0],
    chatbot: chatOptions[0],
    time: [dayjs().add(-1, 'd'), dayjs().add(0, 'd')],
  }
  const edit = async (e) => {
    console.log(e)
  }
  return (
    <PageContent extClass='api-history'>
      <Form
        form={form}
        className='api-history-form'
        name='api-history'
        layout='vertical'
        autoComplete='off'
        initialValues={initFormValues}>
        <Image src={topIco} preview={false} width={72}></Image>
        <Flex
          justify='space-between'
          align='center'
          style={{ marginTop: '4px' }}>
          <div className='fn22 fw-500'>API历史明细</div>

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
          <Col span={8} md={8} lg={6} xl={6}>
            <Form.Item
              label='全部ChatBot'
              name='chatbot'
              style={{ marginBottom: '0px' }}>
              <Select placeholder='所有标签' popupMatchSelectWidth={120}>
                {chatOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8} md={8} lg={6} xl={6}>
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
          <Col span={8} md={8} lg={6} xl={7}>
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
    </PageContent>
  )
}
