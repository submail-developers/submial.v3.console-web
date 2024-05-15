import { useState, useImperativeHandle, forwardRef } from 'react'
import { Modal, Form, App } from 'antd'
import codeImg from '@/assets/rcs/address/blue.png'

import { API } from 'apis'
import './index.scss'

interface Props {
  open: boolean
  onCancel: () => void
}

const Dialog = (props: Props, ref: any) => {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [addressList, setAddressList] = useState()

  const handleOk = () => {
    props.onCancel()
  }

  const handleCancel = () => {
    props.onCancel()
  }

  const onFinish = () => {}
  const onFinishFailed = () => {}

  const list = [
    {
      id: '1',
      title: '赛邮云技术部通讯录1',
      num: '199',
    },
    {
      id: '2',
      title: '赛邮云技术部通讯录2',
      num: '29',
    },
    {
      id: '3',
      title: '赛邮云技术部通讯录3',
      num: '99',
    },
  ]

  const handelAddressList = (item) => {
    setAddressList(item.id)
  }

  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      title='移动地址簿'
      width={480}
      style={{ top: 240 }}
      data-class='move-address'
      closable={false}
      wrapClassName='modal-move-address'>
      <Form
        name='form-move-address'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        initialValues={{ type: 'none' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Form.Item label='当前地址簿' name='book1' validateTrigger='onSubmit'>
          <div className='now-address fx-start-center'>
            <div className='fx-start-center'>
              <img src={codeImg} alt='' />
              <span>赛邮云技术部通讯录</span>
            </div>
            <div style={{ marginLeft: '40px' }}>
              <span className='num-p'>99</span> 个联系人
            </div>
          </div>
        </Form.Item>
        {list.map((item) => (
          <div
            className={`now-address2 fx-start-center ${
              addressList === item.id && 'active'
            }`}
            key={item.id}
            onClick={() => handelAddressList(item)}>
            <div className='fx-start-center'>
              <img src={codeImg} alt='' />
              <span>{item.title}</span>
            </div>
            <div style={{ marginLeft: '40px' }}>
              <span className='num-p'>{item.num}</span> 个联系人
            </div>
          </div>
        ))}
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
