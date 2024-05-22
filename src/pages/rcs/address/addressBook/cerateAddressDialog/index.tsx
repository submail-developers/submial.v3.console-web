import { useState, useEffect, forwardRef } from 'react'
import { Modal, Form, App, Upload, Button, Input, Select } from 'antd'
import { createAddressbooks } from '@/api'
import { API } from 'apis'
import './index.scss'
const { Option } = Select

interface Props {
  open: boolean
  isEdit: boolean
  editData: any
  onCancel: () => void
  onSearch: () => void
}
enum Colors {
  'tag-red' = '1',
  'tag-purple' = '2',
  'tag-cyan' = '3',
  'tag-blue' = '4',
  'tag-green' = '5',
  'tag-yellow' = '6',
}

const Dialog = (props: Props, ref: any) => {
  const [form] = Form.useForm()
  const { message } = App.useApp()

  const options = [
    { label: '默认标签', color: 'tag-blue', value: '4' },
    { label: '红色标签', color: 'tag-red', value: '1' },
    { label: '紫色标签', color: 'tag-purple', value: '2' },
    { label: '青色标签', color: 'tag-cyan', value: '3' },
    { label: '绿色标签', color: 'tag-green', value: '5' },
    { label: '黄色标签', color: 'tag-yellow', value: '6' },
  ]

  useEffect(() => {
    if (props.isEdit) {
      form.resetFields()
      form.setFieldsValue({
        ...props.editData,
        // tag: props.editData ? Colors[props.editData.tag] : '',
      })
    }
  }, [props.open])

  const handleOk = async () => {
    if (props.isEdit) {
      // 编辑
      try {
        const formValues = await form.getFieldsValue()
        const res = await createAddressbooks({
          ...formValues,
          id: props.editData.id,
          tag: formValues ? Colors[formValues.tag] : '',
        })
        if (res.status == 'success') {
          message.success('编辑成功')
          props.onCancel()
          props.onSearch()
        }
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        const formValues = await form.getFieldsValue()
        let params = {
          ...formValues,
          tag: formValues ? Colors[formValues.tag] : '',
        }
        const res = await createAddressbooks(params)
        if (res.status == 'success') {
          message.success('创建成功')
          props.onCancel()
          props.onSearch()
        }
      } catch (error) {
        console.log(error)
      }
    }
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
      title={props.isEdit ? '编辑地址簿' : '创建地址簿'}
      onOk={handleOk}
      width={480}
      style={{ top: 240 }}
      data-class='create-address'
      closable={false}
      wrapClassName='modal-create-address'>
      <Form
        name='form-create-address'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        initialValues={{ tag: '4' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Form.Item label='地址簿名称' name='name' validateTrigger='onSubmit'>
          <Input
            placeholder='请输入名称，请将名称控制在 32 个字符以内'
            maxLength={32}
          />
        </Form.Item>
        <Form.Item label='选择标签' name='tag'>
          <Select placeholder='选择颜色'>
            {options.map((option) => (
              <Option key={option.value} value={option.value}>
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
