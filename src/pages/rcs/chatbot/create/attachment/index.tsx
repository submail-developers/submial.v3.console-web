import { useState } from 'react'
import { Input, Upload, Form, App, Flex, Space, Button } from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import ADel from '@/components/aDel'

import './index.scss'

type Props = {
  attachmentSrc: string
  attachmentFile: UploadFile
  onChangeFile: (file: UploadFile, fileSrc: string) => void
  onDelFile: () => void
}

// 文件限制
const maxFileSize = 1024 * 5 // 5M
const accept = '.pdf,.doc,.jpg,.jpeg,.gif,.docx,.rar,.zip'

// 证明材料上传
export default function Fn(props: Props) {
  const { message } = App.useApp()
  const [uploading, setUploading] = useState(false)
  const [delLoading, setDelLoading] = useState(false)

  // 删除
  const delEvent = () => {
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
            if (!isLt50k) {
              setUploading(false)
              message.error('上传文件最大5M', 4)
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
    <div className='upload-attachment'>
      <Form.Item hidden name='backgroundImage'>
        <Input type='text' />
      </Form.Item>
      <Form.Item
        label='证明材料'
        extra={
          <div style={{ marginTop: '8px' }}>
            支持的文件类型：pdf、doc、jpg、jpeg、gif、docx、rar、zip，大小限5M
          </div>
        }>
        <Flex align='center' gap={12}>
          <Upload {...uploadProps}>
            <div className='upload-btn fx-center-center'>
              <Button loading={uploading} icon={<UploadOutlined />}>
                上传
              </Button>
            </div>
          </Upload>
          <Space style={{ color: '#999' }} align='center'>
            <span>{props.attachmentFile ? props.attachmentFile.name : ''}</span>
            {props.attachmentSrc && (
              <ADel onDel={delEvent} loading={delLoading} />
            )}
          </Space>
        </Flex>
      </Form.Item>
    </div>
  )
}
