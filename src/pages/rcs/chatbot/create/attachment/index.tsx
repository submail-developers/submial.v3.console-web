import { useState, useEffect } from 'react'
import { Input, Upload, Form, App, Flex, Space, Button } from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import ADel from '@/components/aDel'

import './index.scss'

type Props = {
  fileList: UploadFile[]
  onChangeFile: (fileList: UploadFile[]) => void
  onDelFile: () => void
}

// 文件限制
const maxFileSize = 1024 * 5 // 5M
const accept = '.pdf,.doc,.jpg,.jpeg,.gif,.docx,.rar,.zip'

// 证明材料上传
export default function Fn(props: Props) {
  const { message } = App.useApp()
  const [uploading, setUploading] = useState(false)
  // 选择上传文件
  const uploadProps: UploadProps = {
    accept: accept,
    onRemove: (file) => {
      props.onDelFile()
    },
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
            if (!isLt50k) {
              setUploading(false)
              message.error('上传文件最大5M', 4)
              return false
            }
            props.onChangeFile([file])
            setUploading(false)
            // setFileList([file])
          }
        }
        reader.readAsDataURL(file)
      } catch (error) {
        setUploading(false)
      }
      return false
    },
    fileList: props.fileList,
    maxCount: 1,
  }

  return (
    <div className='upload-attachment'>
      <Form.Item
        label='证明材料'
        name='attachment'
        extra={
          '您可上传的文件类型包含：pdf、doc、jpg、jpeg、gif、docx、rar、zip,单个附件大小限5M,限上传1个文件。'
        }>
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined rev={undefined} />} className='upload'>
            上传
          </Button>
        </Upload>
      </Form.Item>
    </div>
  )
}
