import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate, NavLink } from 'react-router-dom'
import {
  Input,
  Image,
  Flex,
  Button,
  Divider,
  Row,
  Col,
  Form,
  Select,
  Upload,
  Tree,
  ConfigProvider,
  Switch,
  Space,
  Radio,
  DatePicker,
  Checkbox,
  Empty,
  App,
} from 'antd'
import type { DatePickerProps, FormInstance } from 'antd'
import type { Dayjs } from 'dayjs'
import PageContent from '@/components/pageContent'
import { usePoint } from '@/hooks'
import { PlusOutlined, DownOutlined } from '@ant-design/icons'
import { ProFormDependency } from '@ant-design/pro-components'
import Footer from '@/components/rcsMobileFooter'
import ContactsTabs from './components/contactsTabs'
import Modal from './components/modal'
import CardMob from '@/pages/rcs/template/create/card/item'
import dayjs from 'dayjs'
import { getChatbot, createRcsSend, getRcsTempList } from '@/api'
import { API } from 'apis'

import codeImg from '@/assets/rcs/send1.png'

import './index.scss'
import '@/pages/rcs/template/mobile.scss'

// 定时发送，只能选择当前时间5分钟之后的时间
function disabledDateTime(date: Dayjs) {
  if (date) {
    let now = dayjs().add(5, 'minute')
    if (date.format('YYYY/MM/DD') == now.format('YYYY/MM/DD')) {
      console.log({
        disabledHours: () => [...Array(now.hour()).keys()],
        disabledMinutes: (hour) => {
          if (hour === now.hour()) {
            return [...Array(now.minute()).keys()]
          }
          return []
        },
        disabledSeconds: (hour, minute) => {
          if (hour === now.hour() && minute === now.minute()) {
            return [...Array(now.second()).keys()]
          }
          return []
        },
      })
      return {
        disabledHours: () => [...Array(now.hour()).keys()],
        disabledMinutes: (hour) => {
          if (hour === now.hour()) {
            return [...Array(now.minute()).keys()]
          }
          return []
        },
        disabledSeconds: (hour, minute) => {
          return []
        },
      }
    } else {
      return {
        disabledHours: () => [],
        disabledMinutes: () => [],
        disabledSeconds: () => [],
      }
    }
  } else {
    return {
      disabledHours: () => [],
      disabledMinutes: () => [],
      disabledSeconds: () => [],
    }
  }
}

export default function CreateSend() {
  const { id, sign } = useParams()
  const nav = useNavigate()
  const point = usePoint('lg')
  const [form1] = Form.useForm()
  const [form2] = Form.useForm()
  const { message } = App.useApp()
  const tabsRef = useRef(null)
  const [showModal, setShowModal] = useState(false)

  const [chatbotList, setChatbotList] = useState<API.ChatbotItem[]>([])
  const [chatbot, setChatbot] = useState<API.ChatbotItem>()
  const [tempInfo, setTempInfo] = useState<API.RcsTempListItem>()
  const [showChatbotMenu, setShowChatbotMenu] = useState(true)
  const [entries, setentries] = useState<API.EntriesItem[]>([])
  const [varsKeys, setVarsKeys] = useState<string[]>(['test1', 'test2'])

  const getChatbotList = async () => {
    try {
      const res = await getChatbot({
        page: 1,
        limit: 100,
        appid: '',
        keywords: '',
        status: 'all',
      })
      setChatbotList(res.list)
      if (res.list.length > 0) {
        form1.setFieldValue('appid', res.list[0].id)
        setChatbot(res.list[0])
        if (res.list[0].menu) {
          setentries(res.list[0].menu?.menu.entries || [])
        }
      }
    } catch (error) {}
  }

  const changeChatbot = (val) => {
    const selectChatbot = chatbotList.find((item) => item.id == val)
    if (selectChatbot) {
      setChatbot(selectChatbot)
      setentries(selectChatbot.menu?.menu.entries || [])
    }
  }

  const submit = async () => {
    const value1 = await form1.getFieldsValue()
    const { mms, sms, isTimetosend, time, timetosend_date } =
      await form2.getFieldsValue()
    const { address_data, addressmod } = await tabsRef.current.getValues()

    switch (addressmod) {
      case 'addressbook':
      case 'parent_addressbook':
        if (address_data.length == 0) {
          message.warning('请选择地址簿')
          return
        }
        break
      case 'file':
        if (address_data.length == 0) {
          message.warning('请上传文件')
          return
        }
        break
      case 'input':
      case 'paste':
        if (address_data.length == 0) {
          message.warning('请输入手机号')
          return
        }
        break
    }

    let params = {
      ...value1,
      address_data,
      addressmod,
      template_id: sign,
      mms: mms,
      sms: sms,
      isTimetosend: isTimetosend.toString(),
      timetosend_date: '2024-05-18',
      timetosend_hour: '04',
      timetosend_minute: '06',
    }
    if (isTimetosend) {
      if (!timetosend_date || !time) {
        message.warning('请选择定时日期和时间')
        return
      } else {
        params['timetosend_date'] = timetosend_date.format('YYYY-MM-DD')
        params['timetosend_hour'] = time.format('HH')
        params['timetosend_minute'] = time.format('mm')
      }
    }

    const res = await createRcsSend(params)
    if (res.status == 'success') {
      message.success('创建成功', 4, () => {
        // nav('/console/rcs/send/0/0', { replace: true })
      })
    }
  }
  const getTempInfo = async () => {
    try {
      const res = await getRcsTempList({
        page: 1,
        limit: 10,
        status: '1',
        id: id,
      })
      if (res.list.length == 1) {
        let checked = res.list[0].checked
        if (checked == '0') {
          message.error('该模版审核中，请重新选择模版')
          nav('/console/rcs/send/0/0', { replace: true })
        } else if (checked == '2') {
          message.error('该模版审核失败，请重新选择模版')
          nav('/console/rcs/send/0/0', { replace: true })
        } else {
          setTempInfo(res.list[0])
        }
      } else {
        message.error('未查询到模版，请重新选择模版')
        nav('/console/rcs/send/0/0', { replace: true })
      }
    } catch (error) {}
  }

  // 是否开启回落
  const changeBack = (val) => {
    form2.setFieldsValue({
      mms: val ? 'true' : 'false',
      sms: val ? 'true' : 'false',
    })
  }

  useEffect(() => {
    // form.resetFields()
    if (sign == '0') {
      setShowModal(true)
    } else {
      getChatbotList()
      getTempInfo()
      setShowModal(false)
    }
  }, [sign, id, form1])

  return (
    <>
      <PageContent extClass='create-send'>
        <Image src={codeImg} preview={false} width={72}></Image>
        <Flex
          justify='space-between'
          align='center'
          style={{ marginTop: '4px' }}>
          <div className='fn22 fw-500'>创建在线发送任务</div>
          <Button
            type='primary'
            size={point ? 'large' : 'middle'}
            onClick={() => setShowModal(true)}
            icon={<PlusOutlined className='fn14' rev={undefined} />}>
            {id == '0' ? '选择模板' : '选择其他模板'}
          </Button>
        </Flex>
        <Divider className='line'></Divider>
        {id != '0' ? (
          <Flex wrap='wrap' gap={60}>
            <div className='left'>
              <div className='gray-color'>5g消息余额</div>
              <div className='fn20 fw-500'>9,912</div>
              <div className='gray-color m-t-12'>5g模版</div>
              <div className='rcs-mobile m-t-8' style={{ marginBottom: 0 }}>
                <div className='mobile-content'>
                  <div className='title fw-500'>测试</div>
                  <div className='temp-content'>
                    {tempInfo && (
                      <>
                        <CardMob message={tempInfo.message.message} />

                        <Space align='center' className='float-wrap'>
                          {tempInfo.suggestions.suggestions
                            .filter((item) => Boolean(item.action))
                            .map((item, index) => (
                              <div className='float-item' key={index}>
                                {item.action.displayText}
                              </div>
                            ))}
                        </Space>
                      </>
                    )}
                  </div>
                </div>
                <Footer />
              </div>
              <div className='color-warning-yellow g-radius-8 p-x-16 p-y-8 fn13 m-t-24'>
                <span className='icon iconfont icon-dengpao fn12 m-r-2'></span>
                如果您的短信属于群发类型，晚间22:00之后提交的群发请求，为避免对用户造成骚扰，可能会被延迟到隔天的早间8:00开始发送，未经您的用户允许，请勿发送营销类相关短信内容。
              </div>
            </div>
            <div className='right'>
              <Form
                name='create-send-form'
                className='create-send-form'
                form={form1}
                layout='vertical'
                autoComplete='off'
                validateTrigger='onBlur'>
                <Row gutter={24}>
                  <Col span={24}>
                    <Flex align='center'>
                      <div className='color-btn g-radius-50 step-number fx-center-center color fn16'>
                        1
                      </div>
                      <span className='fw-500 m-l-8 fn16'>任务</span>
                    </Flex>
                    <Divider className='line m-y-12'></Divider>
                  </Col>
                  <Col span={24} lg={12}>
                    <Form.Item label='任务名称（选填）' name='title'>
                      <Input placeholder='请输入' />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Row align={'middle'} gutter={point ? 24 : 8}>
                      <Col span={12}>
                        <Form.Item label='Chatbot名称' name='appid'>
                          <Select
                            options={chatbotList}
                            fieldNames={{ label: 'name', value: 'id' }}
                            onChange={changeChatbot}></Select>
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Flex gap={0} className='m-t-10'>
                          <Button
                            type='link'
                            className={`${point ? 'p-x-24' : 'p-x-8'}`}
                            onClick={() =>
                              setShowChatbotMenu(!showChatbotMenu)
                            }>
                            {showChatbotMenu ? '收起' : '打开'}
                          </Button>
                          <Divider
                            className='line m-y-12 m-x-0'
                            type='vertical'></Divider>
                          <Button
                            type='link'
                            className={`hover-link ${
                              point ? 'p-x-24' : 'p-x-8'
                            }`}>
                            <NavLink to='/console/rcs/chatbot/index'>
                              管理 Chatbot{' '}
                              <span className='icon iconfont icon-xiangxia fn12 m-l-4'></span>
                            </NavLink>
                          </Button>
                        </Flex>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <div
                      className={`color-tab p-b-16 p-x-24 g-radius-4 create-send-menu g-transition-500 ${
                        showChatbotMenu && chatbot ? 'show' : 'hide'
                      }`}>
                      <span className='icon iconfont icon-sanjiao jiantou fn24'></span>
                      <Row gutter={24} wrap>
                        {entries.map((item, index) => {
                          return (
                            <Col key={index} span={24} sm={12} lg={8}>
                              <div className='p-t-16'>
                                <div className='menu-1' title='一级菜单'>
                                  {item.action?.displayText ||
                                    item.reply?.displayText ||
                                    item.menu?.displayText ||
                                    ''}
                                </div>
                                <div className='menu-2-wrap p-l-12 p-t-4'>
                                  {item?.menu &&
                                    item?.menu.entries.map((itm, idx) => {
                                      return (
                                        <div
                                          className='menu-2'
                                          key={idx}
                                          title='二级菜单'>
                                          {itm.action?.displayText ||
                                            itm.reply?.displayText ||
                                            ''}
                                        </div>
                                      )
                                    })}
                                </div>
                              </div>
                            </Col>
                          )
                        })}

                        {entries.length == 0 && (
                          <Col span={24} className='p-16 fx-center-center'>
                            <Empty description='未配置固定菜单' />
                          </Col>
                        )}
                      </Row>
                    </div>
                  </Col>
                </Row>
              </Form>
              <Col span={24}>
                <Flex
                  align='center'
                  className={`${showChatbotMenu ? 'm-t-16' : ''}`}>
                  <div className='color-btn g-radius-50 step-number fx-center-center color fn16 '>
                    2
                  </div>
                  <span className='fw-500 m-l-8 fn16'>添加联系人</span>
                </Flex>
                <Divider className='line m-y-12'></Divider>
              </Col>
              <Col span={24}>
                <ContactsTabs vars={varsKeys} ref={tabsRef} />
              </Col>

              <Form
                name='create-send-form-2'
                className='create-send-form m-t-16'
                form={form2}
                layout='vertical'
                autoComplete='off'
                validateTrigger='onBlur'>
                <Row gutter={24}>
                  <Col span={24}>
                    <Flex
                      align='center'
                      className={`${showChatbotMenu ? 'm-t-16' : ''}`}>
                      <div className='color-btn g-radius-50 step-number fx-center-center color fn16 '>
                        3
                      </div>
                      <span className='fw-500 m-l-8 fn16'>配置</span>
                    </Flex>
                    <Divider className='line m-y-12'></Divider>
                  </Col>
                  <Col span={24}>
                    <Space align='center'>
                      <Form.Item
                        label=''
                        name='back'
                        className='m-b-0'
                        valuePropName='checked'
                        initialValue={true}>
                        <Switch size='small' onChange={changeBack} />
                      </Form.Item>
                      <span>短信回落</span>
                    </Space>
                  </Col>
                  <Col span={24}>
                    <ProFormDependency name={['back']}>
                      {({ back }) => {
                        return (
                          <Space>
                            <Form.Item
                              label=''
                              name='sms'
                              className='m-b-0'
                              initialValue={'true'}>
                              <Checkbox checked={back} disabled>
                                回落短信
                              </Checkbox>
                            </Form.Item>
                            <Form.Item
                              label=''
                              name='mms'
                              className='m-b-0'
                              initialValue={'true'}>
                              <Checkbox checked={back} disabled>
                                回落彩信
                              </Checkbox>
                            </Form.Item>
                          </Space>
                        )
                      }}
                    </ProFormDependency>
                  </Col>
                  <Col span={24}>
                    <Space className='m-b-12'>
                      <Form.Item
                        initialValue={false}
                        label=''
                        name='isTimetosend'
                        className='m-b-0'
                        valuePropName='checked'>
                        <Switch size='small' />
                      </Form.Item>
                      <span>定时发送</span>
                    </Space>
                  </Col>

                  <ProFormDependency name={['isTimetosend']}>
                    {({ isTimetosend }) => {
                      return (
                        <>
                          {isTimetosend && (
                            <Col span={24}>
                              <Row gutter={16}>
                                <Col>
                                  <Form.Item
                                    label=''
                                    name='timetosend_date'
                                    initialValue={dayjs().add(5, 'minute')}
                                    className='m-b-0'>
                                    <DatePicker
                                      type='time'
                                      placement='topLeft'
                                      showNow={false}
                                      placeholder='请选择日期'
                                      minDate={dayjs().add(5, 'minute')}
                                    />
                                  </Form.Item>
                                </Col>
                                <ProFormDependency name={['timetosend_date']}>
                                  {({ timetosend_date }) => {
                                    return (
                                      <Col>
                                        <Form.Item
                                          label=''
                                          name='time'
                                          initialValue={dayjs()
                                            .add(5, 'minute')
                                            .startOf('minute')}
                                          className='m-b-0'>
                                          <DatePicker
                                            showTime={{ format: 'HH:mm' }}
                                            format='HH:mm:ss'
                                            disabledTime={() =>
                                              disabledDateTime(timetosend_date)
                                            }
                                            mode='time'
                                            placement='topLeft'
                                            picker='time'
                                            showNow={false}
                                            needConfirm={false}
                                            placeholder='请选择时间'
                                          />
                                        </Form.Item>
                                      </Col>
                                    )
                                  }}
                                </ProFormDependency>
                              </Row>
                              <div className='color-warning-red g-radius-8 p-x-16 p-y-8 fn13 m-t-24'>
                                <span className='icon iconfont icon-dengpao fn12 m-r-2'></span>
                                请注意
                                <br />
                                1)如果您启用了定时发送，在该任务未发送完成前对模板的任何修改都将影响定时发送任务的实际发送内容；
                                <br />
                                2)如果你不希望发生变更，请在该任务未发送完成前不要对短信模板进行修改或更新设置；
                                <br />
                                3)在定时任务未发送完成前，请不要对选择的Chatbot进行删除和禁用操作；
                                <br />
                                4)提交的任务短信数量越大，定时的时间应越长，计算公式
                                =（总数/1万）x 1.5分钟；
                              </div>
                            </Col>
                          )}
                          <Col span={24}>
                            <Form.Item className='m-t-24'>
                              <ConfigProvider
                                theme={{
                                  token: {
                                    colorPrimary: isTimetosend
                                      ? '#f19d25'
                                      : '#1764ff',
                                  },
                                }}>
                                <Button type='primary' onClick={submit}>
                                  {isTimetosend
                                    ? '提交定时任务'
                                    : '提交发送任务'}
                                </Button>
                              </ConfigProvider>
                            </Form.Item>
                          </Col>
                        </>
                      )
                    }}
                  </ProFormDependency>
                </Row>
              </Form>
            </div>
          </Flex>
        ) : (
          <Empty description='请选择模版' />
        )}
      </PageContent>

      <Modal open={showModal} onCancel={() => setShowModal(false)} />
    </>
  )
}
