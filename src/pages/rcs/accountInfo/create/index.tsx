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
} from 'antd'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { useState, useRef, useEffect } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { changeBreadcrumbItem } from '@/store/reducers/breadcrumb'
import { useAppDispatch } from '@/store/hook'
import { getRegionRes } from '@/api'
import utils from '@/utils/formRules'

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

  console.log(id)

  const submit = async () => {
    const values = await form.getFieldsValue()
    console.log(values)
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
      const res = await getRegionRes()
      console.log(res)
    } catch (error) {}
  }
  useEffect(() => {
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
                name='name'
                rules={[{ required: true }, { max: 20 }]}>
                <Input placeholder='不超过 20 个字符' max={20} />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item label='客户电话' required name='serviceCode'>
                <Input placeholder='客户电话信息' />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item label='归属区域' name='actualIssueIndustry' required>
                <Cascader options={options} placeholder='请选择' />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item label='客户邮箱' required name='mail'>
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
                name='serviceCode'>
                <Input placeholder='' />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item label='企业责任人姓名' required name='serviceCode'>
                <Input placeholder='不超过20个字符' />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              {/* <Form.Item label='企业责任人证件类型' required name='serviceCode'>
                <Input placeholder='' />
              </Form.Item> */}
              <Form.Item label='企业责任人证件类型' name='serviceCode' required>
                <Cascader options={IdOptions} placeholder='请选择' />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item label='企业责任人证件号码' required name='serviceCode'>
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
                onClick={submit}>
                保存
              </Button>
            </ConfigProvider>
            <Space>
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
                提交审核
              </Button>
            </Space>
          </Flex>
        </div>
      </Form>
    </PageContent>
  )
}
