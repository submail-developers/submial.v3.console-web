import { useState, useImperativeHandle, forwardRef, useRef } from 'react'
import { Modal, Form, Input, Space, Statistic, App } from 'antd'
import type { CountdownProps } from 'antd'
import { getMobCode, saveRcsSetting } from '@/api'
import { useAppDispatch } from '@/store/hook'
import { initSetting } from '@/store/reducers/settingRcs'
import formRules from '@/utils/formRules'

type Props = {}

const { Search } = Input
const { Countdown } = Statistic

const time = 60 // 倒计时-秒

const EnterButton = forwardRef((props, ref) => {
  useImperativeHandle(ref, () => {
    return {
      open,
      getStatus,
    }
  })

  const [show, setShow] = useState(false) // 显示倒计时
  const [value, setValue] = useState<number>(0) // 倒计时停止的时间戳

  // 倒计时结束
  const onFinish: CountdownProps['onFinish'] = () => {
    setShow(false)
  }
  //显示倒计时
  const open = () => {
    setValue(Date.now() + 1000 * time)
    setShow(true)
  }
  // 返回是否正在倒计时
  const getStatus = (): boolean => {
    return show
  }

  return (
    <Space style={{ width: 70 }} align='center'>
      {!show ? (
        <div className='text-center'>获取验证码</div>
      ) : (
        <div className='fx-center-center' style={{ width: 70 }}>
          <Countdown
            title=''
            value={value}
            format='ss'
            onFinish={onFinish}
            valueStyle={{ color: '#fff' }}
          />
        </div>
      )}
    </Space>
  )
})

function Fn(props: Props, ref) {
  useImperativeHandle(ref, () => {
    return {
      open,
    }
  })
  const dispatch = useAppDispatch()
  const { message } = App.useApp()
  const enterRef = useRef(null)
  const [form] = Form.useForm()
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sendLoading, setSendLoading] = useState(false)
  const open = () => {
    form.resetFields()
    setShow(true)
  }
  const handleOk = async () => {
    setLoading(true)
    try {
      const { address, code } = await form.validateFields()
      if (!code) {
        form.setFields([
          {
            name: 'code',
            errors: ['请输入验证码'],
          },
        ])
        setLoading(false)
        return
      }
      const res = await saveRcsSetting({
        type: 'sms',
        address,
        code,
      })
      if (res.status == 'success') {
        message.success('保存成功')
        setShow(false)
        dispatch(initSetting())
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const getCode = async () => {
    try {
      if (enterRef.current.getStatus()) {
        return
      }
      setSendLoading(true)
      const { address } = await form.validateFields()
      const res = await getMobCode({ address })
      enterRef.current.open()
      if (res.status == 'success') {
        message.success('验证码已发送')
      }
      setSendLoading(false)
    } catch (error) {
      setSendLoading(false)
    }
  }

  return (
    <Modal
      onOk={handleOk}
      confirmLoading={loading}
      open={show}
      onCancel={() => setShow(false)}
      title='新增手机号'
      width={600}>
      <Form
        name='setting-add-mob'
        form={form}
        labelCol={{ span: 4 }}
        layout='horizontal'
        validateTrigger='onSubmit'
        autoComplete='off'>
        <Form.Item
          label='手机号'
          name='address'
          required
          rules={[
            {
              validator: formRules.validateMobile,
            },
          ]}>
          <Search
            placeholder='请输入手机号'
            allowClear={false}
            loading={sendLoading}
            enterButton={<EnterButton ref={enterRef} />}
            onSearch={getCode}
          />
        </Form.Item>
        <Form.Item label='验证码' name='code' required>
          <Input style={{ width: 120 }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default forwardRef(Fn)
