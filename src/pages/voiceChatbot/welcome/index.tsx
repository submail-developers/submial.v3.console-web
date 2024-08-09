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
  App,
  Progress,
} from 'antd'
import type { CollapseProps, GetProps, StatisticProps } from 'antd'
import PageContent from '@/components/pageContent'
import MyPay from './components/pay'
import Card from '@/components/aCard'
import dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'
import { usePoint, useLocalStorage } from '@/hooks'
import { useAppDispatch } from '@/store/hook'
import { initSetting } from '@/store/reducers/settingRcs'
import OverView from './components/overView'
import TimeChat from './components/timeChat'
import TimesChat from './components/timesChat'

import {
  getRcsOverview,
  getRcsAnalysisOverview,
  getUseTourStatus,
  hideUseTour,
  getDicConfig,
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

export default function Fn() {
  const tourRef = useRef(null)
  const payRef = useRef(null)
  const point = usePoint('xs')
  const dispatch = useAppDispatch()
  const { message } = App.useApp()

  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [echartsLoading, setEchartsLoading] = useState(false)
  const [time, setTime] = useState<[Dayjs, Dayjs]>(rangePresets[3].value)
  const [data, setData] = useState<API.GetRcsOverviewRes>()
  const [echartsData, setEchartsData] = useState<API.RcsAnalysis>()
  const [accountInfo, setAccountInfo] = useState<API.GetDicConfigItems>()

  const showPay = () => {
    if (!accountInfo) return
    switch (accountInfo.status) {
      case '0':
      case '2':
        message.warning('请完善客户资料，审核通过后购买资源包', 5)
        break
      case '1':
        payRef.current && payRef.current.open()
        break
      case '3':
      case '9':
        message.warning('客户资料正在审核，请审核通过后购买资源包', 5)
        break
    }
  }

  const onRangeChange = (value: [Dayjs, Dayjs]) => {
    form.setFieldValue('time', value)
    setTime(value)
  }

  const getData = async () => {
    setLoading(true)
    try {
      const res = await getRcsOverview()
      setData(res.data)
      setLoading(false)
    } catch (error) {
      if (error.message.includes('无产品使用权限')) {
        tourRef.current && tourRef.current.open()
      }
      setLoading(false)
    }
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

  const getAccountInfo = async () => {
    try {
      const res = await getDicConfig()
      setAccountInfo(res.data)
    } catch (error) {}
  }

  useEffect(() => {
    getData()
    getAccountInfo()
  }, [])

  useEffect(() => {
    getEchartsData()
  }, [time])
  return (
    <PageContent extClass='welcome'>
      <Image src={faceImg} preview={false} width={72}></Image>
      <Flex justify='space-between' align='center' style={{ height: 40 }}>
        <div className='fn22 fw-500'>账户概览</div>
      </Flex>
      <Divider />

      <Row gutter={[24, 24]} className='m-t-24'>
        <Col span={24} sm={12} md={12} xl={12} xxl={18}>
          <Card title='账户余额'>
            <div className='fn16 fw-500'>
              <ConfigProvider
                theme={{
                  components: {
                    Statistic: {
                      contentFontSize: 20,
                    },
                  },
                }}>
                <Statistic title='' value={123432.6} precision={1} />
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
                  initialValues={{ time: rangePresets[3].value }}
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
          <Card title='数据概览' loading={echartsLoading} minHeight={200}>
            <OverView />
          </Card>
        </Col>
        <Col span={24} sm={24} md={24} xl={12} xxl={9}>
          <Card
            title={
              <Row className='w-100' style={{ textIndent: 0 }}>
                <Col className='fn16 fw-500' span={14}>
                  意向客户
                </Col>
                <Col className='fn16 fw-500' span={5}>
                  数量
                </Col>
                <Col className='fn16 fw-500' span={5}>
                  占比
                </Col>
              </Row>
            }
            loading={echartsLoading}
            minHeight={200}>
            <Row gutter={[0, 20]}>
              <Col span={14}>
                <Flex align='center' wrap='wrap' gap={12}>
                  <div>A类客户</div>
                  <div style={{ width: 100 }}>
                    <Progress percent={20} showInfo={false} size={'small'} />
                  </div>
                </Flex>
              </Col>
              <Col span={5}>200</Col>
              <Col span={5}>20%</Col>
              <Col span={14}>
                <Flex align='center' wrap='wrap' gap={12}>
                  <div>A类客户</div>
                  <div style={{ width: 100 }}>
                    <Progress percent={20} showInfo={false} size={'small'} />
                  </div>
                </Flex>
              </Col>
              <Col span={5}>200</Col>
              <Col span={5}>20%</Col>
              <Col span={14}>
                <Flex align='center' wrap='wrap' gap={12}>
                  <div>A类客户</div>
                  <div style={{ width: 100 }}>
                    <Progress percent={20} showInfo={false} size={'small'} />
                  </div>
                </Flex>
              </Col>
              <Col span={5}>200</Col>
              <Col span={5}>20%</Col>
              <Col span={14}>
                <Flex align='center' wrap='wrap' gap={12}>
                  <div>A类客户</div>
                  <div style={{ width: 100 }}>
                    <Progress percent={20} showInfo={false} size={'small'} />
                  </div>
                </Flex>
              </Col>
              <Col span={5}>200</Col>
              <Col span={5}>20%</Col>
            </Row>
          </Card>
        </Col>
        <Col span={24} sm={24} md={24} xl={12} xxl={12}>
          <Card title='通话概览' loading={echartsLoading} minHeight={284}>
            <TimeChat />
          </Card>
        </Col>
        <Col span={24} sm={24} md={24} xl={12} xxl={12}>
          <Card title='对话轮次概览' loading={echartsLoading} minHeight={284}>
            <TimesChat />
          </Card>
        </Col>

        <Col span={24}>
          <Divider className='m-y-8' />
        </Col>

        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col span={24} sm={24} md={12} xl={12} xxl={12}>
              <Card title='外呼任务概览'>
                <Row gutter={[32, 16]}>
                  <Col span={12}>
                    <Flex justify='space-between' align='center'>
                      <span className='gray-color'>已创建任务</span>
                      <span>{data && data.template.all}</span>
                    </Flex>
                  </Col>
                  <Col span={12}>
                    <Flex justify='space-between' align='center'>
                      <span className='gray-color'>已发送完成任务</span>
                      <span>{data && data.template.pass}</span>
                    </Flex>
                  </Col>
                  <Col span={12}>
                    <Flex justify='space-between' align='center'>
                      <span className='gray-color'>待发送任务</span>
                      <span>{data && data.template.all}</span>
                    </Flex>
                  </Col>
                  <Col span={12}>
                    <Flex justify='space-between' align='center'>
                      <span className='gray-color'>已终止任务</span>
                      <span>{data && data.template.pass}</span>
                    </Flex>
                  </Col>
                  <Col span={24} className='p-t-8'>
                    <NavLink
                      to='/console/rcs/template/index'
                      className={'hover-link'}>
                      <Space align='center' size={2}>
                        <span>管理外呼任务</span>
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
              <Card title='黑名单概览'>
                <Row gutter={[12, 16]}>
                  <Col span={24}>
                    <Flex justify='space-between' align='center'>
                      <span className='gray-color'>已创建黑名单</span>
                      <span>{data && data.task.all}</span>
                    </Flex>
                  </Col>
                  <Col span={24}>
                    <Flex justify='space-between' align='center'>
                      <span className='gray-color'>黑名单号码数</span>
                      <span>{data && data.task.timetosend}</span>
                    </Flex>
                  </Col>
                  <Col span={24} className='p-t-8'>
                    <NavLink
                      to='/console/rcs/batchreport/index'
                      className={'hover-link'}>
                      <Space align='center' size={2}>
                        <span>管理黑名单</span>
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

      <StorePage>
        <MyPay ref={payRef} />
      </StorePage>
    </PageContent>
  )
}
