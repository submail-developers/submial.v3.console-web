import React, { useRef, useState } from 'react'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload, Form, App } from 'antd'
import type { GetProp, UploadFile, UploadProps } from 'antd'

import './index.scss'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]
type Props = {
  onSetLogo: (str) => void
}

const beforeUpload = (file: FileType) => {}

export default function Fn(props: Props) {
  const { message } = App.useApp()
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [imgsrc, setImgSrc] = useState('')
  const [uploading, setUploading] = useState(false)

  const uploadProps: UploadProps = {
    accept: '.png,.jpg,.jpeg',
    onRemove: (file) => {
      const index = fileList.indexOf(file)
      const newFileList = fileList.slice()
      newFileList.splice(index, 1)
      setFileList(newFileList)
    },
    beforeUpload: (file) => {
      console.log(file)
      const isLt50k = file.size / 1024 < 50
      if (!isLt50k) {
        message.error('最大50k')
        return false
      }
      setFileList([file])

      return false
    },
    fileList,
    maxCount: 1,
  }

  return (
    <div className='upload-logo'>
      <Form.Item hidden name='logo'>
        <input type='text' />
      </Form.Item>
      <Form.Item
        label='Chatbot 头像'
        required
        extra={
          <div style={{ marginTop: '8px' }}>
            支持的文件类型：png、jpg、jpeg，尺寸400*400，大小限50K
          </div>
        }>
        <Upload {...uploadProps}>
          <div className='upload-btn fx-center-center'>
            {imgsrc ? (
              <img src={imgsrc} alt='' />
            ) : (
              <span className='icon iconfont icon-jiqiren1 jiqiren'></span>
            )}
          </div>
        </Upload>
      </Form.Item>
    </div>
  )
}
