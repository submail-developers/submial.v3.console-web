import { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Modal, Form, App } from 'antd'

import { API } from 'apis'
import './index.scss'
import redImg from '@/assets/rcs/address/folder_red.png'
import purpleImg from '@/assets/rcs/address/folder_purple.png'
import cyanImg from '@/assets/rcs/address/folder_cyan.png'
import blueImg from '@/assets/rcs/address/folder_blue.png'
import greenImg from '@/assets/rcs/address/folder_green.png'
import yellowImg from '@/assets/rcs/address/folder_yellow.png'

import { moveAddressBook } from '@/api'
interface Props {
  FolderList
  ids: any
  singleId: string
  isSingle: boolean
  open: boolean
  onCancel: () => void
  onSearch: () => void
}

const addresssIcon = {
  '0': blueImg,
  '1': redImg,
  '2': purpleImg,
  '3': cyanImg,
  '4': blueImg,
  '5': greenImg,
  '6': yellowImg,
}

const Dialog = (props: Props, ref: any) => {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const [addressList, setAddressList] = useState()
  const [folderId, setFolderId] = useState()
  const handleOk = async () => {
    try {
      let ids = props.ids.length > 0 ? props.ids.join(',') : props.singleId
      let params = {
        ids: ids,
        folder: folderId,
        type: 1,
        flag: 1,
      }
      const res = await moveAddressBook(params)
      if (res.status == 'success') {
        message.success('移动成功')
        props.onSearch()
        props.onCancel()
      }
    } catch (error) {
      console.log(error)
    }
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
    setFolderId(item.id)
  }

  return (
    <Modal
      onOk={handleOk}
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
        {/* <Form.Item label='当前地址簿' name='book1' validateTrigger='onSubmit'>
          <div className='now-address fx-start-center'>
            <div className='fx-start-center'>
              <img src={codeImg} alt='' />
              <span>赛邮云技术部通讯录</span>
            </div>
            <div style={{ marginLeft: '40px' }}>
              <span className='num-p'>99</span> 个联系人
            </div>
          </div>
        </Form.Item> */}

        {props.FolderList.map((item) => (
          <div
            className={`now-address2 fx-start-center ${
              addressList === item.id && 'active'
            }`}
            key={item.id}
            onClick={() => handelAddressList(item)}>
            <div className='fx-start-center'>
              <img src={addresssIcon[item.tag]} alt='' />
              <span>{item.title}</span>
            </div>
            <div style={{ marginLeft: '40px' }}>
              <span className='num-p'>{item.num}</span> 个地址簿
            </div>
          </div>
        ))}
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
