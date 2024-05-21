import { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Modal, Form, App, Upload, Button, Input, Select } from 'antd'
import { createAddressbooksFolder } from '@/api'
import { API } from 'apis'
import './index.scss'
const { Option } = Select
interface Props {
  open: boolean
  isEdit: boolean
  onCancel: () => void
  onOk: () => void
  onSearch: () => void
  editData
}

enum Colors {
  'tag-red' = 1,
  'tag-purple' = 2,
  'tag-cyan' = 3,
  'tag-blue' = 4,
  'tag-green' = 5,
  'tag-yellow' = 6,
}

const Dialog = (props: Props, ref: any) => {
  const [form] = Form.useForm()
  const { message } = App.useApp()

  const options = [
    { label: '无标签', color: 'tag-blue', value: '4' },
    { label: '无标签', color: 'tag-blue', value: '0' },
    { label: '红色', color: 'tag-red', value: '1' },
    { label: '紫色', color: 'tag-purple', value: '2' },
    { label: '青色', color: 'tag-cyan', value: '3' },
    { label: '绿色', color: 'tag-green', value: '5' },
    { label: '黄色', color: 'tag-yellow', value: '6' },
  ]
  useEffect(() => {
    form.resetFields()
    form.setFieldsValue({
      ...props.editData,
    })
  }, [props.open])
  const handleOk = async () => {
    if (props.isEdit) {
      // 编辑
      try {
        const formValues = await form.getFieldsValue()
        const res = await createAddressbooksFolder({
          ...formValues,
          id: props.editData.id,
          type: 1,
          description: '',
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
          id: '',
          type: 1,
          description: '',
          tag: formValues ? Colors[formValues.tag] : '',
        }
        const res = await createAddressbooksFolder(params)
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
      title={props.isEdit ? '编辑地址簿文件夹' : '创建地址簿文件夹'}
      onOk={handleOk}
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
        initialValues={{ tag: '4' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Form.Item
          label='地址簿文件夹名称'
          name='title'
          validateTrigger='onSubmit'>
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
