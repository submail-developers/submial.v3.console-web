import { useEffect, forwardRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Modal, Form, App, Input, Select, Radio } from 'antd'
import { createTalk } from '@/api'

interface Props {
  open: boolean
  onCancel: () => void
  onConfirm: (id: number) => void
}
const options = [
  {
    label: '通用',
    value: 'general',
  },
  {
    label: '物流',
    value: 'address',
  },
  {
    label: '金融',
    value: 'finance3.0',
  },
]

export default function Fn(props: Props) {
  const [form] = Form.useForm()
  const nav = useNavigate()
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    form.resetFields()
  }, [props.open])

  const handleOk = async () => {
    setLoading(true)
    try {
      const values = await form.validateFields()
      const res = await createTalk({
        ...values,
      })

      setLoading(false)
      props.onConfirm(res.data.id)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      title='创建话术'
      onOk={handleOk}
      confirmLoading={loading}
      width={600}
      data-class='create-address'
      closable={false}
      wrapClassName='modal-create-address'>
      <Form
        name='form-create-address'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        initialValues={{ recognitionModel: 'general', type: 1 }}
        validateTrigger='onSubmit'
        autoComplete='off'>
        <Form.Item
          label='话术名称'
          name='name'
          rules={[
            {
              required: true,
            },
          ]}>
          <Input placeholder='请输入' autoFocus />
        </Form.Item>
        <Form.Item
          label='话术所属行业'
          name='recognitionModel'
          rules={[
            {
              required: true,
            },
          ]}>
          <Select placeholder='请选择' options={options}></Select>
        </Form.Item>
        <Form.Item
          label='话术类型'
          name='type'
          rules={[
            {
              required: true,
            },
          ]}>
          <Radio.Group>
            <Radio value={1}>普通话术</Radio>
            <Radio value={2}>动态话术</Radio>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  )
}
