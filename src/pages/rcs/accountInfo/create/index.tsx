import {
  Form,
  Space,
  Row,
  Col,
  Button,
  Input,
  Select,
  Upload,
  Flex,
  Cascader,
  Radio,
  ConfigProvider,
  DatePicker,
  App,
} from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useState, useRef, useEffect } from 'react'
import { useParams, NavLink, useNavigate } from 'react-router-dom'
import { changeBreadcrumbItem } from '@/store/reducers/breadcrumb'
import { useAppDispatch } from '@/store/hook'
import {
  getDicConfig,
  signupForCspAccount,
  uploadCustomerFile,
  saveupForCspAccount,
  delCustomerFile,
  getIndustry,
} from '@/api'
import dayjs from 'dayjs'
import { API } from 'apis'
import PageContent from '@/components/pageContent'
import './index.scss'

const { TextArea } = Input

const Extra = (props) => {
  return <div style={{ marginTop: '8px' }}>{props.children}</div>
}

interface Option {
  value: string | number
  label: string
  children?: Option[]
}
type FilePath = {
  path?: string
}

export default function Fn() {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  // 营业执照
  const [fileList, setFileList] = useState<UploadFile[]>([])
  // 合同
  const [fileList2, setFileList2] = useState<UploadFile[]>([])

  const [status, setStatus] = useState('')
  const contractAccessoryPathRef = useRef('')
  const companyLogoPathRef = useRef('')
  const { id } = useParams()
  const [loading, setloading] = useState(false)
  const [saveLoading, setsaveLoading] = useState(false)
  const [industryList, setIndustryList] = useState<API.IndustryItem[]>([])
  const { message } = App.useApp()
  const navigate = useNavigate()
  // 提交
  const submit = async () => {
    if (loading) return
    setloading(true)
    try {
      const formvalues = await form.validateFields()
      let res1: FilePath = {},
        res2: FilePath = {}

      if (contractAccessoryPathRef.current) {
        if (fileList2[0].url != contractAccessoryPathRef.current) {
          delCustomerFile({
            path: contractAccessoryPathRef.current,
          })
          res2 = await uploadCustomerFile({
            file: fileList2[0],
            type: '1',
          })
        } else {
          res2['path'] = contractAccessoryPathRef.current
        }
      } else {
        if (fileList2.length > 0) {
          res2 = await uploadCustomerFile({
            file: fileList2[0],
            type: '1',
          })
        }
      }

      if (companyLogoPathRef.current) {
        if (fileList[0].url != companyLogoPathRef.current) {
          delCustomerFile({
            path: companyLogoPathRef.current,
          })
          res1 = await uploadCustomerFile({
            file: fileList[0],
            type: '2',
          })
        } else {
          res1['path'] = companyLogoPathRef.current
        }
      } else {
        if (fileList.length > 0) {
          res2 = await uploadCustomerFile({
            file: fileList[0],
            type: '2',
          })
        }
      }

      let params = {
        ...formvalues,
        businessType: formvalues.businessType[0],
        industryTypeCode: formvalues.businessType[1],
        contractRenewStatus: formvalues.contractRenewStatus.value,
        companyLogo: (res1 && res1.path) || '',
        contractAccessory: res2 && res2.path,
        contractEffectiveDate:
          formvalues.contractEffectiveDate.format('YYYY-MM-DD'),
        contractExpiryDate: formvalues.contractExpiryDate.format('YYYY-MM-DD'),
        contractRenewDate: formvalues.contractRenewDate.format('YYYY-MM-DD'),
      }
      const res = await signupForCspAccount(params)
      if (res) {
        message.success('提交成功！')
        navigate('/console/rcs/account/index')
      }
      setloading(false)
    } catch (error) {
      setloading(false)
    }
  }
  // 保存
  const save = async () => {
    if (saveLoading) return
    setsaveLoading(true)
    try {
      let res1: FilePath = {},
        res2: FilePath = {}
      if (companyLogoPathRef.current) {
        if (fileList[0].url != companyLogoPathRef.current) {
          delCustomerFile({
            path: companyLogoPathRef.current,
          })
          res1 = await uploadCustomerFile({
            file: fileList[0],
            type: '2',
          })
        } else {
          res1['path'] = companyLogoPathRef.current
        }
      } else {
        if (fileList.length > 0) {
          res2 = await uploadCustomerFile({
            file: fileList[0],
            type: '2',
          })
        }
      }

      if (contractAccessoryPathRef.current) {
        if (fileList2[0].url != contractAccessoryPathRef.current) {
          delCustomerFile({
            path: contractAccessoryPathRef.current,
          })
          res2 = await uploadCustomerFile({
            file: fileList2[0],
            type: '1',
          })
        } else {
          res2['path'] = contractAccessoryPathRef.current
        }
      } else {
        if (fileList2.length > 0) {
          res2 = await uploadCustomerFile({
            file: fileList2[0],
            type: '1',
          })
        }
      }

      const formvalues = await form.getFieldsValue()
      let params = {
        ...formvalues,
        businessType: formvalues.businessType[0],
        industryTypeCode: formvalues.businessType[1],
        contractRenewStatus: formvalues.contractRenewStatus.value,
        companyLogo: (res1 && res1.path) || '',
        contractAccessory: (res2 && res2.path) || '',
        contractEffectiveDate:
          formvalues.contractEffectiveDate.format('YYYY-MM-DD'),
        contractExpiryDate: formvalues.contractExpiryDate.format('YYYY-MM-DD'),
        contractRenewDate: formvalues.contractRenewDate.format('YYYY-MM-DD'),
      }

      const res = await saveupForCspAccount(params)
      if (res) {
        message.success('保存成功！')
        navigate('/console/rcs/account/index')
      }
      setsaveLoading(false)
    } catch (error) {
      setsaveLoading(false)
    }
  }

  const props: UploadProps = {
    accept: '.jpg, .jpeg, .png',
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        message.error('文件不允许超过10M！')
      } else {
        setFileList([file])
        return false
      }
    },

    fileList,
  }
  const props2: UploadProps = {
    accept: '.pdf, .doc, .docx, .jpg, .jpeg, .gif, .rar, .zip',
    onRemove: (file) => {
      const index = fileList2.indexOf(file)
      const newFileList = fileList2.slice()
      newFileList.splice(index, 1)
      setFileList2(newFileList)
    },
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        message.error('文件不允许超过10M！')
      } else {
        setFileList2([file])
        return false
      }
    },
    fileList: fileList2,
  }

  // 获取客户资料
  const getCusInfo = async (ifshowLoading = false) => {
    try {
      ifshowLoading && setloading(true)
      const params = ''
      const res = await getDicConfig(params)
      setStatus(res.data.status)
      form.resetFields()
      form.setFieldsValue({
        ...res.data,
        businessType: [res.data.businessType, res.data.industryTypeCode],
        contractEffectiveDate: res.data.contractEffectiveDate
          ? dayjs(res.data.contractEffectiveDate)
          : null,
        contractExpiryDate: res.data.contractExpiryDate
          ? dayjs(res.data.contractExpiryDate)
          : null,
        contractRenewDate: res.data.contractRenewDate
          ? dayjs(res.data.contractRenewDate)
          : null,
      })
      // 合同回显
      if (res.data.contractAccessory) {
        contractAccessoryPathRef.current = res.data.contractAccessory
        setFileList2([
          {
            uid: '',
            name: '文件',
            url: res.data.contractAccessory,
          },
        ])
      }
      //头像回显
      if (res.data.companyLogo) {
        companyLogoPathRef.current = res.data.companyLogo
        setFileList([
          {
            uid: '',
            name: 'logo',
            url: res.data.companyLogo,
          },
        ])
      }
      setloading(false)
    } catch (error) {
      setloading(false)
    }
  }

  // 获取行业类型
  const getIndustryList = async () => {
    try {
      const res = await getIndustry()
      setIndustryList(res.data)
    } catch (error) {}
  }

  useEffect(() => {
    getIndustryList()
    if (id == '0') {
      dispatch(
        changeBreadcrumbItem({
          index: 2,
          title: '客户资料填写',
        }),
      )
    } else {
      getCusInfo(true)
      dispatch(
        changeBreadcrumbItem({
          index: 2,
          title: '客户资料修改',
        }),
      )
    }
  }, [id])

  return (
    <PageContent extClass='create-account-page'>
      <div className='form-header m-t-32 fx-col-center-center g-radius-4 m-x-12'>
        <div className='fn22 fw-500'>客户资料{id == '0' ? '填写' : '修改'}</div>
        <div className='fn14 title-desc'>
          请尽快完善客户信息，以便使用完整的5g消息功能
        </div>
      </div>
      <ConfigProvider
        theme={{
          components: {
            Cascader: {
              controlItemWidth: 120,
              dropdownHeight: 360,
            },
          },
        }}>
        <Form
          form={form}
          className='create-account-form'
          name='craete-account'
          layout='vertical'
          autoComplete='off'>
          <div className='form-group'>
            <div className='form-group-title'>基本信息</div>
            <Row style={{ marginTop: '16px' }} gutter={24}>
              <Col span={24}>
                <Form.Item
                  label='客户名称'
                  name='customerName'
                  rules={[{ required: true }, { max: 20 }]}>
                  <Input placeholder='请输入客户名称' />
                </Form.Item>
              </Col>
              <Col span={24} xl={12}>
                <Form.Item label='联系人名称' name='customerContactName'>
                  <Input placeholder='请输入联系人名称' />
                </Form.Item>
              </Col>
              <Col span={24} xl={12}>
                <Form.Item
                  label='联系人手机号'
                  name='customerContactMob'
                  rules={[
                    {
                      message: '请输入正确的手机号',
                      pattern: new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/, 'g'),
                    },
                  ]}>
                  <Input placeholder='请输入联系人手机号' max={11} />
                </Form.Item>
              </Col>

              <Col span={24} xl={12}>
                <Form.Item
                  label='联系人邮箱'
                  name='customerContactEmail'
                  rules={[
                    {
                      message: '请输入正确的邮箱',
                      pattern: new RegExp(
                        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                      ),
                    },
                  ]}>
                  <Input placeholder='请输入联系人邮箱' />
                </Form.Item>
              </Col>

              <Col span={24} xl={12}>
                <Form.Item
                  label='行业类型'
                  name='businessType'
                  required
                  rules={[{ required: true }]}>
                  <Cascader
                    options={industryList}
                    getPopupContainer={(triggerNode) => triggerNode}
                    maxTagTextLength={3}
                    placeholder='请选择'
                    expandTrigger='hover'
                  />
                </Form.Item>
              </Col>

              <Col span={24} xl={12}>
                <Form.Item
                  label='企业统一社会信用代码'
                  required
                  rules={[{ required: true }]}
                  name='unifySocialCreditCodes'>
                  <Input placeholder='请输入企业统一社会信用代码' />
                </Form.Item>
              </Col>
              <Col span={24} xl={12}>
                <Form.Item
                  label='企业责任人姓名'
                  required
                  rules={[{ required: true }]}
                  name='enterpriseOwnerName'>
                  <Input placeholder='请输入企业责任人姓名' />
                </Form.Item>
              </Col>
              <Col span={24} xl={12}>
                <Form.Item
                  label='企业责任人证件类型'
                  name='certificateType'
                  required
                  rules={[{ required: true }]}>
                  <Select
                    placeholder='请选择证件类型'
                    options={[
                      {
                        label: '居民身份证',
                        value: '01',
                      },
                      {
                        label: '中国人民解放军军人身份证件',
                        value: '02',
                      },
                      {
                        label: '中国人民武装警察身份证件',
                        value: '03',
                      },
                    ]}></Select>
                </Form.Item>
              </Col>
              <Col span={24} xl={12}>
                <Form.Item
                  label='企业责任人证件号码'
                  required
                  rules={[{ required: true }]}
                  name='certificateCode'>
                  <Input placeholder='请输入企业责任人证件号码' />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label='企业logo'
                  name='companyLogo'
                  extra={
                    <Extra>
                      您可上传的文件类型：png、jpg、jpeg，单个附件大小限10M，限上传1个文件
                    </Extra>
                  }>
                  <Upload {...props}>
                    <Button
                      icon={<UploadOutlined rev={null} />}
                      className='upload'>
                      上传
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </div>

          <div className='form-group'>
            <div className='form-group-title'>合同信息</div>
            <Row gutter={24} className='m-t-16'>
              <Col span={24} xl={12}>
                <Form.Item label='合同名称' name='contractName'>
                  <Input placeholder='请输入合同名称' />
                </Form.Item>
              </Col>
              <Col span={24} xl={12}>
                <Form.Item label='合同编号' name='contractNo'>
                  <Input placeholder='请输入合同编号' />
                </Form.Item>
              </Col>
              <Col span={24} xl={12}>
                <Row gutter={12}>
                  <Col xs={24} xl={12}>
                    <Form.Item
                      label='合同生效期'
                      validateTrigger='onSubmit'
                      name='contractEffectiveDate'>
                      <DatePicker className='w-100' />
                    </Form.Item>
                  </Col>
                  <Col xs={24} xl={12}>
                    <Form.Item
                      label='合同失效期'
                      validateTrigger='onSubmit'
                      name='contractExpiryDate'>
                      <DatePicker className='w-100' />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>

              <Col span={24} xl={12}>
                <Row>
                  <Col span={24} xl={12}>
                    <Form.Item
                      label='合同是否续签'
                      name='contractRenewStatus'
                      initialValue={'0'}>
                      <Radio.Group>
                        <Radio value='0'>是</Radio>
                        <Radio value='1'>否</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                  <Col xs={24} xl={12}>
                    <Form.Item
                      label='自动续签日期'
                      validateTrigger='onSubmit'
                      name='contractRenewDate'>
                      <DatePicker className='w-100' />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Form.Item
                  label='合同电子扫描件（正反面）'
                  name='contractAccessory'
                  required
                  extra={
                    <Extra>
                      您可上传的文件类型：pdf、doc、docx、jpg、jpeg、gif、rar、zip，单个附件大小限10M，限上传1个文件
                    </Extra>
                  }>
                  <Upload {...props2}>
                    <Button
                      icon={<UploadOutlined rev={null} />}
                      className='upload'>
                      上传
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label='备注' name='remarkText'>
                  <TextArea autoSize={{ minRows: 3, maxRows: 4 }} />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Flex justify='space-between'>
            {/* 仅未提交状态可以保存 */}
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
                  style={{ width: 120 }}
                  loading={saveLoading}
                  onClick={save}>
                  保存
                </Button>
              </ConfigProvider>
            ) : (
              <span></span>
            )}
            <Space>
              <NavLink to='/console/rcs/account/index'>
                <Button
                  className='cancle'
                  type='primary'
                  style={{ width: 120, marginRight: '12px' }}>
                  取消
                </Button>
              </NavLink>
              <Button
                type='primary'
                style={{ width: 120 }}
                onClick={submit}
                loading={loading}>
                提交审核
              </Button>
            </Space>
          </Flex>
        </Form>
      </ConfigProvider>
    </PageContent>
  )
}
