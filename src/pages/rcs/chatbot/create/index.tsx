import {
  Form,
  Image,
  Space,
  Row,
  Col,
  Button,
  Input,
  Select,
  Upload,
  Flex,
  ColorPicker,
  Radio,
  Divider,
  InputNumber,
  App,
} from 'antd'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import { useState, useRef, useEffect } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { changeBreadcrumbItem } from '@/store/reducers/breadcrumb'
import { useAppDispatch } from '@/store/hook'
import utils from '@/utils/formRules'

import PageContent from '@/components/pageContent'
import UploadLogo from './logo'
import UploadBg from './bg'
import UploadAttachment from './attachment'

import jiqiren from '@/assets/rcs/jiqiren.png'

import './index.scss'

const { TextArea } = Input

const Extra = (props) => {
  return <div style={{ marginTop: '8px' }}>{props.children}</div>
}

const showText = (color) => <>{color.metaColor.toHexString()}</>

export default function Fn() {
  const nav = useNavigate()
  const { message } = App.useApp()
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const { chatbotId } = useParams()
  const [logoFile, setLogoFile] = useState<UploadFile>(null)
  const [logoSrc, setLogoSrc] = useState<string>('')
  const [bgFile, setBgFile] = useState<UploadFile>(null)
  const [bgSrc, setBgSrc] = useState<string>('')
  const [attachmentFile, setAttachmentFile] = useState<UploadFile>(null)
  const [attachmentSrc, setAttachmentSrc] = useState<string>('')

  const submit = async () => {
    const values = await form.getFieldsValue()
    message.success('创建成功', 4)
    nav('/console/rcs/chatbot/index', { replace: true })
  }

  const handleUpload = () => {}

  const props: UploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file])

      return false
    },
    fileList,
  }

  // 修改logo文件
  const onChangeLogoFile = (file: UploadFile, src: string) => {
    setLogoFile(file)
    setLogoSrc(src)
  }
  const onDelLogoFile = () => {
    setLogoFile(null)
    setLogoSrc('')
  }

  // 修改证明材料文件
  const onChangeAttachmentFile = (file: UploadFile, src: string) => {
    setAttachmentFile(file)
    setAttachmentSrc(src)
  }
  const onDelAttachmentFile = () => {
    setAttachmentFile(null)
    setAttachmentSrc('')
  }

  // 修改背景文件
  const onChangeBgFile = (file: UploadFile, src: string) => {
    setBgFile(file)
    setBgSrc(src)
  }
  const onDelBgFile = () => {
    setBgFile(null)
    setBgSrc('')
  }

  useEffect(() => {
    if (chatbotId == '0') {
      dispatch(
        changeBreadcrumbItem({
          index: 3,
          title: '申请Chatbot',
        }),
      )
    } else {
      dispatch(
        changeBreadcrumbItem({
          index: 3,
          title: '编辑Chatbot',
        }),
      )
    }
  }, [chatbotId])
  useEffect(() => {
    if (form) {
      form.setFieldsValue({
        chatbotId: '106108281498',
        cspToken: '上海赛邮云计算有限公司',
        cspId: '上海鼎邮云计算有限公司',
      })
    }
  }, [form])

  return (
    <PageContent xxl={970} extClass='create-chatbot-page'>
      <Form
        form={form}
        className='create-chatbot-form'
        name='craete-chatbot'
        layout='vertical'
        autoComplete='off'>
        <Space size={16} className='form-header fx-y-center'>
          <div>
            <Image src={jiqiren} width={32} height={32} preview={false}></Image>
          </div>
          <div>
            <div className='fn20 fw-500'>
              {chatbotId == '0' ? '申请' : '编辑'} Chatbot 账户
            </div>
            <span>请填写下列表单，然后完成申请</span>
          </div>
        </Space>
        <div className='form-group'>
          <div className='form-group-title'>基本信息</div>
          <Row style={{ marginTop: '16px' }} gutter={24}>
            <Col span={24} xl={12}>
              <Form.Item
                label='Chatbot 名称'
                required
                name='name'
                rules={[
                  { required: true },
                  { max: 20 },
                  {
                    validator: utils.validateEmoji,
                  },
                  {
                    validator: utils.validateDoubleQuotation,
                  },
                  {
                    validator: utils.validateBackslash,
                  },
                ]}
                extra={
                  <Extra>
                    不可携带英文双引号、\、emoji，Chatbot名称不能为空
                  </Extra>
                }>
                <Input placeholder='不超过 20 个字符' max={20} />
              </Form.Item>
            </Col>
            {/* 头像Logo */}
            <Col span={24} xl={12}>
              <UploadLogo
                logoFile={logoFile}
                logoSrc={logoSrc}
                onChangeFile={onChangeLogoFile}
                onDelFile={onDelLogoFile}
              />
            </Col>
            <Col span={24} xl={12}>
              <Form.Item label='服务代码' required name='serviceCode'>
                <Select
                  placeholder='请选择'
                  options={[
                    { value: 'jack', label: 'Jack' },
                    { value: 'lucy', label: 'Lucy' },
                    { value: 'Yiminghe', label: 'yiminghe' },
                    { value: 'disabled', label: 'Disabled', disabled: true },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ xl: 24, sm: 12, xs: 12 }}>
            <Col span={11} xl={6}>
              <Form.Item label='Chatbot ID' required name='chatbotId'>
                <Input placeholder='' disabled />
              </Form.Item>
            </Col>
            <Col span={13} xl={18}>
              <Form.Item label=' ' name='id2' rules={[{ max: 20 }]}>
                <Input placeholder='不超过 20 个字符' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={24} xl={12}>
              <Form.Item label='行业类型' name='actualIssueIndustry' required>
                <Select
                  placeholder='请选择'
                  options={[
                    { value: 'jack', label: 'Jack' },
                    { value: 'lucy', label: 'Lucy' },
                    { value: 'Yiminghe', label: 'yiminghe' },
                    { value: 'disabled', label: 'Disabled', disabled: true },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                label='签名(针对不支持5G消息的终端，在每条回落消息中携带此内容)'
                name='autograph'
                required
                rules={[{ max: 20 }]}>
                <Input placeholder='不超过 20 个字符' />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                label={
                  <Space>
                    <span>关联的CSP</span>
                    <NavLink to={''}> CSP平台功能介绍</NavLink>
                  </Space>
                }
                name='cspToken'>
                <Input placeholder='' disabled />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item label='实际下发的CSP' name='cspId'>
                <Input placeholder='' disabled />
              </Form.Item>
            </Col>
            {/* 证明材料 */}
            <Col span={24}>
              <UploadAttachment
                attachmentFile={attachmentFile}
                attachmentSrc={attachmentSrc}
                onChangeFile={onChangeAttachmentFile}
                onDelFile={onDelAttachmentFile}
              />
            </Col>
            <Col span={24}>
              <Form.Item
                label='Chatbot 调试白名单'
                name='debugWhiteAddress'
                validateTrigger='onBlur'
                required
                rules={[
                  {
                    validator: utils.validateMobiles,
                  },
                ]}
                extra={
                  <Extra>
                    <div>1、最多录入20个调试手机号码，用英文逗号隔开</div>
                    <div>2、用于实际测试Chatbot的消息接收和发送</div>
                  </Extra>
                }>
                <TextArea
                  placeholder=''
                  autoSize={{ minRows: 3, maxRows: 3 }}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>
        <Divider style={{ margin: '0' }} />

        <div className='form-group'>
          <div className='form-group-title'>更多信息</div>
          <Row gutter={24} style={{ marginTop: '16px' }}>
            <Col span={24} xl={12}>
              <Form.Item
                label='服务方电话'
                required
                name='callback'
                validateTrigger='onBlur'
                rules={[
                  {
                    validator: utils.validateNoChinese,
                  },
                ]}>
                <Input placeholder='用于 Chatbot 用户电话咨询' />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                label='服务方官网'
                required
                name='website'
                validateTrigger='onBlur'
                rules={[
                  {
                    validator: utils.validateUrl,
                  },
                ]}>
                <Input placeholder='https://' />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                label='服务条款链接'
                required
                name='tcPage'
                validateTrigger='onBlur'
                rules={[
                  {
                    validator: utils.validateUrl,
                  },
                ]}>
                <Input placeholder='https://' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='服务方地址' name='address'>
                <Input placeholder='不能录入中英文中括号(【】[])' />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                label='经度/纬度（经纬度需同时填写，最多支持小数点后3个数字）'
                style={{ marginBottom: 0 }}>
                <Row gutter={24}>
                  <Col span={12} xl={9}>
                    <Form.Item name={'lon'}>
                      <InputNumber
                        placeholder=''
                        className='w-100'
                        max={180}
                        min={-180}
                        step={0.001}
                        changeOnWheel={false}
                        controls={false}
                        prefix={<div>经度：</div>}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12} xl={9}>
                    <Form.Item name={'lat'}>
                      <InputNumber
                        placeholder=''
                        className='w-100'
                        max={90}
                        min={-90}
                        step={0.001}
                        type='number'
                        changeOnWheel={false}
                        controls={false}
                        prefix={<div>纬度：</div>}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item name='colour' label='气泡颜色'>
                <ColorPicker disabledAlpha={true} showText={showText} />
              </Form.Item>
            </Col>
            <Col span={24}>
              {/* <Form.Item
                label='背景图'
                name='backgroundImage'
                extra={
                  <Extra>支持的文件类型：png、jpg、jpeg，附件大小限20K</Extra>
                }>
                <Upload {...props}>
                  <Button icon={<UploadOutlined />}>上传</Button>
                </Upload>
              </Form.Item> */}

              <UploadBg
                bgFile={bgFile}
                bgSrc={bgSrc}
                onChangeFile={onChangeBgFile}
                onDelFile={onDelBgFile}
              />
            </Col>
            <Col span={24} xl={12}>
              <Form.Item label='短信端口号' required name='sms'>
                <Input placeholder='' />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                label='Chatbot 提供者'
                required
                name='providerSwitchCode'>
                <Radio.Group>
                  <Radio value={1}>显示</Radio>
                  <Radio value={2}>不显示</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label='服务描述'
                name='description'
                extra={
                  <Extra>不可携带英文双引号、\、emoj，不超过 166 个字符</Extra>
                }>
                <TextArea autoSize={{ minRows: 4, maxRows: 4 }} />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className='form-group' style={{ paddingBottom: '24px' }}>
          <Flex className='fx-x-between'>
            <div>
              <Button
                type='primary'
                size='large'
                style={{ width: 120 }}
                onClick={submit}
                className='save'>
                保存
              </Button>
            </div>
            <div>
              <Button
                className='cancle'
                type='primary'
                size='large'
                style={{ width: 120, marginRight: '12px' }}
                onClick={submit}>
                取消
              </Button>
              <Button
                type='primary'
                size='large'
                style={{ width: 120 }}
                onClick={submit}>
                提交
              </Button>
            </div>
          </Flex>
        </div>
      </Form>
    </PageContent>
  )
}
