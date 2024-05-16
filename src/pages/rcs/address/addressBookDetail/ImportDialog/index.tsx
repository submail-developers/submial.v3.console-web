import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, App, Upload, Button, Input, Select } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import { API } from 'apis'
import './index.scss'
const { Option } = Select

interface Props {
  open: boolean
  isEdit: boolean
  onCancel: () => void
}

const Dialog = (props: Props, ref: any) => {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const { TextArea } = Input

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
      title={props.isEdit ? '编辑地址簿' : '导入联系人'}
      width={480}
      style={{ top: 240 }}
      data-class='create-address'
      closable={false}
      wrapClassName='modal-create-address'>
      <Form
        name='form'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        autoComplete='off'>
        <Form.Item
          label={
            <div>
              <span className='color-gray'>
                多个联系人号码输入时，请用逗号隔开
              </span>
            </div>
          }
          labelCol={{ span: 24 }}
          name='mobile'>
          <TextArea
            rows={6}
            className='color-words'
            style={{ fontSize: '16px', color: '#282b31' }}
          />
        </Form.Item>
        <Form.Item label='从文件导入'>
          <div key={Math.random()}>
            <Upload {...props}>
              <Button icon={<UploadOutlined rev={undefined} />}>
                选择文件
              </Button>
              <p
                className='color-gray'
                style={{ fontSize: '12px', margin: '0px' }}>
                仅支持 TXT , CSV, VCF , excel 格式
                <br />
                超过十万条手机号建议使用CSV或TXT格式
              </p>
            </Upload>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
