import { useEffect, forwardRef } from 'react'
import { Modal, Form, App, Input, Select } from 'antd'
import { createAddressbooks } from '@/api'
import { tags_number, TagsColorEnum } from '@/pages/address/type'
import './index.scss'

interface Props {
  open: boolean
  isEdit: boolean
  editData: any
  onCancel: () => void
  onSearch: () => void
}

const Dialog = (props: Props, ref) => {
  const [form] = Form.useForm()
  const { message } = App.useApp()

  useEffect(() => {
    form.resetFields()
    if (props.isEdit && props.open) {
      form.setFieldsValue({
        ...props.editData,
        tag:
          props.editData && props.editData.tag.includes('tag')
            ? `${TagsColorEnum[props.editData.tag]}`
            : `${props.editData?.tag}`,
      })
    }
  }, [props.open])

  const handleOk = async () => {
    if (props.isEdit) {
      // 编辑
      try {
        const formValues = await form.validateFields()
        const res = await createAddressbooks({
          ...formValues,
          id: props.editData.id,
          tag: formValues ? TagsColorEnum[formValues.tag] : '',
        })
        if (res.status == 'success') {
          message.success('编辑成功')
          props.onCancel()
          props.onSearch()
        }
      } catch (error) {}
    } else {
      try {
        const formValues = await form.validateFields()
        let params = {
          ...formValues,
          tag: formValues ? TagsColorEnum[formValues.tag] : '',
        }
        const res = await createAddressbooks(params)
        if (res.status == 'success') {
          message.success('创建成功')
          props.onCancel()
          props.onSearch()
        }
      } catch (error) {}
    }
  }

  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      title={props.isEdit ? '编辑地址簿' : '创建地址簿'}
      onOk={handleOk}
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
        initialValues={{ tag: '0' }}
        autoComplete='off'>
        <Form.Item
          label='地址簿名称'
          name='name'
          validateTrigger='onSubmit'
          rules={[
            {
              required: true,
            },
            {
              max: 32,
            },
          ]}>
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
