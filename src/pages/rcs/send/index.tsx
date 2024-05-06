import { useEffect, useState } from 'react'
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
import ContactsTabs from './components/contactsTabs'
import Modal from './components/modal'

import { getChatbot, createRcsSend } from '@/api'
import { API } from 'apis'

import codeImg from '@/assets/rcs/send1.png'

import './index.scss'
import '@/pages/rcs/template/components/mobile.scss'

export default function CreateSend() {
  const { id } = useParams()
  const nav = useNavigate()
  const point = usePoint('lg')
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [showModal, setShowModal] = useState(false)

  const [chatbotList, setChatbotList] = useState<API.ChatbotItem[]>([])
  const [chatbot, setChatbot] = useState<API.ChatbotItem>()
  const [showChatbotMenu, setShowChatbotMenu] = useState(true)

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
        form.setFieldValue('appid', res.list[0].id)
        setChatbot(res.list[0])
      }
    } catch (error) {}
  }

  const changeChatbot = (val) => {
    const selectChatbot = chatbotList.find((item) => item.id == val)
    if (selectChatbot) {
      setChatbot(selectChatbot)
    }
  }

  const onFieldsChange = (changedFields, allFields) => {
    console.log(allFields)
  }
  const onFinish = async (values) => {
    console.log(values)
    const { appid, mms, sms, textarea } = values
    if (!textarea) {
      message.warning('请输入手机号')
    }
    const res = await createRcsSend({
      appid: appid,
      template_id: id,
      tos: textarea || '',
      vars: '',
      mms: mms,
      sms: sms,
    })
    if (res.status == 'success') {
      message.success('创建成功', 4, () => {
        nav('/console/rcs/send/0', { replace: true })
      })
    }
  }
  const init = () => {
    console.log('init')
  }

  // 是否开启回落
  const changeBack = (val) => {
    form.setFieldsValue({
      mms: val ? 'true' : 'false',
      sms: val ? 'true' : 'false',
    })
  }

  useEffect(() => {
    // form.resetFields()
    if (id == '0') {
      setShowModal(true)
    } else {
      getChatbotList()
      setShowModal(false)
      init()
    }
  }, [id, form])

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
            icon={<PlusOutlined className='fn14' />}>
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
                  <div className='temp-content'>content</div>
                </div>
              </div>
              <div className='color-warning-yellow g-radius-8 p-x-16 p-y-8 fn12 m-t-24'>
                <span className='icon iconfont icon-dengpao fn12 m-r-2'></span>
                如果您的短信属于群发类型，晚间22:00之后提交的群发请求，为避免对用户造成骚扰，可能会被延迟到隔天的早间8:00开始发送，未经您的用户允许，请勿发送营销类相关短信内容。
              </div>
            </div>
            <div className='right'>
              <Form
                name='create-send-form'
                className='create-send-form'
                form={form}
                layout='vertical'
                autoComplete='off'
                validateTrigger='onBlur'
                onFieldsChange={onFieldsChange}
                onFinish={onFinish}>
                <Row gutter={24}>
                  <Col span={24}>
                    <Flex align='center'>
                      <div className='color-btn g-radius-50 step-number fx-center-center color fn16'>
                        1
                      </div>
                      <span className='fw-500 m-l-8'>任务</span>
                    </Flex>
                    <Divider className='line m-y-12'></Divider>
                  </Col>
                  <Col span={24} lg={12}>
                    <Form.Item label='任务名称（选填）' name='name'>
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
                        <Col
                          span={24}
                          sm={12}
                          lg={8}
                          className='fx-center-center'>
                          <div className='p-t-16'>
                            <div className='menu-1'>短信菜单1</div>
                            <div className='menu-2-wrap p-l-12 p-t-4'>
                              <div className='menu-2'>回复消息1</div>
                              <div className='menu-2'>回复消息1</div>
                              <div className='menu-2'>回复消息1</div>
                              <div className='menu-2'>回复消息1</div>
                            </div>
                          </div>
                        </Col>
                        <Col
                          span={24}
                          sm={12}
                          lg={8}
                          className='fx-center-center'>
                          <div className='p-t-16'>
                            <div className='menu-1'>短信菜单2</div>
                            <div className='menu-2-wrap p-l-12 p-t-4'>
                              <div className='menu-2'>回复消息1</div>
                              <div className='menu-2'>回复消息1</div>
                              <div className='menu-2'>回复消息1</div>
                              <div className='menu-2'>回复消息1</div>
                            </div>
                          </div>
                        </Col>
                        <Col
                          span={24}
                          sm={12}
                          lg={8}
                          className='fx-center-center'>
                          <div className='p-t-16'>
                            <div className='menu-1'>短信菜单3</div>
                            <div className='menu-2-wrap p-l-12 p-t-4'>
                              <div className='menu-2'>回复消息1</div>
                              <div className='menu-2'>回复消息1</div>
                              <div className='menu-2'>回复消息1</div>
                              <div className='menu-2'>回复消息1</div>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </Col>

                  <Col span={24}>
                    <Flex
                      align='center'
                      className={`${showChatbotMenu ? 'm-t-16' : ''}`}>
                      <div className='color-btn g-radius-50 step-number fx-center-center color fn16 '>
                        2
                      </div>
                      <span className='fw-500 m-l-8'>添加联系人</span>
                    </Flex>
                    <Divider className='line m-y-12'></Divider>
                  </Col>
                  <Col span={24}>
                    <ContactsTabs name='contacts' form={form} />
                  </Col>

                  <Col span={24}>
                    <Flex
                      align='center'
                      className={`${showChatbotMenu ? 'm-t-16' : ''}`}>
                      <div className='color-btn g-radius-50 step-number fx-center-center color fn16 '>
                        3
                      </div>
                      <span className='fw-500 m-l-8'>配置</span>
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
                        label=''
                        name='timer'
                        className='m-b-0'
                        valuePropName='checked'>
                        <Switch size='small' />
                      </Form.Item>
                      <span>定时发送</span>
                    </Space>
                  </Col>

                  <ProFormDependency name={['timer']}>
                    {({ timer }) => {
                      return (
                        <>
                          {timer && (
                            <Col span={24}>
                              <Form.Item label='' name='time' className='m-b-0'>
                                <DatePicker
                                  showTime
                                  needConfirm={false}
                                  placeholder='请选择定时发送时间'
                                />
                              </Form.Item>
                              <div className='color-warning-red g-radius-8 p-x-16 p-y-8 fn12 m-t-24'>
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
                                    colorPrimary: timer ? '#f19d25' : '#1764ff',
                                  },
                                }}>
                                <Button type='primary' htmlType='submit'>
                                  {timer ? '提交定时任务' : '提交发送任务'}
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
