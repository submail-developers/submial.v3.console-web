import { useEffect, useState } from 'react'
import { Modal, Form, App, Upload, Button, Image as AImage } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { UploadFile, UploadProps } from 'antd'

import { defaultAvatarSrc } from '@/pages/rcs/chatbot/type'
import ModelFooter from '../../antd/modelFooter/modelFooter'

import './index.scss'

interface Props {
  src: string
  onOk: (file: UploadFile, src: string) => void
  open: boolean
  onCancel: () => void
}
// 限制图片的宽高和大小
const logoWidth = 400
const logoHeight = 400
const maxFileSize = 50 * 1024 // 50k
const accept = '.jpg,.jpeg'

const Dialog = (props: Props, ref: any) => {
  const [form] = Form.useForm()
  const [fileList, setFilseList] = useState<any[]>([])
  const { message } = App.useApp()
  const [imgSrc, setimgSrc] = useState(defaultAvatarSrc)

  // 选择上传文件
  const uploadProps: UploadProps = {
    accept: accept,
    beforeUpload: (file) => {
      let img_w: number, img_h: number
      const isLt50k = file.size < maxFileSize
      try {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new Image()
          img.src = e.target.result as string
          img.onload = async () => {
            img_w = img.width
            img_h = img.height
            if (img_w != logoWidth || img_h != logoHeight || !isLt50k) {
              message.error('请上传400 * 400，最大50k的图片', 4)
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

  const handleOk = () => {
    if (imgSrc == defaultAvatarSrc) {
      props.onOk(null, imgSrc)
    } else {
      props.onOk(fileList[0], imgSrc)
    }
  }

  const handleCancel = () => {
    props.onCancel()
  }

  //默认头像
  const defaultAvatar = [
    {
      id: 2,
      name: '头像2',
      imgSrc: defaultAvatarSrc,
    },
  ]
  //头像切换
  const handelImg = (item) => {
    setimgSrc(item.imgSrc)
  }

  useEffect(() => {
    if (props.open) {
      setimgSrc(props.src)
    }
  }, [props.src, props.open])

  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      title='选择默认头像'
      width={480}
      style={{ top: 240 }}
      data-class='chose-avatar'
      closable={false}
      wrapClassName='modal-reset'
      footer={<ModelFooter onOk={handleOk} onCancel={handleCancel} />}>
      <Form
        name='form-0'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        autoComplete='off'>
        <Form.Item label='默认头像' name='' validateTrigger='onSubmit'>
          <div>
            {defaultAvatar.map((item) => (
              <div
                className={`avatar-img ${imgSrc === item.imgSrc && 'active'}`}
                key={item.id}
                onClick={() => handelImg(item)}>
                <img src={item.imgSrc} alt='' />
              </div>
            ))}
          </div>
        </Form.Item>
        <Form.Item label='自定义头像'>
          {imgSrc && imgSrc != defaultAvatarSrc && (
            <AImage
              src={imgSrc}
              width={60}
              height={60}
              className='m-r-10'
              alt=''
              preview={false}
            />
          )}
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined rev={undefined} />}>上传头像</Button>
          </Upload>
          <p className='upload-p' style={{ marginTop: '8px' }}>
            您可上传的文件类型：jpg、jpeg，单个附件大小限50kb，宽高为400*400，限上传
            1个文件。
          </p>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default Dialog
