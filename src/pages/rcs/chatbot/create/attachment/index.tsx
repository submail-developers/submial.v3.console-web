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
  const [fileList2, setFileList2] = useState<UploadFile[]>([])

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
  // const uploadProps: UploadProps = {
  //   accept: accept,
  //   beforeUpload: (file) => {
  //     setUploading(true)
  //     let img_w: number, img_h: number
  //     const isLt50k = file.size < maxFileSize * 1024
  //     try {
  //       const reader = new FileReader()
  //       reader.onload = (e) => {
  //         const img = new Image()
  //         img.src = e.target.result as string
  //         img.onload = async () => {
  //           img_w = img.width
  //           img_h = img.height
  //           if (!isLt50k) {
  //             setUploading(false)
  //             message.error('上传文件最大5M', 4)
  //             return false
  //           }
  //           props.onChangeFile(file, e.target.result as string)
  //           setUploading(false)
  //         }
  //       }
  //       reader.readAsDataURL(file)
  //     } catch (error) {
  //       setUploading(false)
  //     }
  //     return false
  //   },
  //   fileList: [],
  //   maxCount: 1,
  // }

  const propsBgimg: UploadProps = {
    accept: '.pdf, .doc, .docx, .jpg, .jpeg, .gif, .rar, .zip',
    onRemove: (file) => {
      const index = fileList2.indexOf(file)
      const newFileList = fileList2.slice()
      newFileList.splice(index, 1)
      setFileList2(newFileList)
    },
    beforeUpload: (file) => {
      const isLt10M = file.size / 1024 / 1024 < 10
      if (!isLt10M) {
        message.error('文件不允许超过10M！')
      } else {
        setFileList2([file])
        return false
      }
    },
    fileList: fileList2,
  }

  return (
    <div className='upload-attachment'>
      <Form.Item
        label='营业执照'
        name='attachment'
        required
        extra={
          '您可上传的文件类型包含：pdf、doc、jpg、jpeg、gif、docx、rar、zip,单个附件大小限5M,限上传1个文件。'
        }>
        <Upload {...propsBgimg}>
          <Button icon={<UploadOutlined rev={undefined} />} className='upload'>
            上传
          </Button>
        </Upload>
      </Form.Item>
    </div>
  )
}
