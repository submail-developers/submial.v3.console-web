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
  Spin,
} from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import { ProFormDependency } from '@ant-design/pro-components'
import { UploadOutlined } from '@ant-design/icons'
import { useState, useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
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
const { Option } = Select

const Extra = (props) => {
  return <div style={{ marginTop: '8px' }}>{props.children}</div>
}

type FilePath = {
  path?: string
}
const prefixSelector = (
  <Form.Item name='institutionLicenceType' noStyle initialValue={'01'}>
    <Select style={{ width: 180 }}>
      <Option value='01'>营业执照</Option>
      <Option value='02'>组织机构代码证</Option>
      <Option value='03'>事业单位法人证书</Option>
      <Option value='04'>社会团体法人登记证书</Option>
      <Option value='05'>军队代码</Option>
      <Option value='06'>个体户（注册号）</Option>
    </Select>
  </Form.Item>
)

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
  const [loading, setloading] = useState(false)
  const [saveLoading, setsaveLoading] = useState(false)
  const [submitLoading, setsubmitLoading] = useState(false)
  const [industryList, setIndustryList] = useState<API.IndustryItem[]>([])
  const { message } = App.useApp()
  const navigate = useNavigate()
  // 提交
  const submit = async () => {
    setsubmitLoading(true)
    try {
      const formvalues = await form.validateFields()
      let res1: FilePath = {},
        res2: FilePath = {}

      if (companyLogoPathRef.current) {
        if (fileList[0]?.url != companyLogoPathRef.current) {
          delCustomerFile({
            path: companyLogoPathRef.current,
          })
          if (fileList[0]) {
            res1 = await uploadCustomerFile({
              file: fileList[0],
              type: '2',
            })
          }
        } else {
          res1['path'] = companyLogoPathRef.current
        }
      } else {
        if (fileList.length > 0) {
          res1 = await uploadCustomerFile({
            file: fileList[0],
            type: '2',
          })
        }
      }

      if (contractAccessoryPathRef.current) {
        if (fileList2[0]?.url != contractAccessoryPathRef.current) {
          delCustomerFile({
            path: contractAccessoryPathRef.current,
          })
          if (fileList2[0]) {
            res2 = await uploadCustomerFile({
              file: fileList2[0],
              type: '1',
            })
          }
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

      let params = {
        ...formvalues,
        businessType: formvalues.businessType[0],
        industryTypeCode: formvalues.businessType[1],
        contractRenewStatus: formvalues.contractRenewStatus,
        companyLogo: res1?.path || '',
        contractAccessory: res2?.path || '',
        contractEffectiveDate:
          formvalues.contractEffectiveDate?.format('YYYY-MM-DD') || '',
        contractExpiryDate:
          formvalues.contractExpiryDate?.format('YYYY-MM-DD') || '',
        contractRenewDate:
          formvalues.contractRenewDate?.format('YYYY-MM-DD') || '',
      }
      const res = await signupForCspAccount(params)
      if (res.status == 'success') {
        message.success('提交成功！')
        navigate('/console/rcs/account/index', { replace: true })
      }
      setsubmitLoading(false)
    } catch (error) {
      setsubmitLoading(false)
    }
  }
  // 保存
  const save = async () => {
    setsaveLoading(true)
    try {
      let res1: FilePath = {},
        res2: FilePath = {}
      if (companyLogoPathRef.current) {
        if (fileList[0]?.url != companyLogoPathRef.current) {
          delCustomerFile({
            path: companyLogoPathRef.current,
          })
          if (fileList[0]) {
            res1 = await uploadCustomerFile({
              file: fileList[0],
              type: '2',
            })
          }
        } else {
          res1['path'] = companyLogoPathRef.current
        }
      } else {
        if (fileList.length > 0) {
          res1 = await uploadCustomerFile({
            file: fileList[0],
            type: '2',
          })
        }
      }

      if (contractAccessoryPathRef.current) {
        if (fileList2[0]?.url != contractAccessoryPathRef.current) {
          delCustomerFile({
            path: contractAccessoryPathRef.current,
          })
          if (fileList2[0]) {
            res2 = await uploadCustomerFile({
              file: fileList2[0],
              type: '1',
            })
          }
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
        businessType:
          (formvalues.businessType && formvalues.businessType[0]) || '',
        industryTypeCode:
          (formvalues.businessType && formvalues.businessType[1]) || '',
        contractRenewStatus: formvalues.contractRenewStatus,
        companyLogo: res1?.path || '',
        contractAccessory: res2.path || '',
        contractEffectiveDate:
          formvalues?.contractEffectiveDate?.format('YYYY-MM-DD') || '',
        contractExpiryDate:
          formvalues?.contractExpiryDate?.format('YYYY-MM-DD') || '',
        contractRenewDate:
          formvalues.contractRenewDate?.format('YYYY-MM-DD') || '',
      }

      const res = await saveupForCspAccount(params)
      if (res.status == 'success') {
        message.success('保存成功！')
        navigate('/console/rcs/account/index', { replace: true })
      }
      setsaveLoading(false)
    } catch (error) {
      setsaveLoading(false)
    }
  }

  const props: UploadProps = {
    accept: '.jpg, .jpeg',
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      const limit = file.size <= 50 * 1024
      if (!limit) {
        message.error('文件不允许超过50kb！')
      } else {
        setFileList([file])
        return false
      }
    },

    fileList,
  }
  const props2: UploadProps = {
    accept: '.zip',
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
  const getCusInfo = async () => {
    setloading(true)
    try {
      const res = await getDicConfig()
      // 3运营商审核中 9客服审核中
      if (res.data.status == '9' || res.data.status == '3') {
        message.error('客户资料正在审核中，无法编辑', 5)
        navigate('/console/rcs/account/index', { replace: true })
        return
      }
      setStatus(res.data.status)
      form.resetFields()
      form.setFieldsValue({
        ...res.data,
        businessType:
          res.data.businessType && res.data.industryTypeCode
            ? [res.data.businessType, res.data.industryTypeCode]
            : [],
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
      //头像回显
      if (res.data.companyLogo) {
        companyLogoPathRef.current = res.data.companyLogo
        setFileList([
          {
            uid: '',
            name: '点击查看',
            url: res.data.companyLogo,
          },
        ])
      }
      // 合同回显
      if (res.data.contractAccessory) {
        contractAccessoryPathRef.current = res.data.contractAccessory
        setFileList2([
          {
            uid: '',
            name: '点击查看',
            url: res.data.contractAccessory,
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
      setIndustryList(res?.data || [])
    } catch (error) {}
  }

  // 修改是否续签状态
  const changeContractRenewStatus = async (e) => {
    let status = e.target.value
    const contractExpiryDateValues = await form.getFieldValue(
      'contractExpiryDate',
    )
    if (status == '1') {
      // 自动将合同失效日期同步到自动续签日期
      form.setFieldValue('contractRenewDate', contractExpiryDateValues)
    } else {
      form.setFieldValue('contractRenewDate', null)
    }
  }

  useEffect(() => {
    getIndustryList()
    getCusInfo()
    dispatch(
      changeBreadcrumbItem({
        index: 2,
        title: '编辑客户资料',
      }),
    )
  }, [])

  return (
    <PageContent extClass='create-account-page'>
      {loading && (
        <div className='init-loading fx-center-center'>
          <Spin></Spin>
        </div>
      )}
      <div className='form-header m-t-32 fx-col-center-center g-radius-4 m-x-12'>
        <div className='fn22 fw-500'>编辑客户资料</div>
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
          validateTrigger='onBlur'
          scrollToFirstError={true}
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
                      type: 'email',
                      message: '请输入正确的邮箱',
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
                  label='证书编号/社会代码/注册号'
                  required
                  rules={[{ required: true }]}
                  name='unifySocialCreditCodes'>
                  <Input addonBefore={prefixSelector} placeholder='请输入' />
                </Form.Item>
              </Col>
              <Col span={24} xl={12}>
                <Form.Item
                  label='责任人姓名'
                  required
                  rules={[{ required: true }]}
                  name='enterpriseOwnerName'>
                  <Input placeholder='请输入责任人姓名' />
                </Form.Item>
              </Col>
              <Col span={24} xl={12}>
                <Form.Item
                  label='责任人证件类型'
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
                  label='责任人证件号码'
                  required
                  rules={[{ required: true }]}
                  name='certificateCode'>
                  <Input placeholder='请输入责任人证件号码' />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label='企业logo'
                  name='companyLogo'
                  extra={
                    <Extra>
                      您可上传的文件类型：jpg、jpeg，单个附件大小限50kb，限上传1个文件
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
                    <Form.Item label='合同生效期' name='contractEffectiveDate'>
                      <DatePicker className='w-100' />
                    </Form.Item>
                  </Col>
                  <Col xs={24} xl={12}>
                    <Form.Item label='合同失效期' name='contractExpiryDate'>
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
                      <Radio.Group onChange={changeContractRenewStatus}>
                        <Radio value='1'>是</Radio>
                        <Radio value='0'>否</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>

                  <ProFormDependency
                    name={['contractRenewStatus', 'contractExpiryDate']}>
                    {({ contractRenewStatus, contractExpiryDate }) => {
                      return (
                        <>
                          {contractRenewStatus == '1' ? (
                            <Col xs={24} xl={12}>
                              <Form.Item
                                label='自动续签日期'
                                name='contractRenewDate'>
                                <DatePicker className='w-100' />
                              </Form.Item>
                            </Col>
                          ) : (
                            <></>
                          )}
                        </>
                      )
                    }}
                  </ProFormDependency>
                </Row>
              </Col>
              <Col span={24}>
                <Form.Item
                  label='合同电子扫描件（正反面）'
                  name='contractAccessory'
                  rules={[
                    {
                      required: true,
                      message: '请上传合同电子扫描件（正反面）',
                    },
                  ]}
                  extra={
                    <Extra>
                      您可上传的文件类型：zip，单个附件大小限10M，限上传1个文件
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

          <Flex justify='space-between' wrap='wrap' gap={12}>
            {/* 仅未提交状态可以保存 */}
            {status == '2' ? (
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
              <NavLink to='/console/rcs/account/index' replace>
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
                loading={submitLoading}>
                提交审核
              </Button>
            </Space>
          </Flex>
        </Form>
      </ConfigProvider>
    </PageContent>
  )
}
