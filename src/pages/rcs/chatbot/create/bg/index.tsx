import { useState, MutableRefObject, useRef } from 'react'
import {
  Input,
  Upload,
  Form,
  App,
  Image as AImage,
  Flex,
  Space,
  Button,
} from 'antd'
import type { UploadFile, UploadProps } from 'antd'
import { LoadingOutlined, UploadOutlined, EyeOutlined } from '@ant-design/icons'
import ADel from '@/components/aDel'
import APreviewImg from '@/components/aPreviewImg'
import AddDialog from '../choseBgimg/choseBgimg'
import './index.scss'

type Props = {
  bgSrc: string
  bgFile: UploadFile
  onChangeFile: (file: UploadFile, fileSrc: string) => void
  onDelFile: () => void
}

// 文件限制
const maxFileSize = 20 // 20k
const accept = '.png,.jpg,.jpeg'

// 背景图上传
export default function Fn(props: Props) {
  const { message } = App.useApp()
  const [uploading, setUploading] = useState(false)
  const [delLoading, setDelLoading] = useState(false)
  const [visible, setVisible] = useState(false)
  const addDialogRef: MutableRefObject<any> = useRef(null)

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
              message.error('请上传最大20k的图片', 4)
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
  // 展示背景弹窗
  const showDialog = () => {
    addDialogRef.current.open()
  }
  return (
    <div className='upload-bg'>
      <Form.Item hidden name='backgroundImage'>
        <Input type='text' />
      </Form.Item>
      {/* <Form.Item
        label='背景图12'
        extra={
          <div style={{ marginTop: '8px' }}>
            支持的文件类型：png、jpg、jpeg，附件大小限20K
          </div>
        }>
        <Flex align='center' gap={12}>
          <Upload {...uploadProps}>
            <div className='upload-btn fx-center-center'>
              {props.bgSrc ? (
                <>
                  <AImage
                    src={props.bgSrc}
                    alt=''
                    width={32}
                    height={32}
                    preview={false}
                  />
                  <UploadOutlined className='image-wrap-icon' />
                  <div className='bg-model'></div>
                </>
              ) : (
                <Button icon={<UploadOutlined />}>上传</Button>
              )}

              {uploading ? (
                <div className='loading fx-center-center'>
                  <LoadingOutlined className='fn22' />
                </div>
              ) : null}
            </div>
          </Upload>
          <Space style={{ color: '#999' }} align='center'>
            <span>{props.bgFile ? props.bgFile.name : ''}</span>
            {props.bgSrc && (
              <>
                <APreviewImg src={props.bgSrc} style={{ color: '#999' }} />
                <ADel onDel={delEvent} loading={delLoading} />
              </>
            )}
          </Space>
        </Flex>
      </Form.Item> */}
      <Form.Item label='背景图' required>
        <Flex align='center' gap={12}>
          <div className='upload-btn fx-center-center'>
            <span className='icon iconfont icon-jiqiren-filled jiqiren'></span>
          </div>
          <Button
            className='choseBgimg'
            type='primary'
            size='large'
            style={{ width: 120 }}
            onClick={showDialog}>
            选择背景图
          </Button>
        </Flex>
      </Form.Item>
      <AddDialog ref={addDialogRef} />
    </div>
  )
}
