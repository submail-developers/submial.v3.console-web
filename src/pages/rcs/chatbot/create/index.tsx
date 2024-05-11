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
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { changeBreadcrumbItem } from '@/store/reducers/breadcrumb'
import { useAppDispatch } from '@/store/hook'
import utils from '@/utils/formRules'
import {
  getChatbot,
  updateChatbot,
  getIndustry,
  delCustomerFile,
  uploadCustomerFile,
  createChatbot,
} from '@/api'
import { API } from 'apis'
import PageContent from '@/components/pageContent'
import UploadLogo from './logo'
import UploadBg from './bg'
import UploadAttachment from './attachment'
import { useSearchParams } from 'react-router-dom'

import jiqiren from '@/assets/rcs/aco1.png'

import './index.scss'
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
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const { chatbotId } = useParams()
  const [logoFile, setLogoFile] = useState<UploadFile>(null)
  const [logoSrc, setLogoSrc] = useState<string>('')
  const [bgFile, setBgFile] = useState<UploadFile>(null)
  const [bgSrc, setBgSrc] = useState<string>('')
  const [attachmentFile, setAttachmentFile] = useState<UploadFile>(null)
  const [attachmentSrc, setAttachmentSrc] = useState<string>('')
  const [params] = useSearchParams()
  const id = params.get('id')
  const [loading, setloading] = useState(false)
  const [industryList, setIndustryList] = useState([])
  const companyLogoPathRef = useRef('')
  const [color, setColor] = useState('#ffffff')

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
        // setDetail(res.list[0])
        form.resetFields()
        form.setFieldsValue(res.list[0])
      }
    } catch (error) {}
  }
  useEffect(() => {
    if (id) {
      getDetail()
    }
  }, [id])

  // const submit = async () => {
  //   const values = await form.getFieldsValue()
  //   message.success('创建成功', 4)
  //   nav('/console/rcs/chatbot/index', { replace: true })
  //   try {
  //     const formvalues = await form.getFieldsValue()
  //     let params = {
  //       ...formvalues,
  //       appid: id,
  //       category: '信息传输',
  //       provider: '上海赛邮云计算有限公司',
  //       description: '机器人描述',
  //     }
  //     console.log(params, '111')
  //     await updateChatbot(params)
  //     message.success('编辑成功！')
  //     setloading(false)
  //   } catch (error) {
  //     setloading(false)
  //   }
  // }

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

  // 实际下发行业
  const actualIssueIndustryOptions = [
    {
      value: '1',
      label: '党政军',
    },
    {
      value: '2',
      label: '民生',
    },
    {
      value: '3',
      label: '金融',
    },
    {
      value: '4',
      label: '物流',
    },
    {
      value: '5',
      label: '游戏',
    },
    {
      value: '6',
      label: '电商',
    },
    {
      value: '7',
      label: '微商（个人）',
    },
    {
      value: '8',
      label: '沿街商铺（中小）',
    },
    {
      value: '9',
      label: '企业（大型）',
    },
    {
      value: '10',
      label: '教育培训',
    },
    {
      value: '11',
      label: '房地产',
    },
    {
      value: '12',
      label: '医疗器械、药店',
    },
    {
      value: '13',
      label: '其他',
    },
  ]

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

      // res1 = await uploadCustomerFile({
      //   file: logoFile,
      //   type: '2',
      // })
      // res2 = await uploadCustomerFile({
      //   file: bgFile,
      //   type: '3',
      // })
      // res3 = await uploadCustomerFile({
      //   file: attachmentFile,
      //   type: '4',
      // })

      console.log(logoFile, '头像')

      // if (contractAccessoryPathRef.current) {
      //   if (fileList2[0].url != contractAccessoryPathRef.current) {
      //     delCustomerFile({
      //       path: contractAccessoryPathRef.current,
      //     })
      //     res2 = await uploadCustomerFile({
      //       file: fileList2[0],
      //       type: '1',
      //     })
      //   } else {
      //     res2['path'] = contractAccessoryPathRef.current
      //   }
      // } else {
      //   if (fileList2.length > 0) {
      //     res2 = await uploadCustomerFile({
      //       file: fileList2[0],
      //       type: '1',
      //     })
      //   }
      // }

      const formvalues = await form.getFieldsValue()

      let params = {
        ...formvalues,
        logo: (res1 && res1.path) || '',
        backgroundImage: (res2 && res2.path) || '',
        attachment: (res3 && res3.path) || '',
        colour: color,
      }
      console.log(params, '????')
      // let params = {
      //   ...formvalues,
      //   businessType: formvalues.businessType[0],
      //   industryTypeCode: formvalues.businessType[1],
      //   contractRenewStatus: formvalues.contractRenewStatus.value,
      //   companyLogo: (res1 && res1.path) || '',
      //   contractAccessory: (res2 && res2.path) || '',
      //   contractEffectiveDate:
      //     formvalues.contractEffectiveDate.format('YYYY-MM-DD'),
      //   contractExpiryDate: formvalues.contractExpiryDate.format('YYYY-MM-DD'),
      //   contractRenewDate: formvalues.contractRenewDate.format('YYYY-MM-DD'),
      // }

      // const res = await saveupForCspAccount(params)
      // if (res) {
      //   message.success('保存成功！')
      // navigate('/console/rcs/account/index')
      // }

      setloading(false)
    } catch (error) {
      console.log(error)
      setloading(false)
    }
  }
  // 提交
  const submit = async () => {
    try {
      const values = await form.validateFields()
      let res1: FilePath = {}, //头像
        res2: FilePath = {}, //背景图
        res3: FilePath = {} //营业执照

      console.log(bgFile, 'bgFile')
      if (logoFile) {
        res1 = await uploadCustomerFile({
          file: logoFile,
          type: '2',
        })
      } else {
        res1['path'] =
          'https://libraries.mysubmail.com/public/7405f1e8b0b2be6bccf68741d74dc339/images/07ff77d1325f947e27c1fd62ef468813.png'
      }

      // if (bgFile) {
      //   res2 = await uploadCustomerFile({
      //     file: bgFile,
      //     type: '3',
      //   })
      // } else {
      //   res2['path'] = ''
      // }

      // if (bgFile) {
      //   res3 = await uploadCustomerFile({
      //     file: bgFile,
      //     type: '4',
      //   })
      // } else {
      //   res3['path'] = ''
      // }

      // res1 = await uploadCustomerFile({
      //   file: logoFile,
      //   type: '2',
      // })
      // res2 = await uploadCustomerFile({
      //   file: bgFile,
      //   type: '3',
      // })
      // res3 = await uploadCustomerFile({
      //   file: attachmentFile,
      //   type: '4',
      // })

      // if (contractAccessoryPathRef.current) {
      //   if (fileList2[0].url != contractAccessoryPathRef.current) {
      //     delCustomerFile({
      //       path: contractAccessoryPathRef.current,
      //     })
      //     res2 = await uploadCustomerFile({
      //       file: fileList2[0],
      //       type: '1',
      //     })
      //   } else {
      //     res2['path'] = contractAccessoryPathRef.current
      //   }
      // } else {
      //   if (fileList2.length > 0) {
      //     res2 = await uploadCustomerFile({
      //       file: fileList2[0],
      //       type: '1',
      //     })
      //   }
      // }

      const formvalues = await form.getFieldsValue()

      let params = {
        ...formvalues,
        logo: res1 && res1.path,
        backgroundImage: (res2 && res2.path) || '',
        attachment: (res3 && res3.path) || '',
        colour: color,
        category: formvalues.category.join(','),
      }
      // console.log(params, '????')

      const res = await createChatbot(params)
      // if (res) {
      //   message.success('保存成功！')
      // navigate('/console/rcs/chatbot/index', { replace: true })
      // }

      setloading(false)
    } catch (error) {
      // console.log(error)
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
          providerSwitchCode: '1',
        }}>
        <div className='form-header'>
          <Image src={jiqiren} preview={false}></Image>
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
                    <Radio value={1}>显示</Radio>
                    <Radio value={0}>不显示</Radio>
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
                  placeholder='无限制    多个IP地址以英文逗号拼接'
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
          <Flex justify='flex-left' style={{ justifyContent: 'space-between' }}>
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
                style={{ width: 120 }}
                onClick={save}>
                保存
              </Button>
            </ConfigProvider>
            <Space>
              <NavLink to='/console/rcs/chatbot/index'>
                <Button
                  className='cancle'
                  type='primary'
                  size='large'
                  style={{ width: 120, marginRight: '12px' }}
                  // onClick={submit}
                >
                  取消
                </Button>
              </NavLink>
              <Button
                type='primary'
                size='large'
                style={{ width: 120 }}
                onClick={submit}>
                提交审核
              </Button>
            </Space>
          </Flex>
        </div>
      </Form>
    </PageContent>
  )
}
