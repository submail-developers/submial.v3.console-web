import {
  Form,
  Image,
  Space,
  Row,
  Col,
  Button,
  Input,
  Select,
  Flex,
  ColorPicker,
  Radio,
  App,
  ConfigProvider,
} from 'antd'
import type { UploadFile } from 'antd'
import { debounce } from 'lodash'
import { useState, useEffect } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { changeBreadcrumbItem } from '@/store/reducers/breadcrumb'
import { useAppDispatch } from '@/store/hook'
import utils from '@/utils/formRules'
import {
  getChatbot,
  getIndustry,
  uploadCustomerFile,
  saveChatbot,
  temporarySaveChatbot,
} from '@/api'
import { API } from 'apis'
import PageContent from '@/components/pageContent'
import UploadLogo from './logo'
import UploadBg from './bg'
import UploadAttachment from './attachment'
import {
  actualIssueIndustryOptions,
  defaultAvatarSrc,
} from '@/pages/rcs/chatbot/type'
import bannerImg from '@/assets/rcs/account/banner.png'

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
  const { chatbotId } = useParams()
  const [logoFile, setLogoFile] = useState<UploadFile>(null)
  const [logoSrc, setLogoSrc] = useState<string>('')
  const [bgFile, setBgFile] = useState<UploadFile>(null)
  const [bgSrc, setBgSrc] = useState<string>('')
  const [attachmentFile, setAttachmentFile] = useState<UploadFile>()
  const [attachmentSrc, setattachmentSrc] = useState<string>('')
  const [loading, setloading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)
  const [industryList, setIndustryList] = useState([])
  const [color, setColor] = useState('#ffffff')
  const navigate = useNavigate()
  const [status, setStatus] = useState('0')

  // 获取chtbot
  const getDetail = async () => {
    try {
      const res = await getChatbot({
        page: 1,
        limit: 20,
        appid: chatbotId,
        status: 'all',
      })
      let detail: API.ChatbotItem = res.list[0]

      if (detail) {
        // 审核中禁止编辑
        if (['3', '4'].includes(detail.status)) {
          message.error({
            content: 'Chatbot审核中，禁止编辑',
            duration: 4,
            onClose: () => {
              nav(-1)
            },
          })
          return
        }
        setStatus(detail.status)
        form.resetFields()
        form.setFieldsValue({
          ...detail,
          category: detail.category ? detail.category.split(',') : [],
          actualIssueIndustry: detail.actualIssueIndustry || undefined,
          attachment: detail.attachment
            ? {
                file: null,
                fileList: [
                  {
                    uid: '0',
                    name: '证明材料',
                    status: 'done',
                    url: detail.attachment,
                  },
                ],
              }
            : undefined,
        })
        // logo
        if (detail.logo) {
          setLogoSrc(detail.logo)
        }
        // bg
        if (detail.backgroundImage) {
          setBgSrc(detail.backgroundImage)
        }

        // 证明材料回显
        if (detail.attachment) {
          setattachmentSrc(detail.attachment)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  // 获取行业类型
  const getIndustryList = async () => {
    try {
      const res = await getIndustry()
      let newArr = res.data.map((item) => {
        let { children, ...rest } = item
        return rest
      })
      setIndustryList(newArr)
    } catch (error) {}
  }

  // 修改logo文件
  const onChangeLogoFile = (file: UploadFile, src: string) => {
    setLogoFile(file)
    setLogoSrc(src)
  }
  const onDelLogoFile = () => {
    setLogoFile(null)
    setLogoSrc(defaultAvatarSrc)
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
  // 修改证明材料文件
  const onChangeAttachmentFile = (file: UploadFile) => {
    setAttachmentFile(file)
    form.setFieldValue('attachment', file)
  }
  const onDelAttachmentFile = () => {
    setAttachmentFile(null)
    setattachmentSrc('')
    form.setFieldValue('attachment', undefined)
  }

  const changeName = (e) => {
    let value = e.target.value
    form.setFieldValue('autograph', value)
  }

  // 颜色
  const handleColorChange = debounce((value) => {
    let color = value.toHexString()
    setColor(color)
  }, 100)
  useEffect(() => {
    getIndustryList()
  }, [])
  useEffect(() => {
    if (chatbotId == '0') {
      dispatch(
        changeBreadcrumbItem({
          index: 3,
          title: '申请Chatbot',
        }),
      )
    } else {
      getDetail()
      dispatch(
        changeBreadcrumbItem({
          index: 3,
          title: '编辑Chatbot',
        }),
      )
    }
  }, [chatbotId])

  // 上传头像、背景图、证明材料
  const uploadFiles = async () => {
    try {
      let proms = []
      if (logoFile) {
        proms.push(
          uploadCustomerFile({
            file: logoFile,
            type: '2',
          }),
        )
      } else {
        proms.push(Promise.resolve({ path: logoSrc || defaultAvatarSrc }))
      }
      if (bgFile) {
        proms.push(
          uploadCustomerFile({
            file: bgFile,
            type: '3',
          }),
        )
      } else {
        proms.push(Promise.resolve({ path: bgSrc }))
      }
      if (attachmentFile) {
        proms.push(
          uploadCustomerFile({
            file: attachmentFile,
            type: '5',
          }),
        )
      } else {
        proms.push(Promise.resolve({ path: attachmentSrc }))
      }
      let [{ path: logoPath }, { path: bgPath }, { path: attachmentPath }] =
        await Promise.all(proms)
      return {
        logoPath,
        bgPath,
        attachmentPath,
      }
    } catch (error) {}
  }

  // 保存
  const save = async () => {
    setSaveLoading(true)
    try {
      const formvalues = await form.getFieldsValue()
      const { logoPath, bgPath, attachmentPath } = await uploadFiles()

      let params = {
        ...formvalues,
        appid: chatbotId,
        logo: logoPath,
        backgroundImage: bgPath,
        attachment: attachmentPath,
        colour: color,
        category: formvalues.category?.join(',') || '',
      }

      const res = await temporarySaveChatbot(params)
      setSaveLoading(false)
      if (res.status == 'success') {
        message.success('保存成功！')
        navigate('/console/rcs/chatbot/index', { replace: true })
      }
    } catch (error) {
      console.log(error, 'eee')
      setSaveLoading(false)
    }
  }
  // 提交
  const submit = async () => {
    try {
      setloading(true)
      const formvalues = await form.validateFields()
      const { logoPath, bgPath, attachmentPath } = await uploadFiles()

      let params = {
        ...formvalues,
        appid: chatbotId,
        logo: logoPath,
        backgroundImage: bgPath,
        attachment: attachmentPath,
        colour: color,
        category: formvalues.category.join(','),
      }
      const res = await saveChatbot(params)
      if (res.status == 'success') {
        message.success('保存成功！')
        navigate('/console/rcs/chatbot/index', { replace: true })
      }

      setloading(false)
    } catch (error) {
      setloading(false)
    }
  }

  return (
    <PageContent xxl={970} extClass='create-chatbot-page'>
      <Form
        form={form}
        className='create-chatbot-form'
        name='craete-chatbot'
        layout='vertical'
        autoComplete='off'
        validateTrigger='onChange'
        initialValues={{
          providerSwitchCode: '0',
          colour: '#ffffff',
        }}>
        <div className='form-header'>
          <Image src={bannerImg} preview={false}></Image>
          <div className='fn22 fw-500 form-con'>
            {chatbotId == '0' ? '申请' : '编辑'} Chatbot 账户
            <div className='fn14 title-desc'>
              <span>请填写下列表单，然后完成申请</span>
            </div>
          </div>
        </div>
        <div className='form-group'>
          <div className='form-group-title'>基本信息</div>
          <Row style={{ marginTop: '16px' }} gutter={24}>
            <Col span={24} xl={12}>
              <Form.Item
                label='Chatbot 名称'
                extra='该名称会被用做【签名】使用，建议使用公司名、商标名或关联公司名称'
                name='name'
                rules={[
                  { required: true, message: '请输入Chatbot 名称' },
                  { max: 20, message: '最多20个字符' },
                  {
                    validator: utils.validateEmoji,
                  },
                  {
                    validator: utils.validateDoubleQuotation,
                  },
                  {
                    validator: utils.validateBackslash,
                  },
                  {
                    validator: utils.validateNoSpace,
                  },
                ]}>
                <Input
                  placeholder='不可携带英文双引号、\、emoji，不超过20个字符'
                  max={20}
                  onChange={changeName}
                />
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
          </Row>
          <Row gutter={24}>
            <Col span={24} xl={12}>
              <Form.Item
                label='行业类型'
                name='category'
                required
                rules={[{ required: true }]}>
                <Select
                  mode='multiple'
                  allowClear
                  style={{ width: '100%' }}
                  placeholder='请选择'
                  fieldNames={{ value: 'label' }}
                  options={industryList}
                />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                label='下发行业'
                name='actualIssueIndustry'
                required
                rules={[{ required: true }]}>
                <Select
                  placeholder='请选择'
                  fieldNames={{
                    label: 'label',
                    value: 'value',
                  }}
                  options={actualIssueIndustryOptions}
                />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                label='签名(针对不支持5G消息的终端，在每条回落消息中携带此内容)'
                name='autograph'
                required
                rules={[{ max: 20 }]}>
                <Input placeholder='' disabled />
              </Form.Item>
            </Col>

            {/* 证明材料 */}
            <Col span={24} xl={12}>
              <Form.Item label='服务方名称' name='provider'>
                <Input placeholder='用于 Chatbot 用户电话咨询' />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                label='服务方电话'
                name='callback'
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
                name='website'
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
                name='tcPage'
                rules={[
                  {
                    validator: utils.validateUrl,
                  },
                ]}>
                <Input placeholder='https://' />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item label='服务方邮箱' name='email'>
                <Input placeholder='' />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label='提供者开关'
                name='providerSwitchCode'
                required
                rules={[{ required: true }]}>
                <Radio.Group>
                  <Space>
                    <Radio value='1'>显示</Radio>
                    <Radio value='0'>不显示</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label='服务方详细地址' name='address'>
                <Input placeholder='' />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item style={{ marginBottom: 0 }}>
                <Row gutter={24}>
                  <Col span={24} xl={12}>
                    <Form.Item name='colour' label='主题颜色'>
                      <ColorPicker
                        disabledAlpha={true}
                        showText={showText}
                        onChange={handleColorChange}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={24} xl={12}>
                    <UploadBg
                      bgFile={bgFile}
                      bgSrc={bgSrc}
                      onChangeFile={onChangeBgFile}
                      onDelFile={onDelBgFile}
                    />
                  </Col>
                </Row>
              </Form.Item>
            </Col>
            <Col span={24}>
              <UploadAttachment
                attachmentSrc={attachmentSrc}
                onChangeFile={onChangeAttachmentFile}
                onDelFile={onDelAttachmentFile}
              />
            </Col>
            <Col span={24}>
              <Form.Item
                label='Chatbot 调试白名单'
                name='debugWhiteAddress'
                required
                rules={[{ required: true }]}
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
            <Col span={24}>
              <Form.Item label='IP限制（0.0.0.0表示无限制）' name='bind'>
                <TextArea
                  placeholder='默认无限制，多个IP地址以英文逗号拼接'
                  autoSize={{ minRows: 3, maxRows: 3 }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label='服务描述' name='description'>
                <TextArea
                  placeholder='机器人描述信息'
                  autoSize={{ minRows: 3, maxRows: 3 }}
                />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className='form-group' style={{ paddingBottom: '24px' }}>
          <Flex justify='space-between'>
            {status == '0' ? (
              <ConfigProvider
                theme={{
                  token: {
                    colorPrimary: '#f19d25',
                    colorPrimaryHover: '#e9ae5e',
                  },
                }}>
                <Button
                  className='color-status-waiting'
                  type='primary'
                  size='large'
                  loading={saveLoading}
                  style={{ width: 120 }}
                  onClick={save}>
                  保存
                </Button>
              </ConfigProvider>
            ) : (
              <div></div>
            )}
            <Flex gap={12} justify='flex-end'>
              <NavLink to='/console/rcs/chatbot/index' replace>
                <Button
                  className='cancle'
                  type='primary'
                  size='large'
                  style={{ width: 120, marginRight: '12px' }}>
                  取消
                </Button>
              </NavLink>
              <Button
                disabled={['3', '4'].includes(status)}
                loading={loading}
                type='primary'
                size='large'
                style={{ width: 120 }}
                onClick={submit}>
                提交审核
              </Button>
            </Flex>
          </Flex>
        </div>
      </Form>
    </PageContent>
  )
}
