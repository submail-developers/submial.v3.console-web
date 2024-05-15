import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, App, Upload, Button, Input, Select } from 'antd'

import { API } from 'apis'
import './index.scss'
const { Option } = Select

interface Props {
  open: boolean
  isEdit: boolean
  onCancel: () => void
  onOk: () => void
}

const Dialog = (props: Props, ref: any) => {
  const [form] = Form.useForm()
  const { message } = App.useApp()

  const options = [
    { label: '无标签', value: 'none', color: '#282b31' },
    { label: '红色', value: 'red', color: '#ff4446' },
    { label: '紫色', value: 'purple', color: '#6f42c1' },
    { label: '青色', value: 'cyan', color: '#17a2b8' },
    { label: '蓝色', value: 'blue', color: '#1764ff' },
    { label: '绿色', value: 'green', color: '#17c13d' },
    { label: '黄色', value: 'yellow', color: '#ffba00' },
  ]

  const handleOk = () => {
    props.onCancel()
  }

  const handleCancel = () => {
    props.onCancel()
  }

  const onFinish = () => {}
  const onFinishFailed = () => {}

  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      title={props.isEdit ? '编辑地址簿文件夹' : '创建地址簿文件夹'}
      onOk={props.onOk}
      width={480}
      style={{ top: 240 }}
      data-class='create-address'
      closable={false}
      wrapClassName='modal-create-address'>
      <Form
        name='form-create-address-file'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        initialValues={{ type: 'none' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Form.Item
          label='地址簿文件夹名称'
          name='name'
          validateTrigger='onSubmit'>
          <Input
            placeholder='请输入名称，请将名称控制在 32 个字符以内'
            maxLength={32}
          />
        </Form.Item>
        <Form.Item label='选择标签' name='type'>
          <Select placeholder='选择颜色'>
            {options.map((option) => (
              <Option
                key={option.value}
                value={option.value}
                style={{ color: option.color }}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
