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
  Spin,
  Form,
  Statistic,
  ConfigProvider,
} from 'antd'
import type { CollapseProps, GetProps, StatisticProps } from 'antd'
import PageContent from '@/components/pageContent'
import MyTour from './components/tour'
import MyPay from './components/pay'
import Card from './components/card'
import SendOverview from './components/sendOverview'
import SendTime from './components/sendTime'
import SendDetail from './components/sendDetail'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import CountUp from 'react-countup'
import { usePoint } from '@/hooks'
import { useAppDispatch } from '@/store/hook'
import { initSetting } from '@/store/reducers/settingRcs'
import { useLocalStorage } from '@/hooks'

import {
  getRcsOverview,
  getRcsAnalysisOverview,
  getUseTourStatus,
  hideUseTour,
} from '@/api'
import { StorePage } from './components/pay/reducer'

import faceImg from '@/assets/rcs/face/welcome.png'
import { getPresets } from '@/utils/day'

import './index.scss'
import { API } from 'apis'

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>

const { RangePicker } = DatePicker

// 预设日期
const rangePresets = getPresets([0, 1, 3, 7])

// 只允许选择15天前-今天的日期
const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  const today = dayjs()
  const fifteenDaysAgo = today.subtract(16, 'day')
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
        <div className='p-y-16 p-r-16 g-radius-4 guide-item h-100'>
          <span className='step'>1</span>
          <div className='h-100'>
            <Space className='fn14 fw-500'>
              <span>完善客户资料</span>
              <NavLink to={'/console/rcs/account/index'}>前往</NavLink>
            </Space>
            <div className='des fn13 m-t-8'>
              5G消息需确保您的客户资料完整无缺且真实有效，审核团队将对资料进行核实，以保障服务的安全性。
            </div>
          </div>
        </div>
      </Col>
      <Col span={24} xs={24} md={12} xl={6}>
        <div className='p-y-16 p-r-16 g-radius-4 guide-item h-100'>
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
        <div className='p-y-16 p-r-16 g-radius-4 guide-item h-100'>
          <span className='step'>3</span>
          <div className='h-100'>
            <Space className='fn14 fw-500'>
              <span>创建模版</span>
            </Space>
            <div className='des fn13 m-t-8'>
              创建符合您需求的模版并提交审核，通过后 Chatbot
              将5G消息精准分发至您所选定的地址簿号码中。
            </div>
          </div>
        </div>
      </Col>
      <Col span={24} xs={24} md={12} xl={6}>
        <div className='p-y-16 p-r-16 g-radius-4 guide-item h-100'>
          <span className='step'>4</span>
          <div className='h-100'>
            <Space className='fn14 fw-500'>
              <span>智能交互</span>
            </Space>
            <div className='des fn13 m-t-8'>
              设置 Chatbot
              交互与模版交互规则，在用户收到5G消息并触发既定规则时，自动完成短信下发流程。
            </div>
          </div>
        </div>
      </Col>
    </Row>
  )
}
const formatter: StatisticProps['formatter'] = (value) => (
  <CountUp end={value as number} separator=',' />
)

export default function Fn() {
  const tourRef = useRef(null)
  const payRef = useRef(null)
  const point = usePoint('xs')
  const dispatch = useAppDispatch()

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [echartsLoading, setEchartsLoading] = useState(false)
  const [time, setTime] = useState<[Dayjs, Dayjs]>(rangePresets[1].value)
  const [data, setData] = useState<API.GetRcsOverviewRes>()
  const [echartsData, setEchartsData] = useState<API.RcsAnalysis>()
  const [showUseTour, setShowUseTour] = useLocalStorage('useTour', false)

  // 隐藏使用引导
  const noTour = async (e) => {
    e.stopPropagation()
    const res = await hideUseTour()
    if (res.status == 'success') {
      setShowUseTour(false)
    }
  }

  const _items: CollapseProps['items'] = [
    {
      key: `0`,
      label: (
        <Flex align='center' justify='space-between' className='p-r-24'>
          <div className='fw-500 fn16'>使用指引</div>
          <div className='g-pointer color' onClick={noTour}>
            不再显示
          </div>
        </Flex>
      ),
      children: <CollapseChildren />,
    },
  ]
  const showPay = () => {
    payRef.current && payRef.current.open()
  }

  const onRangeChange = (value: [Dayjs, Dayjs]) => {
    form.setFieldValue('time', value)
    setTime(value)
  }

  const getData = async () => {
    setLoading(true)
    try {
      const res = await getRcsOverview()
      // if (
      //   res.data.account_status == '0' &&
      //   !Boolean(window.localStorage.getItem('rcsTour'))
      // ) {
      // tourRef.current && tourRef.current.open()
      // }
      setData(res.data)
      setLoading(false)
    } catch (error) {
      if (error.message.includes('无产品使用权限')) {
        tourRef.current && tourRef.current.open()
      }
      setLoading(false)
    }
  }
  const initUseTour = async () => {
    try {
      const res = await getUseTourStatus()
      if (res.status == '0') {
        setShowUseTour(true)
      } else {
        setShowUseTour(false)
      }
    } catch (error) {}
  }

  const getEchartsData = async () => {
    try {
      setEchartsLoading(true)
      const res = await getRcsAnalysisOverview({
        start: dayjs(time[0]).format('YYYY-MM-DD'),
        end: dayjs(time[1]).format('YYYY-MM-DD'),
      })
      setEchartsLoading(false)
      setEchartsData(res.analysis)
    } catch (error) {
      setEchartsLoading(false)
    }
  }

  const reGetInfo = () => {
    getData()
    getEchartsData()
    dispatch(initSetting())
  }

  useEffect(() => {
    getData()
    initUseTour()
  }, [])

  useEffect(() => {
    getEchartsData()
  }, [time])
  return (
    <PageContent extClass='welcome'>
      {loading && (
        <div className='loading-wrap fx-center-center'>
          <Spin />
        </div>
      )}
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center' style={{ height: 40 }}>
        <div className='fn22 fw-500'>账户概览</div>
      </Flex>
      <Divider />

      {showUseTour && (
        <Collapse
          className='guide-collapse'
          items={_items}
          defaultActiveKey={['0']}
          bordered={false}
          expandIconPosition='end'
          expandIcon={expandIcon}
          ghost
        />
      )}

      <Row gutter={[24, 24]} className='m-t-24'>
        <Col span={24} sm={12} md={12} xl={12} xxl={18}>
          <Card title='余额（条）'>
            <div className='fn16 fw-500'>
              <ConfigProvider
                theme={{
                  components: {
                    Statistic: {
                      contentFontSize: 20,
                    },
                  },
                }}>
                <Statistic
                  title=''
                  value={data ? Number(data.credits) : 0}
                  formatter={formatter}
                />
              </ConfigProvider>
            </div>
            <Button type='primary' className='m-t-16' onClick={showPay}>
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
                <Form
                  initialValues={{ time: rangePresets[1].value }}
                  form={form}>
                  <Form.Item name='time' className='m-b-0'>
                    <RangePicker
                      presets={!point && rangePresets}
                      allowClear={false}
                      disabledDate={disabledDate}
                      onChange={onRangeChange}
                    />
                  </Form.Item>
                </Form>
              </div>
            }
          />
        </Col>

        <Col span={24} sm={24} md={24} xl={12} xxl={15}>
          <Card title='发送概览' loading={echartsLoading} minHeight={360}>
            {echartsData && (
              <SendOverview time={time} points={echartsData.points} />
            )}
          </Card>
        </Col>
        <Col span={24} sm={24} md={24} xl={12} xxl={9}>
          <Card title='发送时段' loading={echartsLoading} minHeight={360}>
            {echartsData && <SendTime hotPoints={echartsData.hotpoints} />}
          </Card>
        </Col>
        <Col span={24}>
          <Card title='发送详情' loading={echartsLoading} minHeight={270}>
            {echartsData && <SendDetail data={echartsData.send_analysis} />}
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

      <MyTour ref={tourRef} openEvent={reGetInfo} />

      <StorePage>
        <MyPay ref={payRef} />
      </StorePage>
    </PageContent>
  )
}
