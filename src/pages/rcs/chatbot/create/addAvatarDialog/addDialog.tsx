import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, App, Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { RadioChangeEvent } from 'antd'
import ModelFooter from '../antd/modelFooter/modelFooter'

import { API } from 'apis'
import './addDialog.scss'

import ava1 from '@/assets/rcs/avatarImgs/ava1.png'
import ava2 from '@/assets/rcs/avatarImgs/ava2.png'
import ava3 from '@/assets/rcs/avatarImgs/ava3.png'
import ava4 from '@/assets/rcs/avatarImgs/ava4.png'

interface Props {
  // onSearch: () => void
}
interface OpenParams {}

const Dialog = ({}: Props, ref: any) => {
  const [form] = Form.useForm()
  interface Props {
    // onSearch: () => void
  }
  interface OpenParams {}

  const { message } = App.useApp()
  const [avatar, setAvatar] = useState(1)
  const [imgSrc, setimgSrc] = useState(ava1)

  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const onChange = (e: RadioChangeEvent) => {
    console.log('checked = ', e)
  }

  const open = (params: OpenParams) => {
    setIsModalOpen(true)
  }

  const handleOk = async () => {}

  const handleCancel = () => {
    setAvatar(1)
    setIsModalOpen(false)
  }

  const onFinish = () => {}
  const onFinishFailed = () => {}

  //默认头像
  const defaultAvatar = [
    {
      id: 1,
      name: '头像1',
      imgSrc: ava1,
    },
    {
      id: 2,
      name: '头像2',
      imgSrc: ava2,
    },
    {
      id: 3,
      name: '头像3',
      imgSrc: ava3,
    },
    {
      id: 4,
      name: '头像4',
      imgSrc: ava4,
    },
  ]
  //头像切换
  const handelImg = (item) => {
    setAvatar(item.id)
    setimgSrc(item.imgSrc)
  }

  return (
    <Modal
      title='选择默认头像'
      width={480}
      style={{ top: 240 }}
      data-class='chose-avatar'
      closable={false}
      onCancel={handleCancel}
      wrapClassName='modal-reset'
      footer={
        <ModelFooter onOk={handleOk} onCancel={handleCancel} imgSrc={imgSrc} />
      }
      open={isModalOpen}>
      <Form
        name='form-0'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        initialValues={{ enabled: '1' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Form.Item label='默认头像' name='' validateTrigger='onSubmit'>
          <div>
            {defaultAvatar.map((item) => (
              <div
                className={`avatar-img ${avatar === item.id && 'active'}`}
                key={item.id}
                onClick={() => handelImg(item)}>
                <img src={item.imgSrc} alt='' />
              </div>
            ))}
          </div>
        </Form.Item>
        <Form.Item label='自定义头像'>
          <div key={Math.random()}>
            <Upload>
              <Button
                icon={<UploadOutlined rev={undefined} />}
                style={{ width: 120, height: 40 }}>
                上传
              </Button>
              <p className='upload-p' style={{ marginTop: '8px' }}>
                您可上传的文件类型：png、jpg、jpeg,单个附件大小限2M，限上传
                1个文件。
              </p>
            </Upload>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
