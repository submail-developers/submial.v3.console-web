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
import ChooseBgDialog from './bgImgDialog'
import './index.scss'
import ava2 from '@/assets/rcs/avatarImgs/bgnone.png'
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
  const [openTypeModal, setopenTypeModal] = useState(false)

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

  const chooseBg = (file: UploadFile, src: string) => {
    props.onChangeFile(file, src)
  }
  return (
    <div className='upload-bg'>
      <Form.Item hidden name='backgroundImage'>
        <Input type='text' />
      </Form.Item>

      <Form.Item label='背景图'>
        <Flex align='center' gap={12}>
          <div className='upload-btn fx-center-center'>
            {props.bgSrc ? (
              <AImage src={props.bgSrc} preview={false} alt='' />
            ) : (
              <img src={ava2} alt='' />
            )}
            {uploading ? (
              <div className='loading fx-center-center'>
                <LoadingOutlined className='fn22' rev={null} />
              </div>
            ) : null}
          </div>
          <Space style={{ color: '#999' }}>
            <span>{props.bgFile ? props.bgFile.name : ''}</span>
            {props.bgSrc && <ADel onDel={delEvent} loading={delLoading} />}
          </Space>
          <Button
            className='choseBgimg'
            type='primary'
            size='large'
            style={{ width: 120 }}
            onClick={() => setopenTypeModal(true)}>
            选择背景图
          </Button>
        </Flex>
      </Form.Item>
      <ChooseBgDialog
        onOk={chooseBg}
        open={openTypeModal}
        onCancel={() => setopenTypeModal(false)}
      />
    </div>
  )
}
