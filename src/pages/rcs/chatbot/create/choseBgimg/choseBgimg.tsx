import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, App, Upload, Button } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import type { RadioChangeEvent } from 'antd'
import ModelFooter from '../antd/modelFooter/modelFooter'

import { API } from 'apis'
import './choseBgimg.scss'

// import ava1 from '@/assets/rcs/aco1.png'
// import ava2 from '@/assets/rcs/aco1.png'

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
    setIsModalOpen(false)
  }

  const onFinish = () => {}
  const onFinishFailed = () => {}

  //默认头像
  // const defaultAvatar = [
  //   {
  //     id: 1,
  //     name: '背景1',
  //     imgSrc: ava1,
  //   },
  //   {
  //     id: 2,
  //     name: '背景2',
  //     imgSrc: ava2,
  //   },
  // ]
  //头像切换
  const handelImg = (id) => {
    setAvatar(id)
  }

  return (
    <Modal
      title='选择背景图'
      width={480}
      style={{ top: 240 }}
      data-class='chose-bgimg'
      closable={false}
      onCancel={handleCancel}
      wrapClassName='modal-reset'
      footer={<ModelFooter onOk={handleOk} onCancel={handleCancel} />}
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
        <Form.Item label='默认背景图' name='' validateTrigger='onSubmit'>
          <div>
            <div className='avatar-img active'>
              {/* <div className='defalutBg'></div> */}
              <div className='defalutBg'></div>
            </div>
          </div>
        </Form.Item>
        <Form.Item label='自定义背景图'>
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
