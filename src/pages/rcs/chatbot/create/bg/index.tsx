import { useState } from 'react'
import { Input, Form, Image as AImage, Flex, Space, Button } from 'antd'
import type { UploadFile } from 'antd'
import ADel from '@/components/aDel'
import ChooseBgDialog from './bgImgDialog'
import './index.scss'
import ava2 from '@/assets/rcs/avatarImgs/bgnone.png'
type Props = {
  bgSrc: string
  bgFile: UploadFile
  onChangeFile: (file: UploadFile, fileSrc: string) => void
  onDelFile: () => void
}

// 背景图上传
export default function Fn(props: Props) {
  const [delLoading, setDelLoading] = useState(false)
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

  const chooseBg = (file: UploadFile, src: string) => {
    props.onChangeFile(file, src)
    setopenTypeModal(false)
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
              <AImage src={props.bgSrc} alt='' />
            ) : (
              <img src={ava2} alt='' />
            )}
          </div>
          <Space style={{ color: '#999' }}>
            {/* <span>{props.bgFile ? props.bgFile.name : ''}</span> */}
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
