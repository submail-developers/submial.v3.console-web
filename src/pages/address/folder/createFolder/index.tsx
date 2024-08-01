import { forwardRef, useEffect, useState } from 'react'
import { Modal, Form, App, Input, Select } from 'antd'
import { createAddressbooksFolder } from '@/api'
import { tags_number, TagsColorEnum } from '@/pages/address/type'
import './index.scss'
interface Props {
  open: boolean
  isEdit: boolean
  onCancel: () => void
  onOk: () => void
  onSearch: () => void
  editData
}

const Dialog = (props: Props, ref: any) => {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (form) {
      form.resetFields()
      if (props.isEdit) {
        form.setFieldsValue({
          ...props.editData,
        })
      }
    }
  }, [props.open, form, props.isEdit])
  const handleOk = async () => {
    setLoading(true)
    try {
      const formValues = await form.validateFields()
      const res = await createAddressbooksFolder({
        ...formValues,
        id: props.isEdit ? props.editData.id : '',
        type: 1,
        description: '',
        tag: formValues ? TagsColorEnum[formValues.tag] : '',
      })
      if (res.status == 'success') {
        message.success('保存成功')
        props.onCancel()
        props.onSearch()
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      title={props.isEdit ? '编辑文件夹' : '创建文件夹'}
      onOk={handleOk}
      width={480}
      confirmLoading={loading}
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
        initialValues={{ tag: '0' }}
        autoComplete='off'>
        <Form.Item
          label='文件夹名称'
          name='title'
          rules={[
            {
              required: true,
            },
            {
              max: 32,
            },
          ]}
          validateTrigger='onSubmit'>
          <Input
            placeholder='请输入名称，请将名称控制在 32 个字符以内'
            maxLength={32}
          />
        </Form.Item>
        <Form.Item label='选择标签' name='tag'>
          <Select placeholder='选择颜色' options={tags_number}></Select>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
