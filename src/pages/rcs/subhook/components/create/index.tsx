import { useState, forwardRef, useImperativeHandle, useRef } from 'react'
import { Modal, Form, App, Input, Select, Radio } from 'antd'
import { saveRcsSubhook, getChatbot } from '@/api'
import { API } from 'apis'
import formRules from '@/utils/formRules'
interface Props {
  onRefresh: () => void
}
const Extra = (props) => {
  return <div className='m-t-4'>{props.children}</div>
}

const defaultChatbot = [
  {
    id: 'ALL',
    name: '全部Chatbot',
  },
] as API.ChatbotItem[]

const postOptions = [
  {
    value: 'x-www-form-urlencoded',
    label: 'x-www-form-urlencoded',
  },
  {
    value: 'json',
    label: 'json',
  },
  {
    value: 'form-data',
    label: 'form-data',
  },
]

const resCodeOptions = [
  { label: '100 - 199', value: '100' },
  { label: '200 - 299', value: '200' },
  { label: '300 - 399', value: '300' },
]

const Dialog = (props: Props, ref: any) => {
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const editRef = useRef<API.RcsSubhookItem>()

  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [chatbotList, setChatbotList] =
    useState<API.ChatbotItem[]>(defaultChatbot)

  const open = (editItem: API.RcsSubhookItem) => {
    getChatbotList()
    form.resetFields()
    setTitle('创建SUBHOOK')
    if (editItem) {
      editRef.current = editItem
      form.setFieldsValue({ ...editItem })
      setTitle('编辑SUBHOOK')
    }
    setShow(true)
  }

  const getChatbotList = async () => {
    try {
      const res = await getChatbot({
        page: 1,
        limit: 10000,
        appid: '',
        keywords: '',
        status: '1',
      })
      setChatbotList([...defaultChatbot, ...res.list])
    } catch (error) {}
  }

  const handleOk = async () => {
    setLoading(true)
    try {
      const values = await form.validateFields()
      const params = { ...editRef.current, ...values }
      const res = await saveRcsSubhook(params)
      if (res.status == 'success') {
        props.onRefresh()
        message.success('保存成功')
        setShow(false)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={show}
      onCancel={() => setShow(false)}
      title={title}
      onOk={handleOk}
      confirmLoading={loading}
      width={620}
      closable={false}>
      <Form
        name='form-subhook'
        form={form}
        layout='vertical'
        initialValues={{
          id: '',
          appid: 'ALL',
          request_method: 'POST',
          request_content_type: 'x-www-form-urlencoded',
          response_code: '100',
        }}
        validateTrigger='onSubmit'
        autoComplete='off'>
        <Form.Item label='id' name='id' hidden>
          <Input />
        </Form.Item>

        <Form.Item
          label='SUBHOOK 名称'
          name='title'
          rules={[
            {
              required: true,
            },
            {
              max: 32,
            },
          ]}
          extra={<Extra>请将 SHUBHOOK 名称控制在32个字符以内</Extra>}>
          <Input placeholder='请输入' maxLength={32} />
        </Form.Item>

        <Form.Item
          label='选择Chatbot'
          name='appid'
          rules={[
            {
              required: true,
            },
          ]}
          extra={
            <Extra>
              选择一个Chatbot或选择全部Chatbot，该SUBHOOK将推送指定的Chatbot发送那个的数据
            </Extra>
          }>
          <Select
            placeholder=''
            options={chatbotList}
            fieldNames={{ label: 'name', value: 'id' }}></Select>
        </Form.Item>

        <Form.Item
          label='回调方式'
          name='request_method'
          rules={[
            {
              required: true,
            },
          ]}>
          <Radio.Group
            options={[
              {
                label: 'POST',
                value: 'POST',
              },
              {
                label: 'GET',
                value: 'GET',
              },
            ]}
          />
        </Form.Item>
        <Form.Item
          preserve={false}
          label='POST 文档类型'
          name='request_content_type'
          extra={
            <Extra>
              请选择 SUBHOOK 回调文档类型，用于接收 SUBHOOK 数据；GET
              方式请忽略此参数
            </Extra>
          }>
          <Select placeholder='' options={postOptions}></Select>
        </Form.Item>

        <Form.Item
          label='响应码'
          name='response_code'
          rules={[
            {
              required: true,
            },
          ]}
          extra={
            <Extra>
              请选择SUBHOOK回调响应码，如您的回调接口响应码范围与您选择的响应码范围不符，
              SUBHOOK会判断失败重推，一般会递增时间重推，最大重试次数为6次。
            </Extra>
          }>
          <Radio.Group options={resCodeOptions} />
        </Form.Item>

        <Form.Item
          label='回调URL'
          name='url'
          rules={[
            {
              required: true,
            },
            {
              validator: formRules.validateUrl,
            },
          ]}
          extra={<Extra>请输入回调URL，用于接收SUBHOOK事件推送</Extra>}>
          <Input placeholder='http(s)://' />
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
