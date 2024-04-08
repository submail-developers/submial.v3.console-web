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
} from 'antd'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import { useState, useRef, useEffect } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import { changeBreadcrumbItem } from '@/store/reducers/breadcrumb'
import { useAppDispatch } from '@/store/hook'
import utils from '@/utils/formRules'

import PageContent from '@/components/pageContent'

import jiqiren from '@/assets/rcs/jiqiren.png'

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
    <PageContent xxl={970} xl={970} extClass='create-chatbot-page'>
      <Form
        form={form}
        className='create-chatbot-form'
        name='craete-chatbot'
        layout='vertical'
        autoComplete='off'>
        <div className='form-header'>
          <Image src={jiqiren} width={32} height={32} preview={false}></Image>
          <div className='fn20 fw-500' style={{ marginTop: '8px' }}>
            客户资料{id == '0' ? '填写' : '修改'}
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
            <Col span={24}>
              <Form.Item label='客户详细地址' name='actualIssueIndustry'>
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
                <Input placeholder='' />
              </Form.Item>
            </Col>
            <Col span={24} xl={12}>
              <Form.Item label='企业责任人证件类型' required name='serviceCode'>
                <Input placeholder='' />
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
                  <Button icon={<UploadOutlined rev={null} />}>上传</Button>
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
        <div style={{ padding: '0 24px' }}>
          <Divider style={{ margin: '0' }} />
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
                    您可上传的文件类型：pdf、doc、docx、jpg、jpeg、git、rar、zip，单个附件大小限10M，限上传1个文件
                  </Extra>
                }>
                <Upload {...props}>
                  <Button icon={<UploadOutlined rev={null} />}>上传</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className='form-group' style={{ paddingBottom: '24px' }}>
          <Flex justify='flex-end'>
            <Button
              type='primary'
              size='large'
              style={{ width: 120 }}
              onClick={submit}>
              提交
            </Button>
          </Flex>
        </div>
      </Form>
    </PageContent>
  )
}
