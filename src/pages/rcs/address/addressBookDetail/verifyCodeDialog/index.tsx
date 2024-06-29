import { useState, useEffect, forwardRef, useRef, useCallback } from 'react'
import { Modal, Form, App, Row, Col, Button, Input, Select } from 'antd'
import {
  // verifyCodeSms,
  // smsCodeVerify,
  exportAddress,
  downLaodFile,
} from '@/api'
import { API } from 'apis'
import './index.scss'
const { Option } = Select

interface Props {
  open: boolean
  fileType: string
  exportParams: any[]
  exportId: string
  onCancel: () => void
  // onSearch: () => void
}

const Dialog = (props: Props, ref: any) => {
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const intervalRef = useRef(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current)
    }
  }, [])
  useEffect(() => {
    if (count === 3) {
      intervalRef.current = setInterval(() => {
        setCount((preCount) => preCount - 1)
      }, 1000)
    } else if (count === 0) {
      clearInterval(intervalRef.current)
    }
  }, [count])

  // 点击获取验证码
  const getCode = useCallback(async () => {
    setCount(3)
    try {
      // 发送短信验证码
      // const res = await verifyCodeSms('')
      // if (res.status == 'success') {
      // }
    } catch (error) {}
  }, [])

  const handleOk = async () => {
    const formValues = form.getFieldsValue()
    try {
      //拿到验证码
      // const res = await smsCodeVerify({
      //   code: formValues.code,
      // })
      // if (res.status == 'success') {
      //   exportFile()
      // }
    } catch (error) {}
  }

  const exportFile = async () => {
    const res = await exportAddress({
      id: props.exportId,
      type: props.fileType,
    })
    if (res.status == 'success') {
      downLaodFile('')
    } else {
      message.error(res.message)
    }
  }

  const onFinish = () => {}
  const onFinishFailed = () => {}

  return (
    <Modal
      open={props.open}
      onCancel={props.onCancel}
      title='短信验证码'
      onOk={handleOk}
      width={480}
      style={{ top: 240 }}
      data-class='verify-code'
      closable={false}
      wrapClassName='modal-verify-code'>
      <Form
        name='form-verify-code'
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        layout='vertical'
        initialValues={{ tag: '4' }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'>
        <Row gutter={16}>
          <Col span={24} md={12} xl={16}>
            <Form.Item label='验证码' name='code' validateTrigger='onSubmit'>
              <Input placeholder='请输入短信验证码' />
            </Form.Item>
          </Col>
          <Col span={24} md={12} xl={8}>
            <Form.Item label=' ' validateTrigger='onSubmit'>
              <Button
                type='primary'
                className='w-100'
                htmlType='submit'
                disabled={!!count}
                onClick={getCode}>
                {count ? `${count} s` : '获取验证码'}
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <div className='fn12 gray-color'>
          请点击获取验证码按钮发送确认短信，并在验证码输入框内输入您收到的短信验证码
        </div>
      </Form>
    </Modal>
  )
}
export default forwardRef(Dialog)
