import { useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Input, Upload, Form, App, Image as AImage, Flex, Space } from 'antd'
import type { UploadFile, UploadProps } from 'antd'

import ADel from '@/components/aDel'

import './index.scss'

type Props = {
  logoSrc: string
  logoFile: UploadFile
  onChangeFile: (file: UploadFile, fileSrc: string) => void
  onDelFile: () => void
}

// 限制图片的宽高和大小
const logoWidth = 400
const logoHeight = 400
const maxFileSize = 50 // 50k
const accept = '.png,.jpg,.jpeg'

// logo上传
export default function Fn(props: Props) {
  const { message } = App.useApp()
  const [uploading, setUploading] = useState(false)
  const [delLoading, setDelLoading] = useState(false)

  // 删除
  const delLogoEvent = () => {
    setDelLoading(true)
    let timer = setTimeout(() => {
      props.onDelFile()
      setDelLoading(false)
      clearTimeout(timer)
    }, 300)
  }

  // 选择上传文件
  const uploadProps: UploadProps = {
    accept: accept,
    beforeUpload: (file) => {
      setUploading(true)
      let img_w: number, img_h: number
      const isLt50k = file.size < maxFileSize * 1024
      try {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = new Image()
          img.src = e.target.result as string
          img.onload = async () => {
            img_w = img.width
            img_h = img.height
            if (img_w != logoWidth || img_h != logoHeight || !isLt50k) {
              setUploading(false)
              message.error('请上传400 * 400，最大50k的图片', 4)
              return false
            }
            props.onChangeFile(file, e.target.result as string)
            setUploading(false)
          }
        }
        reader.readAsDataURL(file)
      } catch (error) {
        setUploading(false)
      }
      return false
    },
    fileList: [],
    maxCount: 1,
  }

  return (
    <div className='upload-logo'>
      <Form.Item hidden name='logo'>
        <Input type='text' />
      </Form.Item>
      <Form.Item
        label='Chatbot 头像'
        required
        extra={
          <div style={{ marginTop: '8px' }}>
            支持的文件类型：png、jpg、jpeg，尺寸400*400，大小限50K
          </div>
        }>
        <Flex align='center' gap={12}>
          <Upload {...uploadProps}>
            <div className='upload-btn fx-center-center'>
              {props.logoSrc ? (
                <AImage src={props.logoSrc} preview={false} alt='' />
              ) : (
                <span className='icon iconfont icon-jiqiren-filled jiqiren'></span>
              )}
              {uploading ? (
                <div className='loading fx-center-center'>
                  <LoadingOutlined className='fn22' />
                </div>
              ) : null}
            </div>
          </Upload>
          <Space style={{ color: '#999' }}>
            <span>{props.logoFile ? props.logoFile.name : ''}</span>
            {props.logoSrc && (
              <ADel onDel={delLogoEvent} loading={delLoading} />
            )}
          </Space>
        </Flex>
      </Form.Item>
    </div>
  )
}
