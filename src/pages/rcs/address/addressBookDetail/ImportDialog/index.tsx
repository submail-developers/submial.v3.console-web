import { useState, useImperativeHandle, forwardRef, useRef } from 'react'
import { Modal, Form, App, Upload, Button, Input, Select } from 'antd'
import { addAddressMobileList, uploadAddressFile } from '@/api'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd/es/upload/interface'

import { API } from 'apis'
import './index.scss'
const { Option } = Select

interface Props {
  id: string
  open: boolean
  isEdit: boolean
  onCancel: () => void
  getAddressDetailList: () => void
}

const Dialog = (props: Props, ref: any) => {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const { TextArea } = Input
  const [fileList, setFileList] = useState<UploadFile[]>([])

  const options = [
    { label: '无标签', value: 'none', color: '#282b31' },
    { label: '红色', value: 'red', color: '#ff4446' },
    { label: '紫色', value: 'purple', color: '#6f42c1' },
    { label: '青色', value: 'cyan', color: '#17a2b8' },
    { label: '蓝色', value: 'blue', color: '#1764ff' },
    { label: '绿色', value: 'green', color: '#17c13d' },
    { label: '黄色', value: 'yellow', color: '#ffba00' },
  ]

  const propsUpload: UploadProps = {
    accept: '.txt, .xlsx, .xls, .csv, .vcf',
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      setFileList([file])
      return false // 返回false-手动上传文件
    },
    fileList,
  }

  // 上传
  const handleOk = async () => {
    const params = await form.validateFields()
    if (fileList.length == 0 && !Boolean(params.address)) {
      message.warning('请输入手机号码或上传文件')
      return
    }

    // 手机号上传
    if (Boolean(params.address)) {
      await addAddressMobileList({
        ...params,
        id: props.id,
      })

      if (fileList.length == 0) {
        message.destroy()
        message.success('上传成功！')
        props.onCancel()
        props.getAddressDetailList()
        form.resetFields()
        setFileList([])
      }
    }
    // 文件上传
    if (fileList.length > 0) {
      // 上传文件
      let res1
      let groupedArray = []
      res1 = await uploadAddressFile({
        file: fileList[0],
      })
      groupedArray.push({
        id: res1.id,
        type: res1.type,
        data: res1.file,
      })

      const res2 = await addAddressMobileList({
        id: props.id,
        address: '',
        data: groupedArray,
      })
      if (res2.status == 'success') {
        message.success('上传成功！')
        props.onCancel()
        props.getAddressDetailList()
        form.resetFields()
        setFileList([])
      }
    }
  }

  const handleCancel = () => {
    form.resetFields()
    setFileList([])
    props.onCancel()
  }

  const onFinish = () => {}
  const onFinishFailed = () => {}

  return (
    <Modal
      onOk={handleOk}
      open={props.open}
      onCancel={handleCancel}
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
          name='address'>
          <TextArea
            rows={6}
            className='color-words'
            style={{ fontSize: '16px', color: '#282b31' }}
          />
        </Form.Item>
        <Form.Item label='从文件导入'>
          <div key={Math.random()}>
            <Upload {...propsUpload}>
              <Button icon={<UploadOutlined rev={undefined} />}>
                选择文件
              </Button>
              <p
                className='gray-color'
                style={{ fontSize: '12px', marginTop: '10px' }}>
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
