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
} from 'antd'
import PageContent from '@/components/pageContent'

// import { getErrorLogs } from '@/api'
import { API } from 'apis'
import topIco from '@/assets/rcs/errorlogs/err_ico.png'
import './index.scss'
import { useSize } from '@/hooks'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
const { Option } = Select

const { RangePicker } = DatePicker
interface FormValues {
  chatbot: any
  time: [Dayjs, Dayjs] | null
}

export default function Fn() {
  const size = useSize()
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
      name: 'ChatBot1',
      api: '5grcs/template_put',
      code: '329',
      date: '2023-03-12 17:00',
      ip: '124.25.15.262',
      detail: '缺号参数12123123131231231',
    },
    {
      key: '2',
      name: 'ChatBot1',
      api: '5grcs/template_put',
      code: '329',
      date: '2023-03-12 17:00',
      ip: '124.25.15.262',
      detail: '缺号参数12123123131231231',
    },
  ]

  const columns = [
    {
      title: 'ChatBot',
      dataIndex: 'name',
      key: 'name',
      fixed: true,
      width: size == 'small' ? 100 : 150,
      className: size == 'small' ? 'paddingL20' : 'paddingL30',
    },
    {
      title: 'API',
      dataIndex: 'api',
      key: 'api',
      width: 180,
    },
    {
      title: '错误码',
      dataIndex: 'code',
      key: 'code',
      width: 120,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 200,
    },
    {
      title: 'IP来源',
      dataIndex: 'ip',
      key: 'ip',
      width: 200,
    },
    {
      title: '详情',
      dataIndex: 'detail',
      key: 'detail',
      render: (_, record) => (
        <div className='g-ellipsis-2' style={{ width: '200px' }}>
          缺号参数12123123131231231缺号参数12123123131231231缺号参数12123123131231231
        </div>
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

  const chatOptions = [
    {
      value: 0,
      label: '全部ChatBot',
    },
  ]
  const initFormValues: FormValues = {
    chatbot: chatOptions[0],
    time: [dayjs().add(-1, 'd'), dayjs().add(0, 'd')],
  }
  return (
    <PageContent extClass='api-errorlogs'>
      <Form
        form={form}
        className='api-errorlogs-form'
        name='api-errorlogs'
        layout='vertical'
        autoComplete='off'
        initialValues={initFormValues}>
        <Image src={topIco} preview={false} width={72}></Image>
        <Flex
          justify='space-between'
          align='center'
          style={{ marginTop: '4px' }}>
          <div className='fn22 fw-500'>API错误日志</div>
        </Flex>
        <Divider className='line'></Divider>

        <Row gutter={16}>
          <Col className='m-b-20'>
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
          <Col className='m-b-20'>
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
