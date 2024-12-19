import { useState } from 'react'
import { Input, Form, Image as AImage, Flex, Button, Space } from 'antd'
import type { UploadFile } from 'antd'
import ava2 from '@/assets/rcs/avatarImgs/ava2.png'
import ADel from '@/components/aDel'
import AvatarDialog from './avatarDialog'
import './index.scss'
import { defaultAvatarSrc } from '../../type'

type Props = {
  logoSrc: string
  logoFile: UploadFile
  onChangeFile: (file: UploadFile, fileSrc: string) => void
  onDelFile: () => void
}

// logo上传
export default function Fn(props: Props) {
  const [delLoading, setDelLoading] = useState(false)
  const [openTypeModal, setopenTypeModal] = useState(false)

  // 删除
  const delLogoEvent = () => {
    setDelLoading(true)
    let timer = setTimeout(() => {
      props.onDelFile()
      setDelLoading(false)
      clearTimeout(timer)
    }, 300)
  }

  const chooseAvatar = (file: UploadFile, src: string) => {
    props.onChangeFile(file, src)
    setopenTypeModal(false)
  }

  return (
    <div className='upload-logo'>
      <Form.Item hidden name='logo'>
        <Input type='text' />
      </Form.Item>
      <Form.Item label='Chatbot 头像' required rules={[{ required: true }]}>
        <Flex align='center' gap={12}>
          <div className='upload-btn fx-center-center'>
            {props.logoSrc ? (
              <AImage src={props.logoSrc} preview={false} alt='' />
            ) : (
              <img src={ava2} alt='' />
            )}
          </div>
          <Space style={{ color: '#999' }}>
            {/* <span>{props.logoFile ? props.logoFile.name : ''}</span> */}
            {props.logoSrc && props.logoSrc != defaultAvatarSrc && (
              <ADel onDel={delLogoEvent} loading={delLoading} />
            )}
          </Space>

          <Button
            className='chose-avatar'
            type='primary'
            size='large'
            onClick={() => setopenTypeModal(true)}>
            选择头像
          </Button>
        </Flex>
      </Form.Item>
      <AvatarDialog
        src={props.logoSrc}
        onOk={chooseAvatar}
        open={openTypeModal}
        onCancel={() => setopenTypeModal(false)}
      />
    </div>
  )
}
