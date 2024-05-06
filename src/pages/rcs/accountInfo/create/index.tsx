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
  Cascader,
  Radio,
  Divider,
  InputNumber,
  ConfigProvider,
  App,
} from 'antd'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useState, useRef, useEffect } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { changeBreadcrumbItem } from '@/store/reducers/breadcrumb'
import { useAppDispatch } from '@/store/hook'
import { getRegion, getDicConfig, signupForCspAccount } from '@/api'
import utils from '@/utils/formRules'
import { API } from 'apis'

import PageContent from '@/components/pageContent'

import jiqiren from '@/assets/rcs/aco1.png'

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

const options: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
]

const IdOptions: Option[] = [{ value: 'ids', label: '身份证' }]

export default function Fn() {
  const dispatch = useAppDispatch()
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const { id } = useParams()
  const [loading, setloading] = useState(false)
  const [customerId, setCustomerId] = useState({})
  const [regionList, setregionList] = useState<API.RegionItem[]>([])

  const { message } = App.useApp()

  const submit = async () => {
    try {
      const formvalues = await form.getFieldsValue()
      let params = {
        ...formvalues,
        id: customerId,
        customerContactName: '朱天文',
        businessType: 'A',
        industryTypeCode: '02',
        contractNo: '1111111',
        contractName: '合同名称',
        contractEffectiveDate: '2024-10-10 12:30:00',
        contractExpiryDate: '2024-12-10 12:30:00',
        contractRenewDate: '2024-12-10 12:30:00',
        companyLogo:
          'rcs/39cdee6050bd28ae89dacd2afd3b3f8f/user/2a2a2228bc3e75c37837b985a0f09a5f.png',
        contractAccessory:
          'rcs/39cdee6050bd28ae89dacd2afd3b3f8f/user/2a2a2228bc3e75c37837b985a0f09a5f.pdf',
        unifySocialCreditCodes: '123123asda23ds',
        certificateType: '01',
        certificateCode: '12313123123123121',
        regionCode: '01',
        provinceCode: '100',
        cityCode: '1000',
      }
      console.log(params, '111')
      await signupForCspAccount(params)
      message.success('保存成功！')
      setloading(false)
    } catch (error) {
      setloading(false)
    }
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

  const onSetLogo = (src: string) => {
    form.setFieldValue('logo', src)
  }

  // 获取省 市
  const getProvincesCities = async () => {
    try {
      const res = await getRegion()
      setregionList(res.data)
    } catch (error) {}
  }
  // 获取客户资料
  const search = async (ifshowLoading = false) => {
    try {
      ifshowLoading && setloading(true)
      const params = ''
      const res = await getDicConfig(params)
      // setCustomerData(res.data)
      // console.log(res.data, '///')
      setCustomerId(res.data.id)
      form.resetFields()
      form.setFieldsValue(res.data)
      setloading(false)
    } catch (error) {
      setloading(false)
    }
  }

  useEffect(() => {
    search(true)
    getProvincesCities()
  }, [])

  useEffect(() => {
    if (id == '0') {
      dispatch(
        changeBreadcrumbItem({
          index: 2,
          title: '客户资料填写',
        }),
      )
    } else {
      dispatch(
        changeBreadcrumbItem({
          index: 2,
          title: '客户资料修改',
        }),
      )
    }
  }, [id])
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
    <PageContent xxl={970} extClass='create-account-page'>
      <Form
        form={form}
        className='create-account-form'
        name='craete-account'
        layout='vertical'
        autoComplete='off'>
        <div className='form-header'>
          <Image src={jiqiren} preview={false}></Image>
          <div className='fn22 fw-500 form-con'>
            客户资料{id == '0' ? '填写' : '修改'}
            <div className='fn14 title-desc'>
              请尽快完善客户信息，以便使用完整的5g消息功能
            </div>
          </div>
        </div>
        <div className='form-group'>
          <div className='form-group-title'>基本信息</div>
          <Row style={{ marginTop: '16px' }} gutter={24}>
            <Col span={24} xl={12}>
              <Form.Item
                label='客户名称'
                required
                name='customerName'
                rules={[{ required: true }, { max: 20 }]}>
                <Input placeholder='不超过 20 个字符' max={20} />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item label='客户电话' required name='customerContactMob'>
                <Input placeholder='客户电话信息' />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item label='归属区域' name='actualIssueIndustry' required>
                <Cascader
                  options={regionList}
                  placeholder='请选择'
                  expandTrigger='hover'
                />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item label='客户邮箱' required name='customerContactEmail'>
                <Input placeholder='客户邮箱' />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label='客户详细地址' name='acoDetailAdress'>
                <Input placeholder='请输入' />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                label='企业统一社会信用代码'
                required
                name='unifySocialCreditCodes'>
                <Input placeholder='' />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                label='企业责任人姓名'
                required
                name='enterpriseOwnerName'>
                <Input placeholder='不超过20个字符' />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item
                label='企业责任人证件类型'
                name='certificateType'
                required>
                <Select
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
                name='certificateCode'>
                <Input placeholder='' />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label='上传营业执照'
                name='attachment'
                required
                extra={
                  <Extra>
                    您可上传的文件类型：pdf、doc、docx、xls、xIsx、ppt、pptx、jpg、jpeg、gif、rar、7z、zip，单个附件大小限10M，限上传1个文件
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
            <Col span={24}>
              <Form.Item label='备注' name='description'>
                <TextArea autoSize={{ minRows: 4, maxRows: 4 }} />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className='form-group'>
          <div className='form-group-title'>合同信息</div>
          <Row gutter={24} style={{ marginTop: '16px' }}>
            <Col span={24}>
              <Form.Item
                label='合同电子扫描件（正反面）'
                name='backgroundImage'
                extra={
                  <Extra>
                    您可上传的文件类型：pdf、doc、docx、jpg、jpeg、gif、rar、zip，单个附件大小限10M，限上传1个文件
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

        <div className='form-group' style={{ paddingBottom: 120 }}>
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
                // onClick={submit}
              >
                保存
              </Button>
            </ConfigProvider>
            <Space>
              <NavLink to='/console/rcs/account/index'>
                <Button
                  className='cancle'
                  type='primary'
                  size='large'
                  style={{ width: 120, marginRight: '12px' }}>
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
