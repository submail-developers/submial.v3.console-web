import { useEffect, useRef, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import {
  Image,
  Flex,
  Space,
  Button,
  Divider,
  Collapse,
  Row,
  Col,
  DatePicker,
  ConfigProvider,
  Spin,
  Form,
} from 'antd'
import type { CollapseProps, GetProps } from 'antd'
import PageContent from '@/components/pageContent'
import ARangePicker from '@/components/aRangePicker'
import MyTour from './components/tour'
import Card from './components/card'
import SendOverview from './components/sendOverview'
import SendTime from './components/sendTime'
import SendDetail from './components/sendDetail'
import UseTime from './components/useTime'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

import { points, hotPoints } from './data'

import { getRcsOverview } from '@/api'

import codeImg from '@/assets/rcs/chatbot_1.png'

import './index.scss'
import { API } from 'apis'

type RangePresets = {
  label: string
  value: [Dayjs, Dayjs]
}[]
type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

const rangePresets: RangePresets = [
  {
    label: '今天',
    value: [dayjs().add(0, 'd'), dayjs()],
  },
  {
    label: '昨天',
    value: [dayjs().add(-1, 'd'), dayjs().add(-1, 'd')],
  },
  {
    label: '最近 3 天',
    value: [dayjs().add(-2, 'd'), dayjs()],
  },
  {
    label: '最近 7 天',
    value: [dayjs().add(-6, 'd'), dayjs()],
  },
  {
    label: '最近 15 天',
    value: [dayjs().add(-14, 'd'), dayjs()],
  },
  // {
  //   label: '最近一个月',
  //   value: [dayjs().add(-30, 'd'), dayjs()],
  // },
  // {
  //   label: '最近三个月',
  //   value: [dayjs().add(-90, 'd'), dayjs()],
  // },
]

// 只允许选择15天前-今天的日期
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  const today = dayjs().startOf('day')
  const fifteenDaysAgo = today.subtract(14, 'day')
  const currentDate = dayjs(current)
  return currentDate.isBefore(fifteenDaysAgo) || currentDate.isAfter(today)
}

// 折叠面板按钮
const expandIcon = (panelProps) => {
  return (
    <Space align='center'>
      <div
        className={`g-transition-300 ${
          panelProps.isActive ? 'g-rotate-180' : 'g-rotate-0'
        }`}>
        <span
          className='icon iconfont icon-xiangxia'
          style={{ fontSize: 7 }}></span>
      </div>
    </Space>
  )
}
const CollapseChildren = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24} xs={24} md={12} xl={6}>
        <div className='p-16 g-radius-4 guide-item h-100'>
          <span className='step'>1</span>
          <div className='h-100'>
            <Space className='fn14 fw-500'>
              <span>完善客户资料</span>
              <NavLink to={'/console/rcs/account/index'}>前往</NavLink>
            </Space>
            <div className='des fn13 m-t-8'>
              5G消息服务需要确保您的客户资料完整无缺且真实有效，审核团队将对资料进行核实，以保障服务的安全性。
            </div>
          </div>
        </div>
      </Col>
      <Col span={24} xs={24} md={12} xl={6}>
        <div className='p-16 g-radius-4 guide-item h-100'>
          <span className='step'>2</span>
          <div className='h-100'>
            <Space className='fn14 fw-500'>
              <span>申请Chatbot</span>
              <NavLink to={'/console/rcs/chatbot/create/0'}>前往</NavLink>
            </Space>
            <div className='des fn13 m-t-8'>
              根据您的需要申请/配置个性化
              Chatbot，从而为您的客户提供强交互和快响应的使用体验。
            </div>
          </div>
        </div>
      </Col>
      <Col span={24} xs={24} md={12} xl={6}>
        <div className='p-16 g-radius-4 guide-item h-100'>
          <span className='step'>3</span>
          <div className='h-100'>
            <Space className='fn14 fw-500'>
              <span>创建模版</span>
            </Space>
            <div className='des fn13 m-t-8'>
              创建符合您业务需求的模版并提交审核，通过后通过 Chatbot
              将5G消息精准分发至您所选定的地址簿号码中。
            </div>
          </div>
        </div>
      </Col>
      <Col span={24} xs={24} md={12} xl={6}>
        <div className='p-16 g-radius-4 guide-item h-100'>
          <span className='step'>4</span>
          <div className='h-100'>
            <Space className='fn14 fw-500'>
              <span>智能交互</span>
            </Space>
            <div className='des fn13 m-t-8'>
              设置 Chatbot
              交互规则与模版交互规则，在用户接收到5G消息并触发既定规则时，自动完成短信下发流程。
            </div>
          </div>
        </div>
      </Col>
    </Row>
  )
}
const _items: CollapseProps['items'] = [
  {
    key: `0`,
    label: <div className='fw-500 fn16'>使用指引</div>,
    children: <CollapseChildren />,
  },
]

export default function Fn() {
  const tourRef = useRef(null)

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [echartsLoading, setEchartsLoading] = useState(false)
  const [time, setTime] = useState<[Dayjs, Dayjs]>([
    dayjs().add(-6, 'd'),
    dayjs(),
  ])
  const [data, setData] = useState<API.GetRcsOverviewRes>()

  const onValuesChange = async () => {
    const values = await form.getFieldsValue()
    console.log(values)
  }

  const onRangeChange = (value: [Dayjs, Dayjs]) => {
    setTime(value)
  }

  const getData = async () => {
    setLoading(true)
    try {
      const res = await getRcsOverview()

      if (
        res.data.account_status == '0' &&
        !Boolean(window.localStorage.getItem('rcsTour'))
      ) {
        tourRef.current && tourRef.current.open()
      }
      setData(res.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {}, [time])
  return (
    <PageContent extClass='welcome'>
      {loading && (
        <div className='loading-wrap fx-center-center'>
          <Spin />
        </div>
      )}
      <Image src={codeImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center'>
        <div className='fn22 fw-500'>账户概览</div>

        {/* <Form form={form} onValuesChange={onValuesChange}>
          <Form.Item name='time'>
            <ARangePicker
              presets={rangePresets}
              form={form}
              name='time'
              rangePickerProps={{
                allowClear: false,
              }}
            />
          </Form.Item>
        </Form> */}
      </Flex>
      <Divider />

      <Collapse
        className='guide-collapse'
        items={_items}
        defaultActiveKey={['0']}
        bordered={false}
        expandIconPosition='end'
        expandIcon={expandIcon}
        ghost
      />

      <Row gutter={[24, 24]} className='m-t-24'>
        <Col span={24} sm={12} md={12} xl={12} xxl={18}>
          <Card title='余额'>
            <div className='fn16 fw-500'>
              {data && data.credits.toLocaleString()}
            </div>
            <Button type='primary' className='m-t-16'>
              购买资源包
            </Button>
          </Card>
        </Col>
        <Col span={24} sm={12} md={12} xl={12} xxl={6}>
          <Card title='更多指引'>
            <Row gutter={[12, 16]}>
              <Col span={24} sm={12}>
                <Link to={'/console/rcs/welcome'} target='_blank'>
                  计费规则
                </Link>
              </Col>
              <Col span={24} sm={12}>
                <Link to={'/console/rcs/welcome'} target='_blank'>
                  消息上行文档
                </Link>
              </Col>
              <Col span={24} sm={12}>
                <Link to={'/documents/tAhPk'} target='_blank'>
                  API开发文档
                </Link>
              </Col>
              <Col span={24} sm={12}>
                <Link to={'/console/rcs/welcome'} target='_blank'>
                  Chatbot交互演示
                </Link>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Divider
            style={{ margin: 0 }}
            orientation='right'
            orientationMargin={0}
            children={
              <div style={{ width: 240 }}>
                <ARangePicker
                  initValue={time}
                  presets={rangePresets}
                  rangePickerProps={{
                    allowClear: false,
                    disabledDate: disabledDate,
                  }}
                  onRangeChange={onRangeChange}
                />
              </div>
            }
          />
        </Col>

        <Col span={24} sm={24} md={24} xl={12} xxl={15}>
          <Card title='发送概览' loading={echartsLoading}>
            <SendOverview time={time} points={points} />
          </Card>
        </Col>
        <Col span={24} sm={24} md={24} xl={12} xxl={9}>
          <Card title='发送时段' loading={echartsLoading}>
            <SendTime hotPoints={hotPoints} />
          </Card>
        </Col>
        <Col span={24} sm={24} md={24} xl={12} xxl={14}>
          <Card title='发送详情' loading={echartsLoading}>
            <SendDetail />
          </Card>
        </Col>
        <Col span={24} sm={24} md={24} xl={12} xxl={10}>
          <Card title='耗时统计' loading={echartsLoading}>
            <UseTime />
          </Card>
        </Col>

        <Col span={24}>
          <Divider className='m-y-8' />
        </Col>

        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col span={24} sm={24} md={12} xl={12} xxl={6}>
              <Card title='模版概览'>
                <Row gutter={[12, 16]}>
                  <Col span={24}>
                    <Flex justify='space-between' align='center'>
                      <span className='gray-color'>已创建模版</span>
                      <span>{data && data.template.all}</span>
                    </Flex>
                  </Col>
                  <Col span={24}>
                    <Flex justify='space-between' align='center'>
                      <span className='gray-color'>审核通过模版</span>
                      <span>{data && data.template.pass}</span>
                    </Flex>
                  </Col>
                  <Col span={24} className='p-t-8'>
                    <NavLink
                      to='/console/rcs/template/index'
                      className={'hover-link'}>
                      <Space align='center' size={2}>
                        <span>管理 Chatbot</span>
                        <span
                          className='icon iconfont icon-xiangxia m-b-8'
                          style={{ fontSize: '7px' }}></span>
                      </Space>
                    </NavLink>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={24} sm={24} md={12} xl={12} xxl={6}>
              <Card title='Chatbot概览'>
                <Row gutter={[12, 16]}>
                  <Col span={24}>
                    <Flex justify='space-between' align='center'>
                      <span className='gray-color'>已创建Chatbot</span>
                      <span>{data && data.chatbot.all}</span>
                    </Flex>
                  </Col>
                  <Col span={24}>
                    <Flex justify='space-between' align='center'>
                      <span className='gray-color'>审核通过Chatbot</span>
                      <span>{data && data.chatbot.pass}</span>
                    </Flex>
                  </Col>
                  <Col span={24} className='p-t-8'>
                    <NavLink
                      to='/console/rcs/chatbot/index'
                      className={'hover-link'}>
                      <Space align='center' size={2}>
                        <span>Chatbot列表</span>
                        <span
                          className='icon iconfont icon-xiangxia m-b-8'
                          style={{ fontSize: '7px' }}></span>
                      </Space>
                    </NavLink>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={24} sm={24} md={12} xl={12} xxl={6}>
              <Card title='在线发送任务概览'>
                <Row gutter={[12, 16]}>
                  <Col span={24}>
                    <Flex justify='space-between' align='center'>
                      <span className='gray-color'>已创建在线发送任务</span>
                      <span>{data && data.task.all}</span>
                    </Flex>
                  </Col>
                  <Col span={24}>
                    <Flex justify='space-between' align='center'>
                      <span className='gray-color'>定时任务</span>
                      <span>{data && data.task.timetosend}</span>
                    </Flex>
                  </Col>
                  <Col span={24} className='p-t-8'>
                    <NavLink
                      to='/console/rcs/batchreport/index'
                      className={'hover-link'}>
                      <Space align='center' size={2}>
                        <span>批量任务报告</span>
                        <span
                          className='icon iconfont icon-xiangxia m-b-8'
                          style={{ fontSize: '7px' }}></span>
                      </Space>
                    </NavLink>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={24} sm={24} md={12} xl={12} xxl={6}>
              <Card title='地址簿概览'>
                <Row gutter={[12, 16]}>
                  <Col span={24}>
                    <Flex justify='space-between' align='center'>
                      <span className='gray-color'>已创建地址簿</span>
                      <span>{data && data.addressbook.addressbooks}</span>
                    </Flex>
                  </Col>
                  <Col span={24}>
                    <Flex justify='space-between' align='center'>
                      <span className='gray-color'>已创建地址簿文件夹</span>
                      <span>{data && data.addressbook.folder}</span>
                    </Flex>
                  </Col>
                  <Col span={24} className='p-t-8'>
                    <NavLink to='/console/rcs/address' className={'hover-link'}>
                      <Space align='center' size={2}>
                        <span>地址簿管理</span>
                        <span
                          className='icon iconfont icon-xiangxia m-b-8'
                          style={{ fontSize: '7px' }}></span>
                      </Space>
                    </NavLink>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <MyTour ref={tourRef} />
    </PageContent>
  )
}
