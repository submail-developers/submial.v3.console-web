import { useState, useEffect } from 'react'
import { Modal, Form, App, Upload, Button, Image as AImage } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'
import ModelFooter from '../../antd/modelFooter/modelFooter'

import './index.scss'

// 限制图片的宽高和大小
const maxFileSize = 20 * 1024 // 20k
const accept = '.png,.jpg,.jpeg'
interface Props {
  onOk: (file: UploadFile, src: string) => void
  open: boolean
  onCancel: () => void
}
const Dialog = (props: Props, ref: any) => {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [imgSrc, setimgSrc] = useState('')
  const [fileList, setFilseList] = useState<UploadFile[]>([])

  const handleOk = async () => {
    props.onOk(fileList[0], imgSrc)
  }

  const handleCancel = () => {
    props.onCancel()
  }

  const handelImg = () => {
    setimgSrc('')
    setFilseList([])
  }

  // 选择上传文件
  const uploadProps: UploadProps = {
    accept: accept,
    beforeUpload: (file) => {
      let img_w: number, img_h: number
      const isLt20k = file.size < maxFileSize
      try {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new Image()
          img.src = e.target.result as string
          img.onload = async () => {
            img_w = img.width
            img_h = img.height
            if (!isLt20k) {
              message.error('请上传最大20k的图片', 4)
              return false
            }
            setimgSrc(e.target.result as string)
            setFilseList([file])
          }
        }
        reader.readAsDataURL(file)
      } catch (error) {}
      return false
    },
    fileList: [],
    maxCount: 1,
  }

  useEffect(() => {
    if (props.open) {
    }
  }, [props.open])

  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      title='选择背景图'
      width={480}
      style={{ top: 240 }}
      data-class='chose-bgimg'
      closable={false}
      wrapClassName='modal-reset'
      footer={<ModelFooter onOk={handleOk} onCancel={handleCancel} />}>
      <Form
        name='form-bg'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        autoComplete='off'>
        <Form.Item label='默认背景图' name='' validateTrigger='onSubmit'>
          <div>
            <div
              className={`avatar-img ${!imgSrc && 'active'}`}
              onClick={handelImg}>
              <div className='defalutBg'></div>
            </div>
          </div>
        </Form.Item>
        <Form.Item label='自定义背景图'>
          <Upload {...uploadProps}>
            {imgSrc && (
              <AImage
                src={imgSrc}
                width={60}
                height={60}
                alt=''
                preview={false}
              />
            )}
            <Button icon={<UploadOutlined rev={undefined} />}>上传</Button>
          </Upload>

          <p className='upload-p' style={{ marginTop: '8px' }}>
            您可上传的文件类型：png、jpg、jpeg，单个附件大小限20kb，限上传1个文件
          </p>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default Dialog
