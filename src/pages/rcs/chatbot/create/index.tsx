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
  Cascader,
  App,
  ConfigProvider,
} from 'antd'
import type { GetProp, UploadFile, UploadProps, RadioChangeEvent } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import { useState, useRef, useEffect } from 'react'
import {
  useParams,
  NavLink,
  useNavigate,
  useSearchParams,
} from 'react-router-dom'
import { changeBreadcrumbItem } from '@/store/reducers/breadcrumb'
import { useAppDispatch } from '@/store/hook'
import utils from '@/utils/formRules'
import {
  getChatbot,
  updateChatbot,
  getIndustry,
  delCustomerFile,
  uploadCustomerFile,
  saveChatbot,
  temporarySaveChatbot,
} from '@/api'
import { API } from 'apis'
import PageContent from '@/components/pageContent'
import UploadLogo from './logo'
import UploadBg from './bg'
import UploadAttachment from './attachment'
import { actualIssueIndustryOptions } from '@/pages/rcs/chatbot/type'

import bannerImg from '@/assets/rcs/account/banner.png'

import './index.scss'
import { name } from 'dayjs/locale/*'
interface DataType extends API.GetChatbotListItem {}
type FilePath = {
  path?: string
}
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
  const [attachmentFileInfo, setAttachmentFileInfo] = useState<UploadFile[]>([])
  const [params] = useSearchParams()
  const id = params.get('id')
  const [loading, setloading] = useState(false)
  const [industryList, setIndustryList] = useState([])
  const [color, setColor] = useState('#ffffff')
  const navigate = useNavigate()
  const [status, setStatus] = useState('0')
  const logoPathRef = useRef('')
  const backgroundImagePathRef = useRef('')
  const attachmentPathRef = useRef('')

  // 获取chtbot
  const getDetail = async () => {
    try {
      const res = await getChatbot({
        page: 1,
        limit: 20,
        appid: id,
        status: 'all',
      })

      if (res.list.length == 1) {
        setStatus(res.list[0].status)
        form.resetFields()
        form.setFieldsValue({
          ...res.list[0],
          category: res.list[0].category ? res.list[0].category.split(',') : [],
          logo: setLogoSrc(res.list[0].logo),
          backgroundImage: setBgSrc(res.list[0].backgroundImage),
        })
        // logo
        if (res.list[0].logo) {
          logoPathRef.current = res.list[0].logo
        }
        // bg
        if (res.list[0].backgroundImage) {
          backgroundImagePathRef.current = res.list[0].backgroundImage
        }

        // 证明材料回显
        if (res.list[0].attachment) {
          attachmentPathRef.current = res.list[0].attachment
          setAttachmentFileInfo([
            {
              uid: '',
              name: '证明材料',
              url: res.list[0].attachment,
            },
          ])
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
    setLogoSrc('')
  }

  // 修改证明材料文件
  const onChangeAttachmentFile = (files: UploadFile[]) => {
    setAttachmentFileInfo(files)
  }
  const onDelAttachmentFile = () => {
    setAttachmentFileInfo([])
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

  // 颜色
  const handleColorChange = (value) => {
    let color = value.toHexString()
    setColor(color)
  }
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
  useEffect(() => {
    if (form) {
      form.setFieldsValue({
        chatbotId: '106108281498',
        cspToken: '上海赛邮云计算有限公司',
        cspId: '上海鼎邮云计算有限公司',
      })
    }
  }, [form])

  // 保存
  const save = async () => {
    try {
      let res1: FilePath = {}, //头像
        res2: FilePath = {}, //背景图
        res3: FilePath = {} //营业执照
      if (logoFile) {
        delCustomerFile({
          path: logoPathRef.current,
        })
        res1 = await uploadCustomerFile({
          file: logoFile,
          type: '2',
        })
      } else {
        res1['path'] = logoPathRef.current
      }

      if (bgFile) {
        delCustomerFile({
          path: backgroundImagePathRef.current,
        })
        res2 = await uploadCustomerFile({
          file: bgFile,
          type: '3',
        })
      } else {
        res2['path'] = ''
      }

      if (
        attachmentFileInfo.length > 0 &&
        attachmentFileInfo[0]?.url != attachmentPathRef.current
      ) {
        delCustomerFile({
          path: attachmentPathRef.current,
        })
        res3 = await uploadCustomerFile({
          file: attachmentFileInfo[0],
          type: '4',
        })
      } else {
        res3['path'] = attachmentPathRef.current
      }

      const formvalues = await form.getFieldsValue()
      let params = {
        ...formvalues,
        appid: id,
        logo: (res1 && res1.path) || '',
        backgroundImage: (res2 && res2.path) || '',
        attachment: (res3 && res3.path) || '',
        colour: color,
        category: formvalues.category.join(','),
      }

      const res = await temporarySaveChatbot(params)
      if (res) {
        message.success('保存成功！')
        navigate('/console/rcs/chatbot/index', { replace: true })
      }

      setloading(false)
    } catch (error) {
      setloading(false)
    }
  }
  // 提交
  const submit = async () => {
    try {
      setloading(true)
      const formvalues = await form.validateFields()
      let res1: FilePath = {}, //头像
        res2: FilePath = {}, //背景图
        res3: FilePath = {} //营业执照

      if (logoFile) {
        res1 = await uploadCustomerFile({
          file: logoFile,
          type: '2',
        })
      } else {
        res1['path'] =
          'https://libraries.mysubmail.com/public/7405f1e8b0b2be6bccf68741d74dc339/images/07ff77d1325f947e27c1fd62ef468813.png'
      }

      if (bgFile) {
        res2 = await uploadCustomerFile({
          file: bgFile,
          type: '3',
        })
      } else {
        res2['path'] = ''
      }

      if (attachmentFileInfo.length > 0) {
        res3 = await uploadCustomerFile({
          file: bgFile,
          type: '4',
        })
      } else {
        res3['path'] = ''
      }

      let params = {
        ...formvalues,
        appid: id,
        logo: res1 && res1.path,
        backgroundImage: (res2 && res2.path) || '',
        attachment: (res3 && res3.path) || '',
        colour: color,
        category: formvalues.category.join(','),
      }
      const res = await saveChatbot(params)
      if (res) {
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
        initialValues={{
          providerSwitchCode: '0',
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
                ]}>
                <Input
                  placeholder='不可携带英文双引号、\、emoji，不超过20个字符'
                  max={20}
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
                  filterOption={(input, option) =>
                    (option?.label + option.value ?? '')
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
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
                <Input placeholder='不超过 20 个字符' />
              </Form.Item>
            </Col>

            {/* 证明材料 */}
            <Col span={24} xl={12}>
              <Form.Item
                label='服务方名称'
                name='provider'
                validateTrigger='onBlur'>
                <Input placeholder='用于 Chatbot 用户电话咨询' />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                label='服务方电话'
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
                fileList={attachmentFileInfo}
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
              <Form.Item label='IP限制' name='bind' validateTrigger='onBlur'>
                <TextArea
                  placeholder='默认无限制，多个IP地址以英文逗号拼接'
                  autoSize={{ minRows: 3, maxRows: 3 }}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label='服务描述'
                name='description'
                validateTrigger='onBlur'>
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
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#f19d25',
                  colorPrimaryHover: '#e9ae5e',
                },
              }}>
              {status == '0' || status == '2' ? (
                <Button
                  className='color-status-waiting'
                  type='primary'
                  size='large'
                  style={{ width: 120 }}
                  onClick={save}>
                  保存
                </Button>
              ) : (
                <div></div>
              )}
            </ConfigProvider>
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
